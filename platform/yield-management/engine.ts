import type { YieldFactor, YieldInput, YieldProposal } from "./contracts";
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
export function recommendRate(input: YieldInput): YieldProposal {
  const factors: YieldFactor[] = [];
  let percentage = 0;
  const occupancyGap = input.occupancyRate - input.targetOccupancy;
  const occupancy = clamp(Math.round(occupancyGap * 0.35 * input.occupancyWeight), -15, 20);
  if (occupancy !== 0) {
    percentage += occupancy;
    factors.push({
      code: "occupancy",
      label: "Occupation",
      percentage: occupancy,
      explanation: `Occupation ${input.occupancyRate}% contre un objectif de ${input.targetOccupancy}%.`,
    });
  }
  if (input.leadDays <= 7) {
    const value = -Math.round(12 * input.leadTimeWeight);
    percentage += value;
    factors.push({
      code: "lead_time",
      label: "Dernière minute",
      percentage: value,
      explanation: `La date est à ${input.leadDays} jour(s), une réduction maîtrisée favorise la conversion.`,
    });
  } else if (input.leadDays >= 120) {
    const value = Math.round(5 * input.leadTimeWeight);
    percentage += value;
    factors.push({
      code: "lead_time",
      label: "Réservation anticipée",
      percentage: value,
      explanation: `La demande est évaluée ${input.leadDays} jours à l’avance.`,
    });
  }
  if (input.isWeekend) {
    percentage += 5;
    factors.push({
      code: "weekend",
      label: "Week-end",
      percentage: 5,
      explanation: "La demande littorale est généralement plus forte le vendredi et le samedi.",
    });
  }
  if (input.eventImpactPercentage) {
    const value = Math.round(input.eventImpactPercentage * input.eventWeight);
    percentage += value;
    factors.push({
      code: "event",
      label: input.eventName ?? "Événement",
      percentage: value,
      explanation: `Impact configuré pour ${input.eventName ?? "la période"} : ${value > 0 ? "+" : ""}${value}%.`,
    });
  }
  percentage = clamp(percentage, -input.maximumDecreasePercentage, input.maximumIncreasePercentage);
  const raw = Math.round(input.baseRateCents * (1 + percentage / 100));
  const recommendedRateCents = clamp(
    Math.round(raw / 100) * 100,
    input.minimumRateCents,
    input.maximumRateCents,
  );
  const applied = Math.round((recommendedRateCents / input.baseRateCents - 1) * 1000) / 10;
  const confidence = clamp(
    Math.round(
      55 +
        Math.min(20, Math.abs(input.occupancyRate - input.targetOccupancy) / 2) +
        Math.min(15, factors.length * 4),
    ),
    0,
    95,
  );
  return { recommendedRateCents, changePercentage: applied, confidence, factors };
}
