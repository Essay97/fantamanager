import { pool } from "../../db/index.js";

export interface GiocatoreRow {
  id: number;
  nome: string;
  base_stipendio: number;
}

export interface ContrattoRow {
  id: number;
  giocatore_id: number;
  squadra_id: number;
}

export interface TesseramentoRow {
  id: number;
  giocatore_id: number;
  squadra_id: number;
  data_inizio: string;
  data_scadenza: string;
}

export interface QuoteRow {
  id: number;
  giocatore_id: number;
  squadra_id: number;
  percentuale: number;
}

export async function listGiocatoriLinkedToSquadra(
  squadraId: number,
): Promise<GiocatoreRow[]> {
  const res = await pool.query(
    `SELECT DISTINCT g.id, g.nome, g.base_stipendio
     FROM giocatori g
     LEFT JOIN contratti c ON c.giocatore_id = g.id AND c.squadra_id = $1
     LEFT JOIN tesseramenti t ON t.giocatore_id = g.id AND t.squadra_id = $1
     LEFT JOIN quote_stipendio q ON q.giocatore_id = g.id AND q.squadra_id = $1
     WHERE c.id IS NOT NULL OR t.id IS NOT NULL OR q.id IS NOT NULL
     ORDER BY g.nome`,
    [squadraId],
  );

  return res.rows;
}

export async function getContrattiForGiocatore(
  giocatoreId: number,
): Promise<ContrattoRow[]> {
  const res = await pool.query(
    `SELECT id, giocatore_id, squadra_id
     FROM contratti
     WHERE giocatore_id = $1
     ORDER BY id DESC`,
    [giocatoreId],
  );

  return res.rows;
}

export async function getTesseramentiForGiocatore(
  giocatoreId: number,
): Promise<TesseramentoRow[]> {
  const res = await pool.query(
    `SELECT id, giocatore_id, squadra_id, data_inizio::text, data_scadenza::text
     FROM tesseramenti
     WHERE giocatore_id = $1
     ORDER BY data_scadenza DESC`,
    [giocatoreId],
  );

  return res.rows;
}

export async function getQuoteForGiocatore(
  giocatoreId: number,
): Promise<QuoteRow[]> {
  const res = await pool.query(
    `SELECT id, giocatore_id, squadra_id, percentuale
     FROM quote_stipendio
     WHERE giocatore_id = $1`,
    [giocatoreId],
  );

  return res.rows.map((r: any) => ({
    ...r,
    percentuale: Number(r.percentuale),
  }));
}

export async function getGiocatoreById(
  id: number,
): Promise<GiocatoreRow | null> {
  const res = await pool.query(
    `SELECT id, nome, base_stipendio FROM giocatori WHERE id = $1`,
    [id],
  );
  return res.rows[0] ?? null;
}
