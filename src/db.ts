import { Pool } from "pg";
import { config } from "./config/index.js";

export const pool = new Pool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  port: config.db.port,
  database: config.db.name,
});
