import { Request, Response } from "express";
import { pool } from "../db/connection";
import { findAvailableRoom } from "../services/availability.service";
import { sendBookingConfirmation } from "../services/email.service";

function toDateOnly(value: Date) {
  return value.toISOString().slice(0, 10);
}

export async function createBooking(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ message: "Authentication required" });

  const client = await pool.connect();
  let booking;

  try {
    await client.query("BEGIN");

    const room = await findAvailableRoom({
      hotelId: req.body.hotelId,
      roomType: req.body.roomType,
      checkIn: req.body.checkIn,
      checkOut: req.body.checkOut
    }, client);

    if (!room) {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: "No available room for the selected dates" });
    }

    const bookingResult = await client.query<{ id: number }>(
      `INSERT INTO bookings (user_id, room_id, check_in, check_out, status)
       VALUES ($1, $2, $3, $4, 'confirmed')
       RETURNING id`,
      [req.user.id, room.id, toDateOnly(req.body.checkIn), toDateOnly(req.body.checkOut)]
    );

    const result = await client.query(
      `SELECT b.*, billing.amount, h.name AS hotel_name, r.room_type, u.email, u.name AS customer_name
       FROM bookings b
       JOIN rooms r ON r.id = b.room_id
       JOIN hotels h ON h.id = r.hotel_id
       JOIN users u ON u.id = b.user_id
       LEFT JOIN billing ON billing.booking_id = b.id
       WHERE b.id = $1
       LIMIT 1`,
      [bookingResult.rows[0].id]
    );

    booking = result.rows[0];
    await client.query("COMMIT");
  } catch (error: any) {
    await client.query("ROLLBACK");
    if (error.code === "23P01") {
      return res.status(409).json({ message: "No available room for the selected dates" });
    }
    return res.status(500).json({ message: "Could not create booking" });
  } finally {
    client.release();
  }

  sendBookingConfirmation({
    to: booking.email,
    name: booking.customer_name,
    hotelName: booking.hotel_name,
    roomType: booking.room_type,
    checkIn: toDateOnly(req.body.checkIn),
    checkOut: toDateOnly(req.body.checkOut),
    amount: booking.amount
  }).catch((error) => {
    console.error("Booking confirmation email failed", error);
  });

  return res.status(201).json(booking);
}

export async function getMyBookings(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ message: "Authentication required" });

  const result = await pool.query(
    `SELECT b.*, billing.amount, h.name AS hotel_name, h.location, r.room_type, r.price
     FROM bookings b
     JOIN rooms r ON r.id = b.room_id
     JOIN hotels h ON h.id = r.hotel_id
     LEFT JOIN billing ON billing.booking_id = b.id
     WHERE b.user_id = $1
     ORDER BY b.created_at DESC`,
    [req.user.id]
  );

  return res.json(result.rows);
}

export async function getAllBookings(_req: Request, res: Response) {
  const result = await pool.query(
    `SELECT b.*, billing.amount, h.name AS hotel_name, h.location, r.room_type, u.name AS customer_name, u.email
     FROM bookings b
     JOIN rooms r ON r.id = b.room_id
     JOIN hotels h ON h.id = r.hotel_id
     JOIN users u ON u.id = b.user_id
     LEFT JOIN billing ON billing.booking_id = b.id
     ORDER BY b.created_at DESC`
  );

  return res.json(result.rows);
}

export async function getBookingById(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ message: "Authentication required" });

  const userClause = req.user.role === "customer" ? "AND b.user_id = $2" : "";
  const params = req.user.role === "customer" ? [req.params.id, req.user.id] : [req.params.id];
  const result = await pool.query(
    `SELECT b.*, billing.amount, h.name AS hotel_name, h.location, r.room_type, r.price
     FROM bookings b
     JOIN rooms r ON r.id = b.room_id
     JOIN hotels h ON h.id = r.hotel_id
     LEFT JOIN billing ON billing.booking_id = b.id
     WHERE b.id = $1 ${userClause}
     LIMIT 1`,
    params
  );

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Booking not found" });
  }

  return res.json(result.rows[0]);
}

export async function cancelBooking(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ message: "Authentication required" });

  const userClause = req.user.role === "customer" ? "AND user_id = $2" : "";
  const params = req.user.role === "customer" ? [req.params.id, req.user.id] : [req.params.id];
  const result = await pool.query(`SELECT * FROM bookings WHERE id = $1 ${userClause} LIMIT 1`, params);

  const booking = result.rows[0];
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkIn = new Date(booking.check_in);
  checkIn.setHours(0, 0, 0, 0);
  if (checkIn <= today) {
    return res.status(400).json({ message: "Booking cannot be cancelled after it has started" });
  }

  await pool.query("UPDATE bookings SET status = 'cancelled' WHERE id = $1", [req.params.id]);
  return res.json({ message: "Booking cancelled" });
}
