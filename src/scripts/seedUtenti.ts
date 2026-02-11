import "../config/loadEnv.js";
import { pool } from "../db/index.js";
import { hashPassword } from "../auth/password.js";

async function seed() {
  console.log("🌱 Seeding database...");

  const users = [
    { username: "Saggio", password: "1234", ruolo: "tech" },
    { username: "Tortone", password: "1234", ruolo: "fantamanager" },
    { username: "Francesco", password: "1234", ruolo: "fantamanager" },
    { username: "jacopoogilardi", password: "1234", ruolo: "fantamanager" },
    { username: "Andrea", password: "1234", ruolo: "fantamanager" },
    { username: "ALE5fam", password: "1234", ruolo: "fantamanager" },
    { username: "aManda", password: "1234", ruolo: "fantamanager" },
    { username: "fedepasche", password: "1234", ruolo: "fantamanager" },
    { username: "Tunii", password: "1234", ruolo: "fantamanager" },
    { username: "Gabriele", password: "1234", ruolo: "fantamanager" },
    { username: "Trotsky420", password: "1234", ruolo: "fantamanager" },
    { username: "Pres Giuseppe Simone", password: "1234", ruolo: "presidente" },
  ];

  const hashes = await Promise.all(users.map((u) => hashPassword(u.password)));

  const values: any[] = [];
  const rows = users
    .map((u, i) => {
      const base = i * 3;
      values.push(u.username, hashes[i], u.ruolo);
      return `($${base + 1}, $${base + 2}, $${base + 3})`;
    })
    .join(",\n");

  await pool.query(
    `INSERT INTO utenti (username, password_hash, ruolo)\n     VALUES ${rows}\n     ON CONFLICT (username) DO NOTHING`,
    values,
  );

  console.log("✅ Seed completato");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed fallito", err);
  process.exit(1);
});
