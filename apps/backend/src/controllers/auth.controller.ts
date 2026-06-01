import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service";

export async function register(req: Request, res: Response) {
  try {
    const result = await registerUser(req.body);
    return res.status(201).json(result);
  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "Email is already registered" });
    }
    console.error("Registration failed:", error);
    return res.status(500).json({ message: "Could not register user" });
  }
}

export async function login(req: Request, res: Response) {
  const result = await loginUser(req.body);

  if (!result) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  return res.json(result);
}
