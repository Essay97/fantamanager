-- Up Migration
ALTER TABLE contratti DROP COLUMN data_inizio;
ALTER TABLE contratti DROP COLUMN data_scadenza;

-- Down Migration