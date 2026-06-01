import { Router } from "express";
import { createRoom, deleteRoom, getRoomById, updateRoom } from "../controllers/room.controller";
import { asyncHandler } from "../middleware/async.middleware";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { roomSchema, validateBody } from "../middleware/validate.middleware";

export const roomRoutes = Router();

roomRoutes.get("/:id", requireAuth, requireRole("admin"), asyncHandler(getRoomById));
roomRoutes.post("/", requireAuth, requireRole("admin"), validateBody(roomSchema), asyncHandler(createRoom));
roomRoutes.put("/:id", requireAuth, requireRole("admin"), validateBody(roomSchema), asyncHandler(updateRoom));
roomRoutes.delete("/:id", requireAuth, requireRole("admin"), asyncHandler(deleteRoom));
