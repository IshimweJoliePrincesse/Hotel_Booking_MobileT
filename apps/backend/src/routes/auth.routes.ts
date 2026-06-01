import { Router } from "express";
import { login, register } from "../controllers/auth.controller";
import { asyncHandler } from "../middleware/async.middleware";
import { loginSchema, registerSchema, validateBody } from "../middleware/validate.middleware";

export const authRoutes = Router();

authRoutes.post("/register", validateBody(registerSchema), asyncHandler(register));
authRoutes.post("/login", validateBody(loginSchema), asyncHandler(login));
