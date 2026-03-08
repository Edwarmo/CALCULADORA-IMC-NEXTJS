/**
 * Tests for Domain Entities and Validation Schemas
 * Location mirrors: lib/domain/entities.ts
 */

import { authSchema, operationSchema } from '@/lib/domain/entities';

describe('Domain Entities and Validations', () => {
  describe('authSchema', () => {
    it('should validate correct email and password', () => {
      const result = authSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('test@example.com');
        expect(result.data.password).toBe('password123');
      }
    });

    it('should reject invalid email format', () => {
      const result = authSchema.safeParse({
        email: 'invalid-email',
        password: 'password123',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email');
      }
    });

    it('should reject email without @', () => {
      const result = authSchema.safeParse({
        email: 'testexample.com',
        password: 'password123',
      });

      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const result = authSchema.safeParse({
        email: 'test@example.com',
        password: '12345',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('password');
      }
    });

    it('should reject empty email', () => {
      const result = authSchema.safeParse({
        email: '',
        password: 'password123',
      });

      expect(result.success).toBe(false);
    });

    it('should reject empty password', () => {
      const result = authSchema.safeParse({
        email: 'test@example.com',
        password: '',
      });

      expect(result.success).toBe(false);
    });

    it('should accept password with exactly 6 characters', () => {
      const result = authSchema.safeParse({
        email: 'test@example.com',
        password: '123456',
      });

      expect(result.success).toBe(true);
    });
  });

  describe('operationSchema', () => {
    it('should validate correct operation data', () => {
      const result = operationSchema.safeParse({
        usuarioId: '123e4567-e89b-12d3-a456-426614174000',
        tipo: 'bmr',
        resultado: 1600,
        parametros: { age: 30, weight: 70 },
      });

      expect(result.success).toBe(true);
    });

    it('should reject invalid operation type', () => {
      const result = operationSchema.safeParse({
        usuarioId: '123e4567-e89b-12d3-a456-426614174000',
        tipo: 'invalid',
        resultado: 1600,
      });

      expect(result.success).toBe(false);
    });

    it('should reject invalid UUID for usuarioId', () => {
      const result = operationSchema.safeParse({
        usuarioId: 'not-a-uuid',
        tipo: 'bmr',
        resultado: 1600,
      });

      expect(result.success).toBe(false);
    });

    it('should accept all valid operation types', () => {
      const types = ['bmr', 'tdee', 'imc', 'calorias'];
      
      types.forEach((tipo) => {
        const result = operationSchema.safeParse({
          usuarioId: '123e4567-e89b-12d3-a456-426614174000',
          tipo,
          resultado: 1600,
        });

        expect(result.success).toBe(true);
      });
    });

    it('should convert string resultado to number', () => {
      const result = operationSchema.safeParse({
        usuarioId: '123e4567-e89b-12d3-a456-426614174000',
        tipo: 'bmr',
        resultado: '1600',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.data.resultado).toBe('number');
      }
    });

    it('should handle null resultado', () => {
      const result = operationSchema.safeParse({
        usuarioId: '123e4567-e89b-12d3-a456-426614174000',
        tipo: 'bmr',
        resultado: null,
      });

      expect(result.success).toBe(false);
    });

    it('should handle undefined resultado', () => {
      const result = operationSchema.safeParse({
        usuarioId: '123e4567-e89b-12d3-a456-426614174000',
        tipo: 'bmr',
      });

      expect(result.success).toBe(false);
    });

    it('should accept optional parametros', () => {
      const result = operationSchema.safeParse({
        usuarioId: '123e4567-e89b-12d3-a456-426614174000',
        tipo: 'bmr',
        resultado: 1600,
        parametros: { key: 'value' },
      });

      expect(result.success).toBe(true);
    });

    it('should accept optional createdAt', () => {
      const result = operationSchema.safeParse({
        usuarioId: '123e4567-e89b-12d3-a456-426614174000',
        tipo: 'bmr',
        resultado: 1600,
        createdAt: new Date(),
      });

      expect(result.success).toBe(true);
    });
  });
});
