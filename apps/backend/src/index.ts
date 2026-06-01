import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error.middleware";
import { authRoutes } from "./routes/auth.routes";
import { billingRoutes } from "./routes/billing.routes";
import { bookingRoutes } from "./routes/booking.routes";
import { hotelRoutes } from "./routes/hotel.routes";
import { roomRoutes } from "./routes/room.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "hotel-booking-api" });
});

app.use("/api/users", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/billings", billingRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Hotel booking API running on http://localhost:${env.port}`);
});
