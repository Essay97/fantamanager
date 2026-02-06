import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

/**
 * Genera l'hash di una password.
 * Da usare quando:
 * - crei un utente
 * - resetti una password
 * - cambi password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verifica una password in chiaro contro un hash.
 * Da usare SOLO per login o cambio password.
 */
export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}
