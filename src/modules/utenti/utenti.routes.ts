import { Router } from "express";
import type { Request, Response } from "express";
import { requireLogin } from "../../auth/middleware.js";
import * as squadreService from "../squadre/squadre.service.js";
import * as utentiRepo from "./utenti.repository.js";
import type { UtenteAuth } from "./utenti.types.js";

const router = Router();

/**
 * GET /utenti/me
 * Placeholder post-login
 */
router.get("/me", requireLogin, async (req: Request, res: Response) => {
  const user = req.user as UtenteAuth;

  try {
    const squads = await squadreService.getSquadrePerUtente(user.id);

    // Per ogni squadra, se ha altri proprietari, recupera il nome del primo altro proprietario
    const squadsWithCoOwners = await Promise.all(
      squads.map(async (s) => {
        const others = (s.proprietari || []).filter((id) => id !== user.id);
        if (others.length === 0) return { ...s, coOwnerName: null };

        const otherRow = await utentiRepo.findById(others[0]!);
        return { ...s, coOwnerName: otherRow ? otherRow.username : null };
      }),
    );

    res.render("utenti/me", {
      title: "Il mio profilo",
      user,
      squads: squadsWithCoOwners,
    });
  } catch (err: any) {
    res.render("utenti/me", {
      title: "Il mio profilo",
      user,
      error: "Impossibile recuperare le squadre",
    });
  }
});

export default router;
