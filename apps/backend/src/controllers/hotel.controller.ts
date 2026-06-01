import { Request, Response } from "express";
import { pool } from "../db/connection";

export async function createHotel(req: Request, res: Response) {
  const result = await pool.query<{ id: number }>(
    "INSERT INTO hotels (name, location) VALUES ($1, $2) RETURNING id",
    [req.body.name, req.body.location]
  );

  return res.status(201).json({ id: result.rows[0].id, ...req.body });
}

export async function getHotels(_req: Request, res: Response) {
  const result = await pool.query(
    `SELECT h.*,
      MIN(r.price) AS lowest_price,
      COUNT(r.id) AS room_count
     FROM hotels h
     LEFT JOIN rooms r ON r.hotel_id = h.id
     GROUP BY h.id
     ORDER BY h.created_at DESC`
  );

  return res.json(result.rows);
}

export async function getHotelById(req: Request, res: Response) {
  const hotels = await pool.query("SELECT * FROM hotels WHERE id = $1 LIMIT 1", [req.params.id]);

  if (!hotels.rows[0]) {
    return res.status(404).json({ message: "Hotel not found" });
  }

  const rooms = await pool.query("SELECT * FROM rooms WHERE hotel_id = $1 ORDER BY room_type, price", [
    req.params.id
  ]);

  return res.json({ ...hotels.rows[0], rooms: rooms.rows });
}

export async function updateHotel(req: Request, res: Response) {
  const result = await pool.query(
    "UPDATE hotels SET name = $1, location = $2 WHERE id = $3",
    [req.body.name, req.body.location, req.params.id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Hotel not found" });
  }

  return res.json({ id: Number(req.params.id), ...req.body });
}

export async function deleteHotel(req: Request, res: Response) {
  const result = await pool.query("DELETE FROM hotels WHERE id = $1", [req.params.id]);

  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Hotel not found" });
  }

  return res.status(204).send();
}
