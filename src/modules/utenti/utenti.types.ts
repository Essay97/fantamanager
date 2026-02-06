/**
 * Ruoli possibili di un utente nel sistema
 * Devono matchare ESATTAMENTE i valori salvati nel DB
 */
export type Ruolo = "fantamanager" | "presidente" | "tech";

/**
 * Utente di dominio
 * - NON contiene dati sensibili
 * - Può essere passato a route / frontend / API
 */
export interface Utente {
  id: number;
  username: string;
  ruolo: Ruolo;
  attivo: boolean;
}

/**
 * Utente usato per l'autenticazione
 * - Contiene l'hash della password
 * - Deve essere usato SOLO da auth / passport
 * - NON deve mai uscire verso le route
 */
export interface UtenteAuth {
  id: number;
  username: string;
  passwordHash: string;
  ruolo: Ruolo;
  attivo: boolean;
}
