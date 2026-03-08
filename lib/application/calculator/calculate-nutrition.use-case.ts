/**
 * Calculate Nutrition Use Case
 * Application layer - Calculate BMR, TDEE, and BMI
 */

import type { 
  CalculatorInput, 
  CalculatorResult, 
  ActivityLevel 
} from '@/lib/domain/entities';

/**
 * Activity level multipliers for TDEE calculation
 */
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

/**
 * Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
 * - Male: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5
 * - Female: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161
 */
export function calculateBMR(
  weight: number, 
  height: number, 
  age: number, 
  gender: 'male' | 'female'
): number {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

/**
 * Calculate TDEE (Total Daily Energy Expenditure) based on activity level
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return bmr * (ACTIVITY_MULTIPLIERS[activityLevel] || 1.2);
}

/**
 * Calculate BMI (Body Mass Index)
 */
export function calculateBMI(weight: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weight / (heightM * heightM);
}

/**
 * Get BMI category based on BMI value
 */
export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

/**
 * Execute nutrition calculation
 * Returns BMR, TDEE, BMI and BMI category
 */
export function calculateNutrition(input: CalculatorInput): CalculatorResult {
  const { age, gender, weight, height, activityLevel } = input;

  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);
  const bmi = calculateBMI(weight, height);
  const bmiCategory = getBMICategory(bmi);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    bmi: Math.round(bmi * 10) / 10,
    bmiCategory,
  };
}

/**
 * Get activity level description
 */
export function getActivityDescription(level: ActivityLevel): string {
  if (!level) return '';
  
  const descriptions: Record<ActivityLevel, string> = {
    sedentary: 'Little or no exercise',
    light: 'Light exercise 1-3 days/week',
    moderate: 'Moderate exercise 3-5 days/week',
    active: 'Hard exercise 6-7 days/week',
    veryActive: 'Very hard exercise, physical job',
  };
  
  return descriptions[level] || '';
}

/**
 * Calculate daily calorie recommendations
 */
export function calculateCalorieRecommendations(tdee: number, weight: number): {
  weightLoss: string;
  weightGain: string;
  maintenance: number;
  protein: string;
} {
  return {
    weightLoss: `${tdee - 500} - ${tdee - 250}`,
    weightGain: `${tdee + 250} - ${tdee + 500}`,
    maintenance: tdee,
    protein: `${Math.round(weight * 1.6)} - ${Math.round(weight * 2.2)}g`,
  };
}
