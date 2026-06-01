import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { pool } from "../db/connection";
import { UserRole } from "../middleware/auth.middleware";

interface UserRow {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

function signToken(user: Pick<UserRow, "id" | "email" | "role">) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, env.jwtSecret, {
    expiresIn: "7d"
  });
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}) {
  const passwordHash = await bcrypt.hash(input.password, 10);
  const role = input.role ?? "customer";

  const result = await pool.query<{ id: number }>(
    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id",
    [input.name, input.email, passwordHash, role]
  );

  const user = { id: result.rows[0].id, name: input.name, email: input.email, role };
  return { user, token: signToken(user) };
}

export async function loginUser(input: { email: string; password: string }) {
  const result = await pool.query<UserRow>("SELECT * FROM users WHERE email = $1 LIMIT 1", [input.email]);

  const user = result.rows[0];
  if (!user) return null;

  const passwordMatches = await bcrypt.compare(input.password, user.password);
  if (!passwordMatches) return null;

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token: signToken(user)
  };
}
