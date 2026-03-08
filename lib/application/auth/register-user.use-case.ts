/**
 * Register User Use Case
 * Application layer - Business logic orchestration
 */

import { prisma } from '@/lib/infrastructure/prisma/client';
import { authService } from '@/lib/infrastructure/auth/jwt-service';
import { authSchema } from '@/lib/domain/entities';
import { cookies } from 'next/headers';

export interface RegisterResult {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
  };
  token?: string;
}

/**
 * Execute registration use case
 * Validates input, creates user, generates tokens, and sets cookies
 */
export async function registerUser(formData: FormData): Promise<RegisterResult> {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log('[Register] Attempting registration for:', email);

    // Validate input
    const validated = authSchema.safeParse({ email, password });
    if (!validated.success) {
      console.log('[Register] Validation failed:', validated.error.issues);
      return { success: false, error: validated.error.issues[0].message };
    }

    // Check if user already exists
    console.log('[Register] Checking if user exists...');
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('[Register] User already exists');
      return { success: false, error: 'User already exists' };
    }

    // Hash password
    console.log('[Register] Hashing password...');
    const passwordHash = await authService.hashPassword(password);

    // Create user
    console.log('[Register] Creating user...');
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
      },
    });

    console.log('[Register] User created:', user.id);

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

    console.log('[Register] Tokens generated and cookies set');

    return {
      success: true,
      user: { id: user.id, email: user.email },
      token: tokens.accessToken,
    };
  } catch (error) {
    console.error('[Register] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred during registration';
    return { success: false, error: errorMessage };
  }
}
