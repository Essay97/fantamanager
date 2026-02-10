-- Up Migration
CREATE TABLE squadre (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  creato_il TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE proprieta_squadre (
  squadra_id INTEGER NOT NULL REFERENCES squadre(id) ON DELETE CASCADE,
  utente_id INTEGER NOT NULL REFERENCES utenti(id) ON DELETE CASCADE,
  PRIMARY KEY (squadra_id, utente_id)
);
-- Down Migration