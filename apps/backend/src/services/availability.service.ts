import { PoolClient } from "pg";
import { pool } from "../db/connection";

interface AvailableRoomRow {
  id: number;
  hotel_id: number;
  room_type: string;
  price: string;
}

export async function findAvailableRoom(input: {
  hotelId: number;
  roomType: string;
  checkIn: Date;
  checkOut: Date;
}, client?: PoolClient) {
  const db = client ?? pool;
  const result = await db.query<AvailableRoomRow>(
    `SELECT r.*
     FROM rooms r
     WHERE r.hotel_id = $1
       AND r.room_type = $2
       AND r.is_available = TRUE
       AND NOT EXISTS (
         SELECT 1
         FROM bookings b
         WHERE b.room_id = r.id
           AND b.status = 'confirmed'
           AND $3 < b.check_out
           AND $4 > b.check_in
       )
     ORDER BY r.price ASC, r.id ASC
     LIMIT 1`,
    [input.hotelId, input.roomType, input.checkIn, input.checkOut]
  );

  return result.rows[0] ?? null;
}
