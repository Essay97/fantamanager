-- Up Migration
CREATE TABLE utenti (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    ruolo VARCHAR(20) NOT NULL
        CHECK (ruolo IN ('fantamanager', 'presidente', 'tech')),
    attivo BOOLEAN NOT NULL DEFAULT true,
    creato_il TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Down Migration