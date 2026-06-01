import { Request, Response } from "express";
import { getBillByBookingId } from "../services/billing.service";

export async function getBill(req: Request, res: Response) {
  const bill = await getBillByBookingId(Number(req.params.bookingId), req.user);

  if (!bill) {
    return res.status(404).json({ message: "Bill not found" });
  }

  return res.json(bill);
}
