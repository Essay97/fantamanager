-- Up Migration

CREATE TABLE giocatori (
	id SERIAL PRIMARY KEY,
	nome TEXT NOT NULL,
	squadra_contratto INTEGER REFERENCES squadre(id) ON DELETE SET NULL,
	squadra_tesseramento INTEGER REFERENCES squadre(id) ON DELETE SET NULL,
	base_stipendio INTEGER NOT NULL DEFAULT 0,
	creato_il TIMESTAMP NOT NULL DEFAULT now()
);

-- Down Migration