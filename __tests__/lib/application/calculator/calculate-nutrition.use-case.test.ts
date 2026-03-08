/**
 * Tests for Calculate Nutrition Use Case
 * Location mirrors: lib/application/calculator/calculate-nutrition.use-case.ts
 */

import { 
  calculateBMR, 
  calculateTDEE, 
  calculateBMI, 
  getBMICategory,
  getActivityDescription,
  calculateNutrition,
  calculateCalorieRecommendations
} from '@/lib/application/calculator/calculate-nutrition.use-case';

describe('calculateNutrition Use Case', () => {
  describe('calculateBMR', () => {
    it('should calculate BMR for male', () => {
      const bmr = calculateBMR(70, 170, 30, 'male');
      expect(bmr).toBeGreaterThan(0);
    });

    it('should calculate BMR for female', () => {
      const bmr = calculateBMR(60, 160, 25, 'female');
      expect(bmr).toBeGreaterThan(0);
    });
  });

  describe('calculateTDEE', () => {
    it('should calculate TDEE for sedentary', () => {
      const tdee = calculateTDEE(1600, 'sedentary');
      expect(tdee).toBe(1920); // 1600 * 1.2
    });

    it('should calculate TDEE for light', () => {
      const tdee = calculateTDEE(1600, 'light');
      expect(tdee).toBe(2200); // 1600 * 1.375
    });

    it('should calculate TDEE for moderate', () => {
      const tdee = calculateTDEE(1600, 'moderate');
      expect(tdee).toBe(2480); // 1600 * 1.55
    });

    it('should calculate TDEE for active', () => {
      const tdee = calculateTDEE(1600, 'active');
      expect(tdee).toBe(2760); // 1600 * 1.725
    });

    it('should calculate TDEE for veryActive', () => {
      const tdee = calculateTDEE(1600, 'veryActive');
      expect(tdee).toBe(3040); // 1600 * 1.9
    });

    it('should default to sedentary for unknown activity', () => {
      const tdee = calculateTDEE(1600, 'unknown' as any);
      expect(tdee).toBe(1920); // 1600 * 1.2
    });
  });

  describe('calculateBMI', () => {
    it('should calculate BMI correctly', () => {
      const bmi = calculateBMI(70, 170);
      expect(bmi).toBeCloseTo(24.22, 1);
    });
  });

  describe('getBMICategory', () => {
    it('should return Underweight for BMI < 18.5', () => {
      expect(getBMICategory(18)).toBe('Underweight');
    });

    it('should return Normal weight for BMI 18.5-24.9', () => {
      expect(getBMICategory(22)).toBe('Normal weight');
    });

    it('should return Overweight for BMI 25-29.9', () => {
      expect(getBMICategory(27)).toBe('Overweight');
    });

    it('should return Obese for BMI >= 30', () => {
      expect(getBMICategory(30)).toBe('Obese');
      expect(getBMICategory(35)).toBe('Obese');
    });
  });

  describe('getActivityDescription', () => {
    it('should return description for sedentary', () => {
      expect(getActivityDescription('sedentary')).toBe('Little or no exercise');
    });

    it('should return description for light', () => {
      expect(getActivityDescription('light')).toBe('Light exercise 1-3 days/week');
    });

    it('should return description for moderate', () => {
      expect(getActivityDescription('moderate')).toBe('Moderate exercise 3-5 days/week');
    });

    it('should return description for active', () => {
      expect(getActivityDescription('active')).toBe('Hard exercise 6-7 days/week');
    });

    it('should return description for veryActive', () => {
      expect(getActivityDescription('veryActive')).toBe('Very hard exercise, physical job');
    });

    it('should return empty string for unknown level', () => {
      expect(getActivityDescription('' as any)).toBe('');
      expect(getActivityDescription('unknown' as any)).toBe('');
    });
  });

  describe('calculateCalorieRecommendations', () => {
    it('should calculate recommendations correctly', () => {
      const result = calculateCalorieRecommendations(2000, 70);
      
      expect(result.maintenance).toBe(2000);
      expect(result.weightLoss).toBe('1500 - 1750');
      expect(result.weightGain).toBe('2250 - 2500');
      expect(result.protein).toBe('112 - 154g');
    });

    it('should handle different TDEE values', () => {
      const result = calculateCalorieRecommendations(2500, 80);
      
      expect(result.maintenance).toBe(2500);
      expect(result.weightLoss).toBe('2000 - 2250');
      expect(result.weightGain).toBe('2750 - 3000');
      expect(result.protein).toBe('128 - 176g');
    });
  });

  describe('calculateNutrition', () => {
    it('should calculate nutrition for male', () => {
      const result = calculateNutrition({
        weight: 70,
        height: 170,
        age: 30,
        gender: 'male',
        activityLevel: 'moderate',
      });

      expect(result.bmr).toBeGreaterThan(0);
      expect(result.tdee).toBeGreaterThan(0);
      expect(result.bmi).toBeGreaterThan(0);
      expect(result.bmiCategory).toBeDefined();
    });

    it('should calculate nutrition for female', () => {
      const result = calculateNutrition({
        weight: 60,
        height: 160,
        age: 25,
        gender: 'female',
        activityLevel: 'sedentary',
      });

      expect(result.bmr).toBeGreaterThan(0);
      expect(result.tdee).toBeGreaterThan(0);
      expect(result.bmi).toBeGreaterThan(0);
      expect(result.bmiCategory).toBeDefined();
    });

    it('should handle different activity levels', () => {
      const sedentary = calculateNutrition({
        weight: 70,
        height: 170,
        age: 30,
        gender: 'male',
        activityLevel: 'sedentary',
      });

      const active = calculateNutrition({
        weight: 70,
        height: 170,
        age: 30,
        gender: 'male',
        activityLevel: 'veryActive',
      });

      expect(active.tdee).toBeGreaterThan(sedentary.tdee);
    });
  });
});
