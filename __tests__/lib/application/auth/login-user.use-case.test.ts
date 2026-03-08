/**
 * Tests for Login User Use Case
 * Location mirrors: lib/application/auth/login-user.use-case.ts
 */

import { loginUser } from '@/lib/application/auth/login-user.use-case';

// Mock dependencies
jest.mock('@/lib/infrastructure/prisma/client', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('@/lib/infrastructure/auth/jwt-service', () => ({
  authService: {
    generateTokens: jest.fn().mockReturnValue({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
      expiresIn: 60,
    }),
    verifyPassword: jest.fn(),
  },
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn().mockResolvedValue({
    get: jest.fn(),
    set: jest.fn(),
  }),
}));

import { prisma } from '@/lib/infrastructure/prisma/client';
import { authService } from '@/lib/infrastructure/auth/jwt-service';

describe('loginUser Use Case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Validation', () => {
    it('should reject invalid email format', async () => {
      const formData = new FormData();
      formData.set('email', 'invalid-email');
      formData.set('password', 'password123');

      const result = await loginUser(formData);

      expect(result.success).toBe(false);
      expect(result.error).toContain('email');
    });

    it('should reject short password', async () => {
      const formData = new FormData();
      formData.set('email', 'test@example.com');
      formData.set('password', '12345');

      const result = await loginUser(formData);

      expect(result.success).toBe(false);
      expect(result.error).toContain('6');
    });
  });

  describe('Authentication', () => {
    it('should return error when user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const formData = new FormData();
      formData.set('email', 'nonexistent@example.com');
      formData.set('password', 'password123');

      const result = await loginUser(formData);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid');
    });

    it('should return error when password is wrong', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        password: 'hashed_password',
      });
      (authService.verifyPassword as jest.Mock).mockResolvedValue(false);

      const formData = new FormData();
      formData.set('email', 'test@example.com');
      formData.set('password', 'wrongpassword');

      const result = await loginUser(formData);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid');
    });

    it('should login successfully with correct credentials', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        password: 'hashed_password',
      });
      (authService.verifyPassword as jest.Mock).mockResolvedValue(true);

      const formData = new FormData();
      formData.set('email', 'test@example.com');
      formData.set('password', 'correctpassword');

      const result = await loginUser(formData);

      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      const formData = new FormData();
      formData.set('email', 'test@example.com');
      formData.set('password', 'password123');

      const result = await loginUser(formData);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
