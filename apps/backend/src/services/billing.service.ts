import { pool } from "../db/connection";

interface BillRow {
  id: number;
  booking_id: number;
  amount: string;
  generated_at: Date;
  hotel_name: string;
  room_type: string;
  check_in: Date;
  check_out: Date;
}

export async function getBillByBookingId(bookingId: number, user?: { id: number; role: string }) {
  const userClause = user?.role === "customer" ? "AND b.user_id = $2" : "";
  const params = user?.role === "customer" ? [bookingId, user.id] : [bookingId];

  const result = await pool.query<BillRow>(
    `SELECT billing.*, h.name AS hotel_name, r.room_type, b.check_in, b.check_out
     FROM billing
     JOIN bookings b ON b.id = billing.booking_id
     JOIN rooms r ON r.id = b.room_id
     JOIN hotels h ON h.id = r.hotel_id
     WHERE billing.booking_id = $1 ${userClause}
     LIMIT 1`,
    params
  );

  return result.rows[0] ?? null;
}
