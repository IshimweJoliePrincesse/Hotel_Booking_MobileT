import { readFileSync } from "node:fs";
import path from "node:path";
import { pool } from "./connection";

async function initDatabase() {
  const schemaPath = path.join(__dirname, "schema.sql");
  const schema = readFileSync(schemaPath, "utf8");

  await pool.query(schema);
  await pool.end();

  console.log("Database schema applied successfully.");
}

initDatabase().catch(async (error) => {
  console.error("Failed to apply database schema:", error);
  await pool.end();
  process.exit(1);
});
