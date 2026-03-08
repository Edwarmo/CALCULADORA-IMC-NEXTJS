'use client';

import { useState } from 'react';

interface CalculatorState {
  // Personal info
  age: string;
  gender: string;
  weight: string;
  height: string;
  activityLevel: string;
  
  // Results
  bmr: number | null;
  tdee: number | null;
  bmi: number | null;
  bmiCategory: string;
}

export default function Calculator() {
  const [state, setState] = useState<CalculatorState>({
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    activityLevel: 'sedentary',
    bmr: null,
    tdee: null,
    bmi: null,
    bmiCategory: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate BMR using Mifflin-St Jeor Equation
  const calculateBMR = (weight: number, height: number, age: number, gender: string): number => {
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  };

  // Calculate TDEE based on activity level
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

  // Calculate BMI
  const calculateBMI = (weight: number, heightCm: number): number => {
    const heightM = heightCm / 100;
    return weight / (heightM * heightM);
  };

  // Get BMI Category
  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const age = parseInt(state.age);
    const weight = parseFloat(state.weight);
    const height = parseFloat(state.height);

    if (!state.age || isNaN(age) || age < 15 || age > 120) {
      newErrors.age = 'Please enter a valid age (15-120)';
    }

    if (!state.weight || isNaN(weight) || weight < 30 || weight > 300) {
      newErrors.weight = 'Please enter a valid weight (30-300 kg)';
    }

    if (!state.height || isNaN(height) || height < 100 || height > 250) {
      newErrors.height = 'Please enter a valid height (100-250 cm)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle calculate
  const handleCalculate = () => {
    if (!validate()) return;

    const age = parseInt(state.age);
    const weight = parseFloat(state.weight);
    const height = parseFloat(state.height);

    const bmr = calculateBMR(weight, height, age, state.gender);
    const tdee = calculateTDEE(bmr, state.activityLevel);
    const bmi = calculateBMI(weight, height);
    const bmiCategory = getBMICategory(bmi);

    setState((prev) => ({
      ...prev,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      bmi: Math.round(bmi * 10) / 10,
      bmiCategory,
    }));
  };

  // Handle input change
  const handleChange = (field: keyof CalculatorState, value: string) => {
    setState((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Get activity level description
  const getActivityDescription = (level: string): string => {
    const descriptions: Record<string, string> = {
      sedentary: 'Little or no exercise',
      light: 'Light exercise 1-3 days/week',
      moderate: 'Moderate exercise 3-5 days/week',
      active: 'Hard exercise 6-7 days/week',
      veryActive: 'Very hard exercise, physical job',
    };
    return descriptions[level] || '';
  };

  return (
    <div className="glass-card p-8 w-full max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Nutrium Calculator
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Age */}
        <div>
          <label className="block text-white mb-2 font-medium">Age (years)</label>
          <input
            type="number"
            value={state.age}
            onChange={(e) => handleChange('age', e.target.value)}
            className="glass-input w-full"
            placeholder="Enter your age"
          />
          {errors.age && <p className="text-red-300 text-sm mt-1">{errors.age}</p>}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-white mb-2 font-medium">Gender</label>
          <select
            value={state.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="glass-input w-full"
          >
            <option value="male" className="text-black">Male</option>
            <option value="female" className="text-black">Female</option>
          </select>
        </div>

        {/* Weight */}
        <div>
          <label className="block text-white mb-2 font-medium">Weight (kg)</label>
          <input
            type="number"
            value={state.weight}
            onChange={(e) => handleChange('weight', e.target.value)}
            className="glass-input w-full"
            placeholder="Enter your weight"
            step="0.1"
          />
          {errors.weight && <p className="text-red-300 text-sm mt-1">{errors.weight}</p>}
        </div>

        {/* Height */}
        <div>
          <label className="block text-white mb-2 font-medium">Height (cm)</label>
          <input
            type="number"
            value={state.height}
            onChange={(e) => handleChange('height', e.target.value)}
            className="glass-input w-full"
            placeholder="Enter your height"
          />
          {errors.height && <p className="text-red-300 text-sm mt-1">{errors.height}</p>}
        </div>

        {/* Activity Level */}
        <div className="md:col-span-2">
          <label className="block text-white mb-2 font-medium">Activity Level</label>
          <select
            value={state.activityLevel}
            onChange={(e) => handleChange('activityLevel', e.target.value)}
            className="glass-input w-full"
          >
            <option value="sedentary" className="text-black">Sedentary</option>
            <option value="light" className="text-black">Lightly Active</option>
            <option value="moderate" className="text-black">Moderately Active</option>
            <option value="active" className="text-black">Active</option>
            <option value="veryActive" className="text-black">Very Active</option>
          </select>
          <p className="text-white/60 text-sm mt-1">
            {getActivityDescription(state.activityLevel)}
          </p>
        </div>
      </div>

      {/* Calculate Button */}
      <button
        onClick={handleCalculate}
        className="glass-button w-full mt-6 text-lg"
      >
        Calculate
      </button>

      {/* Results */}
      {state.bmr !== null && state.tdee !== null && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* BMR */}
          <div className="glass-card-dark p-4 text-center">
            <h3 className="text-white/80 text-sm font-medium mb-1">BMR</h3>
            <p className="text-3xl font-bold text-white">{state.bmr}</p>
            <p className="text-white/60 text-xs">calories/day</p>
          </div>

          {/* TDEE */}
          <div className="glass-card-dark p-4 text-center">
            <h3 className="text-white/80 text-sm font-medium mb-1">TDEE</h3>
            <p className="text-3xl font-bold text-white">{state.tdee}</p>
            <p className="text-white/60 text-xs">calories/day</p>
          </div>

          {/* BMI */}
          <div className="glass-card-dark p-4 text-center">
            <h3 className="text-white/80 text-sm font-medium mb-1">BMI</h3>
            <p className="text-3xl font-bold text-white">{state.bmi}</p>
            <p className="text-white/60 text-xs">{state.bmiCategory}</p>
          </div>
        </div>
      )}

      {/* Nutritional Guidance */}
      {state.tdee !== null && (
        <div className="mt-6 glass-card-dark p-4">
          <h3 className="text-white font-semibold mb-3">Daily Calorie Recommendations</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-white/60">Weight Loss</p>
              <p className="text-white font-medium">{state.tdee - 500} - {state.tdee - 250} cal</p>
            </div>
            <div>
              <p className="text-white/60">Weight Gain</p>
              <p className="text-white font-medium">{state.tdee + 250} - {state.tdee + 500} cal</p>
            </div>
            <div>
              <p className="text-white/60">Maintenance</p>
              <p className="text-white font-medium">{state.tdee} cal</p>
            </div>
            <div>
              <p className="text-white/60">Protein (1.6-2.2g/kg)</p>
              <p className="text-white font-medium">
                {Math.round(parseFloat(state.weight) * 1.6)} - {Math.round(parseFloat(state.weight) * 2.2)}g
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
