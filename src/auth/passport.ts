import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  getUtenteById,
  getUtentePerAuth,
} from "../modules/utenti/utenti.service.js";
import { verifyPassword } from "./password.js";
import type { UtenteAuth } from "../modules/utenti/utenti.types.js";

/**
 * Strategia locale (username + password)
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await getUtentePerAuth(username);

        if (!user) {
          return done(null, false, { message: "Credenziali non valide" });
        }

        if (!user.attivo) {
          return done(null, false, { message: "Account disattivato" });
        }

        const ok = await verifyPassword(password, user.passwordHash);

        if (!ok) {
          return done(null, false, { message: "Credenziali non valide" });
        }

        // SUCCESSO
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

/**
 * Serializzazione:
 * salviamo SOLO l'id in sessione
 */
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

/**
 * Deserializzazione:
 * dall'id ricostruiamo l'utente
 */
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await getUtenteById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
