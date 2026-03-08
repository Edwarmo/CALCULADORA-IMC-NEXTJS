/**
 * Domain Entities and Business Rules
 * Pure interfaces and types - no implementation details
 */

import { z } from 'zod';

// ==================== User Entity ====================

export interface User {
  id: string;
  email: string;
  passwordHash: string | null;
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithoutSensitiveData {
  id: string;
  email: string;
  createdAt: Date;
}

// ==================== Operation Entity ====================

export type OperationType = 'bmr' | 'tdee' | 'imc' | 'calorias';

export interface Operation {
  id: string;
  usuarioId: string;
  tipo: OperationType;
  resultado: number;
  parametros: Record<string, unknown> | null;
  createdAt: Date;
}

// ==================== Auth Value Objects ====================

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
}

export interface AuthPayload {
  userId: string;
  email: string;
  type?: 'access' | 'refresh';
}

// ==================== Auth Input Validation Schema ====================

export const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type AuthInput = z.infer<typeof authSchema>;

// ==================== Operation Input Validation Schema ====================

export const operationSchema = z.object({
  usuarioId: z.string().uuid('Invalid user ID'),
  tipo: z.enum(['bmr', 'tdee', 'imc', 'calorias']),
  resultado: z.preprocess(
    (val) => (val === null || val === undefined ? undefined : Number(val)),
    z.number()
  ),
  parametros: z.record(z.string(), z.unknown()).optional(),
  createdAt: z.date().optional(),
});

export type OperationInput = z.infer<typeof operationSchema>;

// ==================== Calculator Types ====================

export type Gender = 'male' | 'female';

export type ActivityLevel = 
  | 'sedentary' 
  | 'light' 
  | 'moderate' 
  | 'active' 
  | 'veryActive';

export interface CalculatorInput {
  age: number;
  gender: Gender;
  weight: number; // kg
  height: number; // cm
  activityLevel: ActivityLevel;
}

export interface CalculatorResult {
  bmr: number;
  tdee: number;
  bmi: number;
  bmiCategory: string;
}

// ==================== Repository Interfaces ====================

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(data: { email: string; passwordHash: string }): Promise<User>;
  updateRefreshToken(userId: string, refreshToken: string | null): Promise<void>;
}

export interface IOperationRepository {
  findByUserId(userId: string, limit?: number): Promise<Operation[]>;
  create(data: Omit<Operation, 'id' | 'createdAt'>): Promise<Operation>;
}

// ==================== Auth Service Interface ====================

export interface IAuthService {
  generateTokens(user: User): AuthTokens;
  verifyToken(token: string): AuthPayload | null;
  hashPassword(password: string): Promise<string>;
  verifyPassword(password: string, hash: string): Promise<boolean>;
}
