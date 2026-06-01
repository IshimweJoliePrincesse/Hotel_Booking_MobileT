import { NextFunction, Request, Response } from "express";
import { UserRole } from "./auth.middleware";

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You are not allowed to access this resource" });
    }

    return next();
  };
}
