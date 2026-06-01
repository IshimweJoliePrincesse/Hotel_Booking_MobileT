import { NextFunction, Request, Response } from "express";

export function errorHandler(error: any, _req: Request, res: Response, _next: NextFunction) {
  console.error("API error:", error);

  if (error.code === "23503") {
    return res.status(400).json({ message: "Related record does not exist. Check the selected hotel, room, or user." });
  }

  if (error.code === "23505") {
    return res.status(409).json({ message: "This record already exists." });
  }

  if (error.code === "23P01") {
    return res.status(409).json({ message: "No available room for the selected dates" });
  }

  return res.status(500).json({ message: "Server error. Please try again." });
}
