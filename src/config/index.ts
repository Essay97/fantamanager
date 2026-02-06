import "./loadEnv.js";
import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  PORT: z.string().default("3000"),

  DB_HOST: z.string(),
  DB_PORT: z.string().default("5432"),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),

  SESSION_SECRET: z.string().min(32),
});

const env = EnvSchema.parse(process.env);

export const config = {
  env: env.NODE_ENV,
  port: Number(env.PORT),

  db: {
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    name: env.DB_NAME,
  },

  session: {
    secret: env.SESSION_SECRET,
  },
};
