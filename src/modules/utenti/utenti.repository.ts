import { pool } from "../../db/index.js";

/**
 * Tipo interno che rappresenta una riga della tabella utenti.
 * NON esportarlo fuori dal repository.
 */
interface UtenteRow {
  id: number;
  username: string;
  password_hash: string;
  ruolo: "fantamanager" | "presidente" | "tech";
  attivo: boolean;
}

/**
 * Trova un utente per username.
 * Usato principalmente per l'autenticazione.
 */
export async function findByUsername(
  username: string,
): Promise<UtenteRow | null> {
  const res = await pool.query(
    `SELECT id, username, password_hash, ruolo, attivo
     FROM utenti
     WHERE username = $1`,
    [username],
  );

  return res.rows[0] ?? null;
}

/**
 * Lista tutti gli utenti (per admin tech).
 */
export async function listAll(): Promise<UtenteRow[]> {
  const res = await pool.query(
    `SELECT id, username, password_hash, ruolo, attivo
     FROM utenti
     ORDER BY username`,
  );

  return res.rows;
}

/**
 * Crea un nuovo utente.
 * ATTENZIONE: si aspetta la password GIA' hashata.
 */
export async function createUtente(params: {
  username: string;
  passwordHash: string;
  ruolo: "fantamanager" | "presidente" | "tech";
}): Promise<UtenteRow> {
  const { username, passwordHash, ruolo } = params;

  const res = await pool.query(
    `INSERT INTO utenti (username, password_hash, ruolo)
     VALUES ($1, $2, $3)
     RETURNING id, username, password_hash, ruolo, attivo`,
    [username, passwordHash, ruolo],
  );

  return res.rows[0];
}

/**
 * Attiva o disattiva un utente.
 */
export async function setAttivo(id: number, attivo: boolean): Promise<void> {
  await pool.query(
    `UPDATE utenti
     SET attivo = $2
     WHERE id = $1`,
    [id, attivo],
  );
}

/**
 * Aggiorna la password di un utente.
 * ATTENZIONE: si aspetta la password GIA' hashata.
 */
export async function updatePassword(
  id: number,
  passwordHash: string,
): Promise<void> {
  await pool.query(
    `UPDATE utenti
     SET password_hash = $2
     WHERE id = $1`,
    [id, passwordHash],
  );
}

export async function findById(id: number) {
  const res = await pool.query(
    `SELECT id, username, password_hash, ruolo, attivo
     FROM utenti
     WHERE id = $1`,
    [id],
  );
  return res.rows[0] ?? null;
}
