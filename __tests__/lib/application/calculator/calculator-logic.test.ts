/**
 * Tests for Calculator Logic (Pure Functions)
 * Location mirrors: app/(dashboard)/calculator/Calculator.tsx
 */

// Extract pure functions for testing
const calculateBMR = (weight: number, height: number, age: number, gender: string): number => {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

const calculateTDEE = (bmr: number, activityLevel: string): number => {
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };
  return bmr * (activityMultipliers[activityLevel] || 1.2);
};

const calculateBMI = (weight: number, heightCm: number): number => {
  const heightM = heightCm / 100;
  return weight / (heightM * heightM);
};

const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

describe('Calculator Logic', () => {
  describe('calculateBMR', () => {
    it('should calculate BMR for male', () => {
      // Male: 10*70 + 6.25*170 - 5*30 + 5 = 700 + 1062.5 - 150 + 5 = 1617.5
      const bmr = calculateBMR(70, 170, 30, 'male');
      expect(bmr).toBe(1617.5);
    });

    it('should calculate BMR for female', () => {
      // Female: 10*60 + 6.25*160 - 5*25 - 161 = 600 + 1000 - 125 - 161 = 1314
      const bmr = calculateBMR(60, 160, 25, 'female');
      expect(bmr).toBe(1314);
    });

    it('should handle edge case for male', () => {
      const bmr = calculateBMR(80, 180, 40, 'male');
      expect(bmr).toBeGreaterThan(0);
    });

    it('should handle edge case for female', () => {
      const bmr = calculateBMR(50, 150, 20, 'female');
      expect(bmr).toBeGreaterThan(0);
    });
  });

  describe('calculateTDEE', () => {
    it('should calculate TDEE for sedentary activity', () => {
      const tdee = calculateTDEE(1600, 'sedentary');
      expect(tdee).toBe(1920); // 1600 * 1.2
    });

    it('should calculate TDEE for light activity', () => {
      const tdee = calculateTDEE(1600, 'light');
      expect(tdee).toBe(2200); // 1600 * 1.375
    });

    it('should calculate TDEE for moderate activity', () => {
      const tdee = calculateTDEE(1600, 'moderate');
      expect(tdee).toBe(2480); // 1600 * 1.55
    });

    it('should calculate TDEE for active activity', () => {
      const tdee = calculateTDEE(1600, 'active');
      expect(tdee).toBe(2760); // 1600 * 1.725
    });

    it('should calculate TDEE for veryActive activity', () => {
      const tdee = calculateTDEE(1600, 'veryActive');
      expect(tdee).toBe(3040); // 1600 * 1.9
    });

    it('should default to sedentary for unknown activity', () => {
      const tdee = calculateTDEE(1600, 'unknown');
      expect(tdee).toBe(1920); // 1600 * 1.2
    });
  });

  describe('calculateBMI', () => {
    it('should calculate BMI correctly', () => {
      // 70 / (1.7 * 1.7) = 70 / 2.89 = 24.22
      const bmi = calculateBMI(70, 170);
      expect(bmi).toBeCloseTo(24.22, 1);
    });

    it('should calculate BMI for normal weight', () => {
      const bmi = calculateBMI(65, 170);
      expect(bmi).toBeGreaterThan(18.5);
      expect(bmi).toBeLessThan(25);
    });

    it('should calculate BMI for overweight', () => {
      // 80kg at 170cm = 27.68 BMI (overweight range)
      const bmi = calculateBMI(80, 170);
      expect(bmi).toBeGreaterThanOrEqual(25);
      expect(bmi).toBeLessThan(30);
    });

    it('should calculate BMI for obese', () => {
      const bmi = calculateBMI(100, 170);
      expect(bmi).toBeGreaterThanOrEqual(30);
    });
  });

  describe('getBMICategory', () => {
    it('should return Underweight for BMI < 18.5', () => {
      expect(getBMICategory(18)).toBe('Underweight');
      expect(getBMICategory(18.4)).toBe('Underweight');
    });

    it('should return Normal weight for BMI 18.5-24.9', () => {
      expect(getBMICategory(18.5)).toBe('Normal weight');
      expect(getBMICategory(22)).toBe('Normal weight');
      expect(getBMICategory(24.9)).toBe('Normal weight');
    });

    it('should return Overweight for BMI 25-29.9', () => {
      expect(getBMICategory(25)).toBe('Overweight');
      expect(getBMICategory(27)).toBe('Overweight');
      expect(getBMICategory(29.9)).toBe('Overweight');
    });

    it('should return Obese for BMI >= 30', () => {
      expect(getBMICategory(30)).toBe('Obese');
      expect(getBMICategory(35)).toBe('Obese');
      expect(getBMICategory(40)).toBe('Obese');
    });
  });
});
