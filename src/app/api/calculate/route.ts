import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { fertilityFactors, getAgeGroup, calculateCycleDay } from '../../../lib/fertilityData';

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    
    // Calculate base probability using scientific data
    const baseProbability = calculateBaseProbability(body);
    
    // Use AI to adjust for complex factor combinations
    const aiAdjustedProbability = await getAIAdjustedProbability(baseProbability, body);
    
    return NextResponse.json(aiAdjustedProbability);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error calculating probability' },
      { status: 500 }
    );
  }
}

interface CalculationData {
  age: number;
  cycleLength: number;
  periodStart: string;
  periodEnd: string;
  isCurrentlyMenstruating: boolean;
  sexDate: string;
  timeOfDay: string;
  contraception: boolean;
  contraceptionType?: ContraceptionType;
  withdrawal?: boolean;
  urination?: boolean;
  finishInside: boolean;
  fertilityMeds: boolean;
  previousPregnancies: number;
  fertilityIssues: boolean;
  medications: string[];
}

function calculateBaseProbability(data: CalculationData) {
  // Get age-based probability
  const age = data.age;
  const ageGroup = getAgeGroup(age);
  const ageFactor = fertilityFactors.ageRelatedFertility[ageGroup].monthlyChance;
  
  // Calculate cycle timing
  const cycleTiming = calculateCycleDay(
    data.periodStart, 
    data.sexDate, 
    data.cycleLength,
    data.periodEnd,
    data.isCurrentlyMenstruating
  );
  
  const ovulationFactor = fertilityFactors.ovulationTiming[cycleTiming.relativeTiming] || 0;
  
  // Apply contraception effectiveness
  const contraceptionFactor = data.contraception 
    ? fertilityFactors.contraceptionEffectiveness[data.contraceptionType || 'none' as ContraceptionType]
    : 1.0;
  
  // Base probability from ovulation timing
  let probability = ovulationFactor;
  
  // Modify by age factor
  probability *= ageFactor;
  
  // Apply contraception reduction
  probability *= (1 - contraceptionFactor);
  
  // Apply other modifiers
  if (data.fertilityMeds) probability *= 1.5;
  if (data.fertilityIssues) probability *= 0.5;
  if (data.previousPregnancies > 0) probability *= 1.2;
  
  return probability * 100;
}

async function getAIAdjustedProbability(baseProbability: number, data: CalculationData) {
  const openai = new OpenAI();
  
  // Build comprehensive factors string
  const cycleTiming = calculateCycleDay(
    data.periodStart, 
    data.sexDate, 
    data.cycleLength,
    data.periodEnd,
    data.isCurrentlyMenstruating
  );
  
  let factorsString = `
    - Base probability: ${baseProbability}%
    - Age: ${data.age}
    - Cycle length: ${data.cycleLength} days
    - Current cycle day: Day ${cycleTiming.cycleDay} of ${data.cycleLength}
    - Days relative to ovulation: ${cycleTiming.relativeTiming} (negative means days before ovulation, positive means days after)
    - Currently menstruating: ${data.isCurrentlyMenstruating}
    - Time of day: ${data.timeOfDay}
    - Contraception used: ${data.contraception}
    - Contraception type: ${data.contraceptionType || 'none'}
    - Finished inside: ${data.finishInside}
    - Fertility medications: ${data.fertilityMeds}
    - Previous pregnancies: ${data.previousPregnancies}
    - Known fertility issues: ${data.fertilityIssues}`;

  if (data.contraceptionType === 'withdrawal' || data.withdrawal) {
    factorsString += `
    - Withdrawal used: ${data.withdrawal || data.contraceptionType === 'withdrawal'}
    - Urination before: ${data.urination}`;
  }

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a fertility specialist analyzing conception probability. 
        Consider ALL these factors in your assessment:
        ${factorsString}
        
        Focus especially on:
        1. Cycle timing relative to ovulation
        2. Contraception effectiveness
        3. Whether ejaculation occurred inside
        4. Age-related fertility factors
        
        Return a JSON object with:
        {
          "percentage": (a number between 0-30, based on the scientific factors provided),
          "riskLevel": (one of: "very low" (0-5%), "low" (5-10%), "medium" (10-20%), "high" (20-25%), "very high" (25-30%)),
          "explanation": (a detailed medical explanation incorporating the key factors above)
        }`
      }
    ],
    model: "gpt-4",
    temperature: 0.3
  });

  try {
    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content in response');
    }
    return JSON.parse(content);
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return {
      percentage: Math.min(baseProbability, 30),
      riskLevel: getRiskLevel(baseProbability),
      explanation: "Based on the provided factors, particularly cycle timing and contraception use, this is our best estimate of conception probability."
    };
  }
}

function getRiskLevel(probability: number): string {
  if (probability < 5) return "very low";
  if (probability < 10) return "low";
  if (probability < 20) return "medium";
  if (probability < 25) return "high";
  return "very high";
}
