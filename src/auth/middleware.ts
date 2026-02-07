import type { Request, Response, NextFunction } from "express";
import type { Ruolo } from "../modules/utenti/utenti.types.js";

export function requireLogin(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  // se è una chiamata API, rispondi JSON
  if (req.originalUrl.startsWith("/api")) {
    return res.status(401).json({ error: "Non autenticato" });
  }

  // altrimenti redirect al login
  return res.redirect("/login");
}

export function requireRole(ruoloRichiesto: Ruolo) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;

    if (!user) {
      return res.status(401).json({ error: "Non autenticato" });
    }

    if (!user.attivo) {
      req.logout(() => {});
      return res.status(403).json({ error: "Account disattivato" });
    }

    if (user.ruolo !== ruoloRichiesto) {
      return res.status(403).json({ error: "Permessi insufficienti" });
    }

    next();
  };
}
