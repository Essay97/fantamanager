import * as repo from "./giocatori.repository.js";
import * as squadreRepo from "../squadre/squadre.repository.js";

function formatDateDDMMYYYY(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

function computeRate(base: number): number {
  if (base >= 1 && base <= 50) return 0.1;
  if (base >= 51 && base <= 100) return 0.2;
  if (base >= 101 && base <= 150) return 0.3;
  return 0.4;
}

export async function getGiocatoriPerSquadra(
  squadraId: number,
): Promise<any[]> {
  console.log(`Fetching players for team id=${squadraId}...`);
  const giocatori = await repo.listGiocatoriLinkedToSquadra(squadraId);

  const result = await Promise.all(
    giocatori.map(async (g) => {
      const contratti = await repo.getContrattiForGiocatore(g.id);
      const tesseramenti = await repo.getTesseramentiForGiocatore(g.id);
      const quotes = await repo.getQuoteForGiocatore(g.id);

      if (g.id === 173) {
        console.log("Giocatore 173:", g, contratti, tesseramenti, quotes);
      }

      // Contratto display
      const contrattoWithThis = contratti.find(
        (c) => c.squadra_id === squadraId,
      );
      let contrattoDisplay: {
        date: string | null;
        otherTeamName?: string | null;
      } = { date: null };

      if (contrattoWithThis) {
        contrattoDisplay.date = formatDateDDMMYYYY(
          contrattoWithThis.data_scadenza,
        );
      } else if (contratti.length > 0) {
        const owner = contratti[0]!;
        const squadra = await squadreRepo.findSquadraPerId(owner.squadra_id);
        contrattoDisplay.date = formatDateDDMMYYYY(owner.data_scadenza);
        contrattoDisplay.otherTeamName = squadra ? squadra.nome : null;
      }

      // Tesseramento display
      const tessWithThis = tesseramenti.find((t) => t.squadra_id === squadraId);
      let tesseramentoDisplay: {
        date: string | null;
        otherTeamName?: string | null;
      } = { date: null };

      if (tessWithThis) {
        tesseramentoDisplay.date = formatDateDDMMYYYY(
          tessWithThis.data_scadenza,
        );
      } else if (tesseramenti.length > 0) {
        const owner = tesseramenti[0]!;
        const squadra = await squadreRepo.findSquadraPerId(owner.squadra_id);
        tesseramentoDisplay.date = formatDateDDMMYYYY(owner.data_scadenza);
        tesseramentoDisplay.otherTeamName = squadra ? squadra.nome : null;
      }

      // Salary calculation
      const rate = computeRate(Number(g.base_stipendio));
      const baseSalary = Number(g.base_stipendio) * rate;

      let thisSquadPercent = 0;

      for (const q of quotes) {
        if (q.squadra_id === squadraId)
          thisSquadPercent += Number(q.percentuale || 0);
      }

      let thisAmount: number | null = null;
      let otherSquads: { amount: number; teamName: string }[] = [];

      if (quotes.length === 0) {
        thisAmount = baseSalary;
      } else {
        thisAmount = (baseSalary * thisSquadPercent) / 100;

        // Get other squads' contributions
        const otherQuotes = quotes.filter((q) => q.squadra_id !== squadraId);
        for (const q of otherQuotes) {
          const amount = (baseSalary * Number(q.percentuale)) / 100;
          const otherSquadra = await squadreRepo.findSquadraPerId(q.squadra_id);
          otherSquads.push({
            amount: Number(amount.toFixed(2)),
            teamName: otherSquadra ? otherSquadra.nome : "Sconosciuto",
          });
        }
      }

      return {
        id: g.id,
        nome: g.nome,
        contratto: contrattoDisplay,
        tesseramento: tesseramentoDisplay,
        base_stipendio: Number(g.base_stipendio),
        baseSalary: Number(baseSalary.toFixed(2)),
        thisAmount: thisAmount !== null ? Number(thisAmount.toFixed(2)) : null,
        otherSquads,
      };
    }),
  );

  return result;
}
