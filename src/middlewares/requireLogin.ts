import type { Request, Response, NextFunction } from "express";

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
