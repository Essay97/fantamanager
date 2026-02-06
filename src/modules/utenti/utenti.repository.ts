import { pool } from "../../db/index.js";

export async function findByUsername(username: string) {
  const result = await pool.query(
    `SELECT id, username, password_hash, ruolo, attivo
     FROM utenti
     WHERE username = $1`,
    [username],
  );

  return result.rows[0] ?? null;
}
