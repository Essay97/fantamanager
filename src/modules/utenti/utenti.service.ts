import * as utentiRepository from "./utenti.repository.js";
import type { Utente, UtenteAuth, Ruolo } from "./utenti.types.js";
import { hashPassword, verifyPassword } from "../../auth/password.js";

/**
 * Recupera un utente per autenticazione.
 * Usato da Passport.
 */
export async function getUtentePerAuth(
  username: string,
): Promise<UtenteAuth | null> {
  const row = await utentiRepository.findByUsername(username);
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    username: row.username,
    passwordHash: row.password_hash,
    ruolo: row.ruolo,
    attivo: row.attivo,
  };
}

/**
 * Lista tutti gli utenti (admin tech).
 * NON espone password.
 */
export async function listaUtenti(): Promise<Utente[]> {
  const rows = await utentiRepository.listAll();

  return rows.map((row) => ({
    id: row.id,
    username: row.username,
    ruolo: row.ruolo,
    attivo: row.attivo,
  }));
}

/**
 * Crea un nuovo utente.
 * - hasha la password
 * - delega l'inserimento al repository
 */
export async function creaUtente(params: {
  username: string;
  password: string;
  ruolo: Ruolo;
}): Promise<Utente> {
  const { username, password, ruolo } = params;

  const passwordHash = await hashPassword(password);

  try {
    const row = await utentiRepository.createUtente({
      username,
      passwordHash,
      ruolo,
    });

    return {
      id: row.id,
      username: row.username,
      ruolo: row.ruolo,
      attivo: row.attivo,
    };
  } catch (err: any) {
    // gestione errore username duplicato (Postgres)
    if (err.code === "23505") {
      throw new Error("USERNAME_ALREADY_EXISTS");
    }
    throw err;
  }
}

/**
 * Attiva o disattiva un utente.
 */
export async function setUtenteAttivo(
  id: number,
  attivo: boolean,
): Promise<void> {
  await utentiRepository.setAttivo(id, attivo);
}

/**
 * Reset password (admin tech).
 */
export async function resetPassword(
  id: number,
  nuovaPassword: string,
): Promise<void> {
  const passwordHash = await hashPassword(nuovaPassword);
  await utentiRepository.updatePassword(id, passwordHash);
}

/**
 * Cambio password self-service.
 * - verifica la password attuale
 * - aggiorna con la nuova
 */
export async function cambiaPassword(
  userId: number,
  passwordAttuale: string,
  passwordNuova: string,
): Promise<void> {
  // recupero utente per auth tramite ID
  // (in futuro potrai avere findById nel repository)
  const rows = await utentiRepository.listAll();
  const row = rows.find((u) => u.id === userId);

  if (!row) {
    throw new Error("USER_NOT_FOUND");
  }

  const ok = await verifyPassword(passwordAttuale, row.password_hash);

  if (!ok) {
    throw new Error("INVALID_PASSWORD");
  }

  const newHash = await hashPassword(passwordNuova);
  await utentiRepository.updatePassword(userId, newHash);
}

/**
 * Recupera un utente per ID, con hash password.
 * Usato da Passport (deserializeUser).
 */
export async function getUtenteById(id: number): Promise<UtenteAuth | null> {
  const row = await utentiRepository.findById(id);

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    username: row.username,
    passwordHash: row.password_hash,
    ruolo: row.ruolo,
    attivo: row.attivo,
  };
}
