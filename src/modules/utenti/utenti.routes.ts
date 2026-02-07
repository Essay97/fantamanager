import { Router } from "express";
import type { Request, Response } from "express";
import { requireLogin } from "../../auth/middleware.js";
import type { UtenteAuth } from "./utenti.types.js";

const router = Router();

/**
 * GET /utenti/me
 * Placeholder post-login
 */
router.get("/me", requireLogin, (req: Request, res: Response) => {
  const user = req.user as UtenteAuth;

  res.render("utenti/me", {
    title: "Il mio profilo",
    user,
  });
});

export default router;
