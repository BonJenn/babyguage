import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { 
  fertilityFactors, 
  getAgeGroup, 
  calculateCycleDay,
  type ContraceptionType
} from '../../../lib/fertilityData';

export interface CalculationData {
  age: number;
  hasPeriods: boolean;
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

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY_2) {
    console.error('OpenAI API key not configured');
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    console.log('Received data:', body);
    
    // Calculate base probability using scientific data
    const baseProbability = calculateBaseProbability(body);
    console.log('Base probability:', baseProbability);
    
    // Use AI to adjust for complex factor combinations
    const aiAdjustedProbability = await getAIAdjustedProbability(baseProbability, body);
    console.log('AI adjusted probability:', aiAdjustedProbability);
    
    return NextResponse.json(aiAdjustedProbability);
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { 
        error: 'Error calculating probability',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function calculateBaseProbability(data: CalculationData) {
  try {
    // Get age-based probability
    const age = data.age;
    console.log('Processing age:', age);
    const ageGroup = getAgeGroup(age);
    const ageFactor = fertilityFactors.ageRelatedFertility[ageGroup].monthlyChance;
    
    let probability = 0;
    
    if (!data.hasPeriods) {
      // If no periods, start with a very low base probability
      probability = 0.05; // 5% base chance
      
      // Adjust based on other factors
      if (data.fertilityMeds) probability *= 2; // Double chance with fertility meds
      if (data.fertilityIssues) probability *= 0.5; // Halve chance with known issues
      
      console.log('No periods - adjusted base probability:', probability);
    } else {
      // Normal calculation for people with periods
      const cycleTiming = calculateCycleDay(
        data.periodStart, 
        data.sexDate, 
        data.cycleLength,
        data.periodEnd,
        data.isCurrentlyMenstruating
      );
      console.log('Cycle timing:', cycleTiming);
      
      const ovulationFactor = fertilityFactors.ovulationTiming[cycleTiming.relativeTiming] || 0;
      console.log('Ovulation factor:', ovulationFactor);
      
      probability = ovulationFactor;
      probability *= ageFactor;
    }
    
    // Apply common modifiers for both cases
    const contraceptionFactor = data.contraception 
      ? fertilityFactors.contraceptionEffectiveness[data.contraceptionType || 'none' as ContraceptionType]
      : 1.0;
    console.log('Contraception factor:', contraceptionFactor);
    
    probability *= (1 - contraceptionFactor);
    
    if (data.fertilityMeds) probability *= 1.5;
    if (data.fertilityIssues) probability *= 0.5;
    if (data.previousPregnancies > 0) probability *= 1.2;
    
    const finalProbability = Math.min(probability * 100, 30); // Cap at 30%
    console.log('Final probability:', finalProbability);
    return finalProbability;
  } catch (error) {
    console.error('Error in calculateBaseProbability:', error);
    throw error;
  }
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
    - Has regular periods: ${data.hasPeriods}
    ${data.hasPeriods ? `
    - Cycle length: ${data.cycleLength} days
    - Current cycle day: Day ${cycleTiming.cycleDay} of ${data.cycleLength}
    - Days relative to ovulation: ${cycleTiming.relativeTiming}` : ''}
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
