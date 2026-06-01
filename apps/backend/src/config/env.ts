import dotenv from "dotenv";

dotenv.config();

function required(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 5000),
  jwtSecret: required("JWT_SECRET", "dev_secret_change_me"),
  db: {
    host: required("DB_HOST", "localhost"),
    port: Number(process.env.DB_PORT ?? 5432),
    user: required("DB_USER", "postgres"),
    password: process.env.DB_PASSWORD ?? "",
    database: required("DB_NAME", "hotel_booking")
  },
  mail: {
    host: process.env.MAIL_HOST ?? "",
    port: Number(process.env.MAIL_PORT ?? 587),
    user: process.env.MAIL_USER ?? "",
    pass: process.env.MAIL_PASS ?? "",
    from: process.env.MAIL_FROM ?? "Hotel Booking <no-reply@hotel-booking.local>"
  }
};
