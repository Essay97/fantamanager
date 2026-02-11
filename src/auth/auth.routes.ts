import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import type { UtenteAuth } from "../modules/utenti/utenti.types.js";
import * as utentiService from "../modules/utenti/utenti.service.js";

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
    title: "Fantamanager - Login",
    user: req.user,
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
          title: "Fantamanager - Login",
          user: req.user,
        });
      }

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }

        // Ensure the session is saved before redirecting so the
        // session cookie is set in the browser.
        if (req.session) {
          req.session.save((saveErr) => {
            if (saveErr) {
              return next(saveErr);
            }

            return res.redirect("/utenti/me");
          });
        } else {
          return res.render("auth/login", {
            error: info?.message ?? "Credenziali non valide",
            title: "Fantamanager - Login",
            user: req.user,
          });
        }
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

/**
 * POST /cambio-password
 * Cambio password self-service: verifica vecchia password,
 * aggiorna la nuova (hashata) e forza logout redirect /login
 */
router.post(
  "/cambio-password",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.redirect("/login");
    }

    const { oldPassword, newPassword } = req.body as {
      oldPassword?: string;
      newPassword?: string;
    };

    const user = req.user as UtenteAuth | undefined;
    if (!user) {
      return res.redirect("/login");
    }

    try {
      await utentiService.cambiaPassword(
        user.id,
        oldPassword ?? "",
        newPassword ?? "",
      );

      // On success force logout so user must re-login with new password
      req.logout((err) => {
        if (err) {
          return next(err);
        }

        req.session?.destroy(() => {
          res.redirect("/login");
        });
      });
    } catch (err: any) {
      if (err.message === "INVALID_PASSWORD") {
        return res.render("utenti/me", {
          error: "Password attuale non corretta",
          user: req.user,
          title: "Fantamanager - Profilo",
        });
      }

      if (err.message === "USER_NOT_FOUND") {
        return next(new Error("Utente non trovato"));
      }

      return next(err);
    }
  },
);

export default router;
