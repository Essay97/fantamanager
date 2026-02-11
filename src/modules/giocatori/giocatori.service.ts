import * as repo from "./giocatori.repository.js";
import * as squadreRepo from "../squadre/squadre.repository.js";

function computeRate(base: number): number {
  if (base >= 1 && base <= 50) return 0.1;
  if (base >= 51 && base <= 100) return 0.2;
  if (base >= 101 && base <= 150) return 0.3;
  return 0.4;
}

export async function getGiocatoriPerSquadra(
  squadraId: number,
): Promise<any[]> {
  const giocatori = await repo.listGiocatoriLinkedToSquadra(squadraId);

  const result = await Promise.all(
    giocatori.map(async (g) => {
      const contratti = await repo.getContrattiForGiocatore(g.id);
      const tesseramenti = await repo.getTesseramentiForGiocatore(g.id);
      const quotes = await repo.getQuoteForGiocatore(g.id);

      // Contratto display
      const contrattoWithThis = contratti.find(
        (c) => c.squadra_id === squadraId,
      );
      let contrattoDisplay: {
        date: string | null;
        otherTeamName?: string | null;
      } = { date: null };

      if (contrattoWithThis) {
        contrattoDisplay.date = contrattoWithThis.data_scadenza;
      } else if (contratti.length > 0) {
        const owner = contratti[0];
        const squadra = await squadreRepo.findSquadraPerId(owner.squadra_id);
        contrattoDisplay.date = owner.data_scadenza;
        contrattoDisplay.otherTeamName = squadra ? squadra.nome : null;
      }

      // Tesseramento display
      const tessWithThis = tesseramenti.find((t) => t.squadra_id === squadraId);
      let tesseramentoDisplay: {
        date: string | null;
        otherTeamName?: string | null;
      } = { date: null };

      if (tessWithThis) {
        tesseramentoDisplay.date = tessWithThis.data_scadenza;
      } else if (tesseramenti.length > 0) {
        const owner = tesseramenti[0];
        const squadra = await squadreRepo.findSquadraPerId(owner.squadra_id);
        tesseramentoDisplay.date = owner.data_scadenza;
        tesseramentoDisplay.otherTeamName = squadra ? squadra.nome : null;
      }

      // Salary calculation
      const rate = computeRate(Number(g.base_stipendio));
      const baseSalary = Number(g.base_stipendio) * rate;

      let thisSquadPercent = 0;
      let otherPercent = 0;

      for (const q of quotes) {
        if (q.squadra_id === squadraId)
          thisSquadPercent += Number(q.percentuale || 0);
        else otherPercent += Number(q.percentuale || 0);
      }

      let thisAmount = null;
      let othersAmount = null;

      if (quotes.length === 0) {
        thisAmount = baseSalary;
      } else {
        thisAmount = (baseSalary * thisSquadPercent) / 100;
        othersAmount = (baseSalary * otherPercent) / 100;
      }

      return {
        id: g.id,
        nome: g.nome,
        contratto: contrattoDisplay,
        tesseramento: tesseramentoDisplay,
        base_stipendio: Number(g.base_stipendio),
        baseSalary: Number(baseSalary.toFixed(2)),
        thisAmount: thisAmount !== null ? Number(thisAmount.toFixed(2)) : null,
        othersAmount:
          othersAmount !== null ? Number(othersAmount.toFixed(2)) : null,
      };
    }),
  );

  return result;
}
