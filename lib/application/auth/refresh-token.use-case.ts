/**
 * Refresh Token Use Case
 * Application layer - Generate new access token from refresh token
 */

import { prisma } from '@/lib/infrastructure/prisma/client';
import { authService } from '@/lib/infrastructure/auth/jwt-service';
import { cookies } from 'next/headers';

export interface RefreshResult {
  success: boolean;
  token?: string;
  error?: string;
}

/**
 * Execute token refresh
 * Validates refresh token and generates new access token
 */
export async function refreshToken(): Promise<RefreshResult> {
  try {
    const cookieStore = await cookies();
    const refreshTokenValue = cookieStore.get('refreshToken')?.value;

    if (!refreshTokenValue) {
      return { success: false, error: 'No refresh token' };
    }

    // Verify refresh token
    const decoded = authService.verifyToken(refreshTokenValue);
    
    if (!decoded || decoded.type !== 'refresh') {
      return { success: false, error: 'Invalid token type' };
    }

    // Verify refresh token matches database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.refreshToken !== refreshTokenValue) {
      return { success: false, error: 'Invalid refresh token' };
    }

    // Generate new access token
    const newAccessToken = authService.generateAccessTokenFromRefresh(refreshTokenValue);

    // Set new access token cookie
    cookieStore.set('token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60, // 60 seconds
      path: '/',
    });

    return { success: true, token: newAccessToken };
  } catch (error) {
    console.error('Refresh token error:', error);
    return { success: false, error: 'Failed to refresh token' };
  }
}
