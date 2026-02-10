import { pool } from "../../db/index.js";

interface SquadraRow {
  id: number;
  nome: string;
  creato_il: Date;
}

export interface SquadraConProprietari {
  id: number;
  nome: string;
  creato_il: Date;
  proprietari: number[];
}

/**
 * Crea una nuova squadra.
 */
export async function createSquadra(params: {
  nome: string;
}): Promise<SquadraRow> {
  const { nome } = params;

  const res = await pool.query(
    `INSERT INTO squadre (nome)
     VALUES ($1)
     RETURNING id, nome, creato_il`,
    [nome],
  );

  return res.rows[0];
}

/**
 * Aggiunge un proprietario a una squadra.
 * Se la relazione esiste già non fallisce.
 */
export async function addProprietario(
  squadraId: number,
  utenteId: number,
): Promise<void> {
  await pool.query(
    `INSERT INTO proprieta_squadre (squadra_id, utente_id)
     VALUES ($1, $2)
     ON CONFLICT (squadra_id, utente_id) DO NOTHING`,
    [squadraId, utenteId],
  );
}

/**
 * Trova una squadra per id e include la lista di proprietari (id utenti).
 */
export async function findSquadraPerId(
  id: number,
): Promise<SquadraConProprietari | null> {
  const res = await pool.query(
    `SELECT s.id, s.nome, s.creato_il, p.utente_id
     FROM squadre s
     LEFT JOIN proprieta_squadre p ON p.squadra_id = s.id
     WHERE s.id = $1`,
    [id],
  );

  if (res.rowCount === 0) {
    return null;
  }

  const first = res.rows[0];
  const proprietari = res.rows
    .map((r: any) => r.utente_id)
    .filter((v: number | null) => v !== null) as number[];

  return {
    id: first.id,
    nome: first.nome,
    creato_il: first.creato_il,
    proprietari,
  };
}
