import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import type { UtenteAuth } from "../modules/utenti/utenti.types.js";

const router = Router();

/**
 * GET /login
 * Mostra la pagina di login
 */
router.get("/login", (req: Request, res: Response) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.redirect("/utenti/me");
  }

  res.render("auth/login", {
    error: null,
  });
});

/**
 * POST /login
 * Submit del form di login
 */
router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "local",
    (err: any, user: UtenteAuth | false, info?: { message?: string }) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.render("auth/login", {
          error: info?.message ?? "Credenziali non valide",
        });
      }

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }

        return res.redirect("/dashboard");
      });
    },
  )(req, res, next);
});

/**
 * POST /logout
 * Logout dell'utente
 */
router.post("/logout", (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy(() => {
      res.redirect("/login");
    });
  });
});

export default router;
