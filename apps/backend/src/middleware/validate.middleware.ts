import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export function validateBody(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors
      });
    }

    req.body = parsed.data;
    return next();
  };
}

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "customer"]).optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const hotelSchema = z.object({
  name: z.string().min(2),
  location: z.string().min(2)
});

export const roomSchema = z.object({
  hotelId: z.coerce.number().int().positive(),
  roomType: z.string().min(2),
  price: z.coerce.number().positive(),
  isAvailable: z.boolean().optional()
});

export const bookingSchema = z.object({
  hotelId: z.coerce.number().int().positive(),
  roomType: z.string().min(2),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date()
}).refine((value) => value.checkOut > value.checkIn, {
  message: "checkOut must be after checkIn",
  path: ["checkOut"]
});
