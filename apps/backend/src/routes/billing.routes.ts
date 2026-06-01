import { Router } from "express";
import { getBill } from "../controllers/billing.controller";
import { asyncHandler } from "../middleware/async.middleware";
import { requireAuth } from "../middleware/auth.middleware";

export const billingRoutes = Router();

billingRoutes.get("/:bookingId", requireAuth, asyncHandler(getBill));
