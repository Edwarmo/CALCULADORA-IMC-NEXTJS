/**
 * Tests for Calculator (Backward Compatibility)
 * Location mirrors: lib/calculator.ts
 */

import { 
  calculateWeightLoss, 
  calculateWeightGain, 
  calculateProtein 
} from '@/lib/calculator';

describe('Calculator Backward Compatibility', () => {
  describe('calculateWeightLoss', () => {
    it('should calculate weight loss calories correctly', () => {
      const result = calculateWeightLoss(2000);
      
      expect(result.min).toBe(1500); // 2000 - 500
      expect(result.max).toBe(1750); // 2000 - 250
    });

    it('should handle different TDEE values', () => {
      const result = calculateWeightLoss(2500);
      
      expect(result.min).toBe(2000);
      expect(result.max).toBe(2250);
    });

    it('should round to whole numbers', () => {
      const result = calculateWeightLoss(2137);
      
      expect(result.min).toBe(1637);
      expect(result.max).toBe(1887);
    });
  });

  describe('calculateWeightGain', () => {
    it('should calculate weight gain calories correctly', () => {
      const result = calculateWeightGain(2000);
      
      expect(result.min).toBe(2250); // 2000 + 250
      expect(result.max).toBe(2500); // 2000 + 500
    });

    it('should handle different TDEE values', () => {
      const result = calculateWeightGain(1500);
      
      expect(result.min).toBe(1750);
      expect(result.max).toBe(2000);
    });
  });

  describe('calculateProtein', () => {
    it('should calculate protein requirements correctly', () => {
      const result = calculateProtein(70);
      
      // 70 * 1.6 = 112, 70 * 2.2 = 154
      expect(result.min).toBe(112);
      expect(result.max).toBe(154);
    });

    it('should handle different weight values', () => {
      const result = calculateProtein(80);
      
      expect(result.min).toBe(128); // 80 * 1.6
      expect(result.max).toBe(176); // 80 * 2.2
    });

    it('should round to whole numbers', () => {
      const result = calculateProtein(65);
      
      expect(result.min).toBe(104);
      expect(result.max).toBe(143);
    });
  });
});
