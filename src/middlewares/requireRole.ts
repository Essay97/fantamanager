import type { Request, Response, NextFunction } from "express";

type Ruolo = "fantamanager" | "presidente" | "tech";

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
