import "../config/loadEnv.js";
import { pool } from "../db/index.js";

async function seed() {
  console.log("🌱 Seeding squads... (");

  const teams: { nome: string; proprietari: number[] }[] = [
    { nome: "ASD Avetrana Calcio", proprietari: [1, 3] },
    { nome: "Apoelkann", proprietari: [4] },
    { nome: "Corto Musah", proprietari: [5] },
    { nome: "Drin Dries", proprietari: [6] },
    { nome: "JUST DO IG", proprietari: [7] },
    { nome: "Lautaro Sii o Mio Signore", proprietari: [8] },
    { nome: "Matilda Semitica", proprietari: [9, 10] },
    { nome: "Mein Kempf", proprietari: [11] },
    { nome: "Sport Cuarta Internacional", proprietari: [12] },
    { nome: "Virtus Monella", proprietari: [13] },
  ];

  for (const t of teams) {
    console.log(`- Processing team: ${t.nome}`);

    // Check if already exists
    const existing = await pool.query(
      `SELECT id FROM squadre WHERE nome = $1`,
      [t.nome],
    );

    let squadraId: number;

    if (existing.rowCount != null && existing.rowCount > 0) {
      squadraId = existing.rows[0].id;
      console.log(`  -> already exists (id=${squadraId})`);
    } else {
      const ins = await pool.query(
        `INSERT INTO squadre (nome) VALUES ($1) RETURNING id`,
        [t.nome],
      );
      squadraId = ins.rows[0].id;
      console.log(`  -> created (id=${squadraId})`);
    }

    for (const uId of t.proprietari) {
      await pool.query(
        `INSERT INTO proprieta_squadre (squadra_id, utente_id)
         VALUES ($1, $2)
         ON CONFLICT (squadra_id, utente_id) DO NOTHING`,
        [squadraId, uId],
      );
      console.log(`    - linked owner id=${uId}`);
    }
  }

  console.log("✅ Squad seed completed");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Squad seed failed", err);
  process.exit(1);
});
