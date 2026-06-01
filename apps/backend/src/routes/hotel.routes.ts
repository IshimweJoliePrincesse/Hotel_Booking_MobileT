import { Router } from "express";
import {
  createHotel,
  deleteHotel,
  getHotelById,
  getHotels,
  updateHotel
} from "../controllers/hotel.controller";
import { getHotelRooms } from "../controllers/room.controller";
import { asyncHandler } from "../middleware/async.middleware";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { hotelSchema, validateBody } from "../middleware/validate.middleware";

export const hotelRoutes = Router();

hotelRoutes.get("/", asyncHandler(getHotels));
hotelRoutes.get("/:id", asyncHandler(getHotelById));
hotelRoutes.get("/:hotelId/rooms", asyncHandler(getHotelRooms));
hotelRoutes.post("/", requireAuth, requireRole("admin"), validateBody(hotelSchema), asyncHandler(createHotel));
hotelRoutes.put("/:id", requireAuth, requireRole("admin"), validateBody(hotelSchema), asyncHandler(updateHotel));
hotelRoutes.delete("/:id", requireAuth, requireRole("admin"), asyncHandler(deleteHotel));
