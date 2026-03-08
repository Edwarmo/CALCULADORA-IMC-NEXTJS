/**
 * Tests for Refresh Token Use Case
 * Location mirrors: lib/application/auth/refresh-token.use-case.ts
 */

import { refreshToken } from '@/lib/application/auth/refresh-token.use-case';

// Mock dependencies
jest.mock('@/lib/infrastructure/prisma/client', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('@/lib/infrastructure/auth/jwt-service', () => ({
  authService: {
    verifyToken: jest.fn(),
    generateAccessTokenFromRefresh: jest.fn(),
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

describe('refreshToken Use Case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return error if no refresh token', async () => {
    const cookies = require('next/headers').cookies;
    cookies.mockResolvedValue({
      get: jest.fn().mockReturnValue(undefined),
      set: jest.fn(),
    });

    const result = await refreshToken();

    expect(result.success).toBe(false);
    expect(result.error).toBe('No refresh token');
  });

  it('should return error if token is invalid', async () => {
    const cookies = require('next/headers').cookies;
    cookies.mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: 'invalid-token' }),
      set: jest.fn(),
    });
    (authService.verifyToken as jest.Mock).mockReturnValue(null);

    const result = await refreshToken();

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid token type');
  });

  it('should return error if token is not a refresh token', async () => {
    const cookies = require('next/headers').cookies;
    cookies.mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: 'access-token' }),
      set: jest.fn(),
    });
    (authService.verifyToken as jest.Mock).mockReturnValue({
      userId: 'user-123',
      type: 'access',
    });

    const result = await refreshToken();

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid token type');
  });

  it('should return error if user not found', async () => {
    const cookies = require('next/headers').cookies;
    cookies.mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: 'refresh-token' }),
      set: jest.fn(),
    });
    (authService.verifyToken as jest.Mock).mockReturnValue({
      userId: 'user-123',
      type: 'refresh',
    });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await refreshToken();

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid refresh token');
  });

  it('should return error if refresh token does not match database', async () => {
    const cookies = require('next/headers').cookies;
    cookies.mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: 'refresh-token' }),
      set: jest.fn(),
    });
    (authService.verifyToken as jest.Mock).mockReturnValue({
      userId: 'user-123',
      type: 'refresh',
    });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'user-123',
      refreshToken: 'different-token',
    });

    const result = await refreshToken();

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid refresh token');
  });

  it('should successfully refresh token', async () => {
    const cookies = require('next/headers').cookies;
    const setFn = jest.fn();
    cookies.mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: 'refresh-token' }),
      set: setFn,
    });
    (authService.verifyToken as jest.Mock).mockReturnValue({
      userId: 'user-123',
      type: 'refresh',
    });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'user-123',
      refreshToken: 'refresh-token',
    });
    (authService.generateAccessTokenFromRefresh as jest.Mock).mockReturnValue('new-access-token');

    const result = await refreshToken();

    expect(result.success).toBe(true);
    expect(result.token).toBe('new-access-token');
    expect(setFn).toHaveBeenCalledWith('token', 'new-access-token', expect.objectContaining({
      httpOnly: true,
      maxAge: 60,
    }));
  });

  it('should handle errors gracefully', async () => {
    const cookies = require('next/headers').cookies;
    cookies.mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: 'refresh-token' }),
      set: jest.fn(),
    });
    (authService.verifyToken as jest.Mock).mockImplementation(() => {
      throw new Error('Database error');
    });

    const result = await refreshToken();

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
