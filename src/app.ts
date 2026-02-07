import { config } from "./config/index.js";
import express from "express";
import session from "express-session";
import passport from "./auth/passport.js";
import path from "path";
import { fileURLToPath } from "url";
import expressLayouts from "express-ejs-layouts";
import connectPgSimple from "connect-pg-simple";

import authRoutes from "./auth/auth.routes.js";
import utentiRoutes from "./modules/utenti/utenti.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout/base");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const store = new (connectPgSimple(session))();

app.use(
  session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
    store: store,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use(authRoutes);
app.use("/utenti", utentiRoutes);

export default app;
