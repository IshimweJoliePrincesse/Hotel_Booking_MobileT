import { Request, Response } from "express";
import { pool } from "../db/connection";

async function hotelExists(hotelId: number) {
  const result = await pool.query("SELECT 1 FROM hotels WHERE id = $1 LIMIT 1", [hotelId]);
  return Boolean(result.rows[0]);
}

export async function createRoom(req: Request, res: Response) {
  if (!(await hotelExists(req.body.hotelId))) {
    return res.status(404).json({ message: "Hotel not found. Create the hotel before adding rooms." });
  }

  const result = await pool.query<{ id: number }>(
    `INSERT INTO rooms (hotel_id, room_type, price, is_available)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [req.body.hotelId, req.body.roomType, req.body.price, req.body.isAvailable ?? true]
  );

  return res.status(201).json({ id: result.rows[0].id, ...req.body });
}

export async function getHotelRooms(req: Request, res: Response) {
  const result = await pool.query(
    "SELECT * FROM rooms WHERE hotel_id = $1 ORDER BY room_type, price",
    [req.params.hotelId]
  );

  return res.json(result.rows);
}

export async function getRoomById(req: Request, res: Response) {
  const result = await pool.query("SELECT * FROM rooms WHERE id = $1 LIMIT 1", [req.params.id]);

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Room not found" });
  }

  return res.json(result.rows[0]);
}

export async function updateRoom(req: Request, res: Response) {
  if (!(await hotelExists(req.body.hotelId))) {
    return res.status(404).json({ message: "Hotel not found. Choose an existing hotel for this room." });
  }

  const result = await pool.query(
    `UPDATE rooms
     SET hotel_id = $1, room_type = $2, price = $3, is_available = $4
     WHERE id = $5`,
    [req.body.hotelId, req.body.roomType, req.body.price, req.body.isAvailable ?? true, req.params.id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Room not found" });
  }

  return res.json({ id: Number(req.params.id), ...req.body });
}

export async function deleteRoom(req: Request, res: Response) {
  const result = await pool.query("DELETE FROM rooms WHERE id = $1", [req.params.id]);

  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Room not found" });
  }

  return res.status(204).send();
}
