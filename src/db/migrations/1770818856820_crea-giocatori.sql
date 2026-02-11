-- Up Migration

CREATE TABLE giocatori (
	id SERIAL PRIMARY KEY,
	nome TEXT NOT NULL,
	base_stipendio INTEGER NOT NULL DEFAULT 0,
	creato_il TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE contratti (
	id SERIAL PRIMARY KEY,
	giocatore_id INTEGER NOT NULL REFERENCES giocatori(id) ON DELETE CASCADE,
	squadra_id INTEGER NOT NULL REFERENCES squadre(id) ON DELETE CASCADE,
	data_inizio DATE NOT NULL,
	data_scadenza DATE NOT NULL,
	creato_il TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE tesseramenti (
	id SERIAL PRIMARY KEY,
	giocatore_id INTEGER NOT NULL REFERENCES giocatori(id) ON DELETE CASCADE,
	squadra_id INTEGER NOT NULL REFERENCES squadre(id) ON DELETE CASCADE,
	data_inizio DATE NOT NULL,
	data_scadenza DATE NOT NULL,
	creato_il TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE quote_stipendio (
	id SERIAL PRIMARY KEY,
	giocatore_id INTEGER NOT NULL REFERENCES giocatori(id) ON DELETE CASCADE,
	squadra_id INTEGER NOT NULL REFERENCES squadre(id) ON DELETE CASCADE,
	percentuale NUMERIC(5,2) NOT NULL CHECK (percentuale > 0 AND percentuale <= 100),
	data_inizio DATE NOT NULL,
	data_scadenza DATE,
	creato_il TIMESTAMP NOT NULL DEFAULT now(),
	CONSTRAINT unique_giocatore_squadra_periodo UNIQUE (giocatore_id, squadra_id, data_inizio)
);
-- Down Migration