'use server';

/**
 * Auth Server Actions
 * These are the ONLY functions that can use next/headers (cookies)
 * They call the use cases from the application layer
 */

import { loginUser, type LoginResult } from '@/lib/application/auth/login-user.use-case';
import { registerUser, type RegisterResult } from '@/lib/application/auth/register-user.use-case';

export async function loginAction(formData: FormData): Promise<LoginResult> {
  'use server';
  return await loginUser(formData);
}

export async function registerAction(formData: FormData): Promise<RegisterResult> {
  'use server';
  return await registerUser(formData);
}
