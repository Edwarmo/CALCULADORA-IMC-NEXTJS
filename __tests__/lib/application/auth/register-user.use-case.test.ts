/**
 * Tests for Register User Use Case
 * Location mirrors: lib/application/auth/register-user.use-case.ts
 */

import { registerUser } from '@/lib/application/auth/register-user.use-case';

// Mock dependencies
jest.mock('@/lib/infrastructure/prisma/client', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
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
    hashPassword: jest.fn().mockResolvedValue('hashed_password'),
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

describe('registerUser Use Case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Validation', () => {
    it('should reject invalid email format', async () => {
      const formData = new FormData();
      formData.set('email', 'invalid-email');
      formData.set('password', 'password123');

      const result = await registerUser(formData);

      expect(result.success).toBe(false);
      expect(result.error).toContain('email');
    });

    it('should reject short password', async () => {
      const formData = new FormData();
      formData.set('email', 'test@example.com');
      formData.set('password', '12345');

      const result = await registerUser(formData);

      expect(result.success).toBe(false);
      expect(result.error).toContain('6');
    });
  });

  describe('Registration', () => {
    it('should return error when user already exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'existing-user',
        email: 'test@example.com',
        passwordHash: 'hash',
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const formData = new FormData();
      formData.set('email', 'test@example.com');
      formData.set('password', 'password123');

      const result = await registerUser(formData);

      expect(result.success).toBe(false);
      expect(result.error).toContain('exists');
    });

    it('should register successfully with valid data', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 'new-user-123',
        email: 'new@example.com',
        passwordHash: 'hashed_password',
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      (prisma.user.update as jest.Mock).mockResolvedValue({
        id: 'new-user-123',
        email: 'new@example.com',
        passwordHash: 'hashed_password',
        refreshToken: 'refresh_token',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const formData = new FormData();
      formData.set('email', 'new@example.com');
      formData.set('password', 'password123');

      const result = await registerUser(formData);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.id).toBe('new-user-123');
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

      const result = await registerUser(formData);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
