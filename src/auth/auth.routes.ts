import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import passport from "passport";

const router = Router();

/**
 * GET /login
 * Mostra la pagina di login
 */
router.get("/login", (req: Request, res: Response) => {
  // se già loggato, vai alla dashboard
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }

  res.render("login", {
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
    (err: any, user: any, info?: { message?: string }) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        // login fallito → torni al login con messaggio
        return res.status(401).render("login", {
          error: info?.message ?? "Credenziali non valide",
        });
      }

      // login riuscito → creazione sessione
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
