/**
 * Tests for Validations Re-export
 * Location mirrors: lib/validations/index.ts
 */

import { authSchema, operacionSchema } from '@/lib/validations';

describe('Validations Re-export', () => {
  describe('authSchema', () => {
    it('should export authSchema from domain', () => {
      expect(authSchema).toBeDefined();
    });

    it('should validate email format', () => {
      const result = authSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = authSchema.safeParse({
        email: 'invalid',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('operationSchema', () => {
    it('should export operationSchema from domain', () => {
      expect(operacionSchema).toBeDefined();
    });

    it('should validate operation data', () => {
      const result = operacionSchema.safeParse({
        usuarioId: '123e4567-e89b-12d3-a456-426614174000',
        tipo: 'bmr',
        resultado: 1600,
      });
      expect(result.success).toBe(true);
    });
  });
});
