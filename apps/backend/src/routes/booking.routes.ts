import { Router } from "express";
import {
  cancelBooking,
  createBooking,
  getAllBookings,
  getBookingById,
  getMyBookings
} from "../controllers/booking.controller";
import { asyncHandler } from "../middleware/async.middleware";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { bookingSchema, validateBody } from "../middleware/validate.middleware";

export const bookingRoutes = Router();

bookingRoutes.post("/", requireAuth, requireRole("customer"), validateBody(bookingSchema), asyncHandler(createBooking));
bookingRoutes.get("/my", requireAuth, requireRole("customer"), asyncHandler(getMyBookings));
bookingRoutes.get("/all", requireAuth, requireRole("admin"), asyncHandler(getAllBookings));
bookingRoutes.get("/:id", requireAuth, asyncHandler(getBookingById));
bookingRoutes.delete("/:id", requireAuth, asyncHandler(cancelBooking));
