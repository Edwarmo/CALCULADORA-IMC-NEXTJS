/**
 * Calculator functions - Re-export from application layer with backward compatibility
 */

import {
  calculateBMR,
  calculateTDEE,
  calculateBMI,
  getBMICategory,
  getActivityDescription,
  calculateCalorieRecommendations,
  calculateNutrition,
} from '@/lib/application/calculator/calculate-nutrition.use-case';
import type { CalculatorInput, CalculatorResult } from '@/lib/domain/entities';

export type { CalculatorInput, CalculatorResult };

export {
  calculateBMR,
  calculateTDEE,
  calculateBMI,
  getBMICategory,
  getActivityDescription,
  calculateNutrition,
};

/**
 * Calculate weight loss calories - backward compatible wrapper
 * Returns { min, max } object as expected by tests
 */
export function calculateWeightLoss(tdee: number): { min: number; max: number } {
  return {
    min: Math.round(tdee - 500),
    max: Math.round(tdee - 250),
  };
}

/**
 * Calculate weight gain calories - backward compatible wrapper
 * Returns { min, max } object as expected by tests
 */
export function calculateWeightGain(tdee: number): { min: number; max: number } {
  return {
    min: Math.round(tdee + 250),
    max: Math.round(tdee + 500),
  };
}

/**
 * Calculate protein requirements - backward compatible wrapper
 * Returns { min, max } object as expected by tests
 */
export function calculateProtein(weight: number): { min: number; max: number } {
  return {
    min: Math.round(weight * 1.6),
    max: Math.round(weight * 2.2),
  };
}
