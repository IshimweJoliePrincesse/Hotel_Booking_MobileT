import nodemailer from "nodemailer";
import { env } from "../config/env";

const mailEnabled = Boolean(env.mail.host && env.mail.user && env.mail.pass);

const transporter = mailEnabled
  ? nodemailer.createTransport({
      host: env.mail.host,
      port: env.mail.port,
      secure: env.mail.port === 465,
      auth: {
        user: env.mail.user,
        pass: env.mail.pass
      }
    })
  : null;

export async function sendBookingConfirmation(input: {
  to: string;
  name: string;
  hotelName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  amount?: string | number | null;
}) {
  if (!transporter) {
    console.log("Email disabled. Booking confirmation:", input);
    return;
  }

  const amount = input.amount == null ? "0.00" : Number(input.amount).toFixed(2);

  await transporter.sendMail({
    from: env.mail.from,
    to: input.to,
    subject: "Hotel booking confirmation",
    text: [
      `Hi ${input.name},`,
      "",
      "Your hotel booking has been confirmed.",
      "",
      `Hotel: ${input.hotelName}`,
      `Room type: ${input.roomType}`,
      `Check-in: ${input.checkIn}`,
      `Check-out: ${input.checkOut}`,
      `Total amount: R${amount}`,
      "",
      "Thank you for booking with us."
    ].join("\n"),
    html: `
      <h2>Booking Confirmed</h2>
      <p>Hi ${input.name}, your hotel booking has been confirmed.</p>
      <ul>
        <li><strong>Hotel:</strong> ${input.hotelName}</li>
        <li><strong>Room type:</strong> ${input.roomType}</li>
        <li><strong>Check-in:</strong> ${input.checkIn}</li>
        <li><strong>Check-out:</strong> ${input.checkOut}</li>
        <li><strong>Total amount:</strong> R${amount}</li>
      </ul>
      <p>Thank you for booking with us.</p>
    `
  });
}
