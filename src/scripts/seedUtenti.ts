import "../config/loadEnv.js";
import { pool } from "../db/index.js";

import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function seed() {
  console.log("🌱 Seeding database...");

  const adminPassword = await hashPassword("1234");
  const presidentPassword = await hashPassword("presidente123");

  await pool.query(
    `INSERT INTO utenti (username, password_hash, ruolo)
     VALUES ($1, $2, $3)
     ON CONFLICT (username) DO NOTHING`,
    ["Saggio", adminPassword, "tech"],
  );

  console.log("✅ Seed completato");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed fallito", err);
  process.exit(1);
});
