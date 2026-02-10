import * as repo from "./squadre.repository.js";
import { pool } from "../../db/index.js";

/**
 * Crea una squadra e associa i proprietari forniti in modo atomico.
 */
export async function createSquadreConProprietari(params: {
  nome: string;
  proprietari: number[];
}): Promise<repo.SquadraConProprietari> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const insertSquadra = await client.query(
      `INSERT INTO squadre (nome)
       VALUES ($1)
       RETURNING id, nome, creato_il`,
      [params.nome],
    );

    const squadraRow = insertSquadra.rows[0];
    const proprietari: number[] = [];

    for (const utenteId of params.proprietari ?? []) {
      await client.query(
        `INSERT INTO proprieta_squadre (squadra_id, utente_id)
         VALUES ($1, $2)
         ON CONFLICT (squadra_id, utente_id) DO NOTHING`,
        [squadraRow.id, utenteId],
      );

      proprietari.push(utenteId);
    }

    await client.query("COMMIT");

    return {
      id: squadraRow.id,
      nome: squadraRow.nome,
      creato_il: squadraRow.creato_il,
      proprietari,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function getSquadraPerID(
  id: number,
): Promise<repo.SquadraConProprietari | null> {
  return await repo.findSquadraPerId(id);
}
