export const fertilityFactors = {
  ageRelatedFertility: {
    // Source: American Society for Reproductive Medicine
    "20-24": { monthlyChance: 0.25 },
    "25-29": { monthlyChance: 0.25 },
    "30-34": { monthlyChance: 0.20 },
    "35-39": { monthlyChance: 0.15 },
    "40-44": { monthlyChance: 0.05 },
    "45+": { monthlyChance: 0.01 }
  },
  
  ovulationTiming: {
    // Days relative to ovulation and conception probability
    // Source: New England Journal of Medicine study
    "-5": 0.10,
    "-4": 0.16,
    "-3": 0.14,
    "-2": 0.27,
    "-1": 0.31,
    "0": 0.33,
    "1": 0.15,
    "2": 0.09
  },

  contraceptionEffectiveness: {
    // Source: WHO and CDC data
    "none": 1.0,
    "condom": 0.85,
    "pill": 0.91,
    "iud": 0.99,
    "withdrawal": 0.78
  }
};

export function getAgeGroup(age: number): string {
  if (age < 20) return "20-24";
  if (age <= 24) return "20-24";
  if (age <= 29) return "25-29";
  if (age <= 34) return "30-34";
  if (age <= 39) return "35-39";
  if (age <= 44) return "40-44";
  return "45+";
}

export function calculateCycleDay(periodStart: string, sexDate: string, cycleLength: number, periodEnd?: string, isCurrentlyMenstruating?: boolean): { 
  relativeTiming: string;
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
    const daysFromOvulation = daysFromPeriodEnd - estimatedOvulationDay;
    
    if (daysFromOvulation < -5) return {
      relativeTiming: "-5",
      cycleDay: cycleDay
    };
    if (daysFromOvulation > 2) return {
      relativeTiming: "2",
      cycleDay: cycleDay
    };
    return {
      relativeTiming: daysFromOvulation.toString(),
      cycleDay: cycleDay
    };
  }
  
  // Fallback to original calculation if no period end date
  const ovulationDay = Math.floor(cycleLength / 2) - 2;
  const daysFromOvulation = cycleDay - ovulationDay;
  
  if (daysFromOvulation < -5) return {
    relativeTiming: "-5",
    cycleDay: cycleDay
  };
  if (daysFromOvulation > 2) return {
    relativeTiming: "2",
    cycleDay: cycleDay
  };
  return {
    relativeTiming: daysFromOvulation.toString(),
    cycleDay: cycleDay
  };
}
