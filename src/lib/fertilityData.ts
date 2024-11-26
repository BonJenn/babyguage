export type AgeGroup = "20-24" | "25-29" | "30-34" | "35-39" | "40-44" | "45+";
export type RelativeTiming = "-5" | "-4" | "-3" | "-2" | "-1" | "0" | "1" | "2";
export type ContraceptionType = "none" | "condom" | "pill" | "iud" | "withdrawal";

export interface CycleTiming {
  relativeTiming: RelativeTiming;
  cycleDay: number;
}

export const fertilityFactors = {
  ageRelatedFertility: {
    "20-24": { monthlyChance: 0.25 },
    "25-29": { monthlyChance: 0.25 },
    "30-34": { monthlyChance: 0.20 },
    "35-39": { monthlyChance: 0.15 },
    "40-44": { monthlyChance: 0.05 },
    "45+": { monthlyChance: 0.01 }
  } as Record<AgeGroup, { monthlyChance: number }>,
  
  ovulationTiming: {
    "-5": 0.10,
    "-4": 0.16,
    "-3": 0.14,
    "-2": 0.27,
    "-1": 0.31,
    "0": 0.33,
    "1": 0.15,
    "2": 0.09
  } as Record<RelativeTiming, number>,

  contraceptionEffectiveness: {
    "none": 1.0,
    "condom": 0.85,
    "pill": 0.91,
    "iud": 0.99,
    "withdrawal": 0.78
  } as Record<ContraceptionType, number>
};

export function getAgeGroup(age: number): AgeGroup {
  if (age < 20) return "20-24";
  if (age <= 24) return "20-24";
  if (age <= 29) return "25-29";
  if (age <= 34) return "30-34";
  if (age <= 39) return "35-39";
  if (age <= 44) return "40-44";
  return "45+";
}

export function calculateCycleDay(periodStart: string, sexDate: string, cycleLength: number, periodEnd?: string, isCurrentlyMenstruating?: boolean): { 
  relativeTiming: RelativeTiming;
  cycleDay: number;
} {
  const periodStartDate = new Date(periodStart);
  const sexDateTime = new Date(sexDate);
  const cycleDay = Math.floor((sexDateTime.getTime() - periodStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  if (isCurrentlyMenstruating) {
    return {
      relativeTiming: "-5",
      cycleDay: cycleDay
    };
  }
  
  // If we have period end date, use that for more accurate calculation
  if (periodEnd) {
    const periodEndDate = new Date(periodEnd);
    const daysFromPeriodEnd = Math.floor((sexDateTime.getTime() - periodEndDate.getTime()) / (1000 * 60 * 60 * 24));
    const estimatedOvulationDay = Math.floor(cycleLength / 2) - (periodEndDate.getTime() - periodStartDate.getTime()) / (1000 * 60 * 60 * 24);
    const daysFromOvulation = Math.min(Math.max(daysFromPeriodEnd - estimatedOvulationDay, -5), 2);
    
    return {
      relativeTiming: daysFromOvulation.toString() as RelativeTiming,
      cycleDay: cycleDay
    };
  }
  
  // Fallback to original calculation if no period end date
  const ovulationDay = Math.floor(cycleLength / 2) - 2;
  const daysFromOvulation = Math.min(Math.max(cycleDay - ovulationDay, -5), 2);
  
  return {
    relativeTiming: daysFromOvulation.toString() as RelativeTiming,
    cycleDay: cycleDay
  };
}
