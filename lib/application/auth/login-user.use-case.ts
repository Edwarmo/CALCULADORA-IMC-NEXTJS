/**
 * Login User Use Case
 * Application layer - Business logic orchestration
 */

import { prisma } from '@/lib/infrastructure/prisma/client';
import { authService } from '@/lib/infrastructure/auth/jwt-service';
import { authSchema } from '@/lib/domain/entities';
import { cookies } from 'next/headers';

export interface LoginResult {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
  };
  token?: string;
}

/**
 * Execute login use case
 * Validates credentials, generates tokens, and sets cookies
 */
export async function loginUser(formData: FormData): Promise<LoginResult> {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log('[Login] Attempting login for:', email);

    // Validate input
    const validated = authSchema.safeParse({ email, password });
    if (!validated.success) {
      console.log('[Login] Validation failed:', validated.error.issues);
      return { success: false, error: validated.error.issues[0].message };
    }

    // Find user in database
    console.log('[Login] Looking for user in database...');
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log('[Login] User not found');
      return { success: false, error: 'Invalid credentials' };
    }

    console.log('[Login] User found:', user.id);

    // Verify password
    const isValid = await authService.verifyPassword(password, user.passwordHash || '');
    if (!isValid) {
      console.log('[Login] Password verification failed');
      return { success: false, error: 'Invalid credentials' };
    }

    console.log('[Login] Password verified, generating tokens...');

    // Generate tokens
    const tokens = authService.generateTokens(user);

    // Update refresh token in database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    // Set cookies
    const cookieStore = await cookies();
    
    cookieStore.set('token', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: tokens.expiresIn,
      path: '/',
    });

    cookieStore.set('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    console.log('[Login] Tokens generated and cookies set');

    return {
      success: true,
      user: { id: user.id, email: user.email },
      token: tokens.accessToken,
    };
  } catch (error) {
    console.error('[Login] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred during login';
    return { success: false, error: errorMessage };
  }
}
