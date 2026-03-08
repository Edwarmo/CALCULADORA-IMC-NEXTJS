/**
 * Auth Actions - Re-exports from application layer for backward compatibility
 * @deprecated Use @/lib/application/auth directly
 */

import { loginUser } from '@/lib/application/auth/login-user.use-case';
import { registerUser } from '@/lib/application/auth/register-user.use-case';

export const register = registerUser;
export const login = loginUser;

export { loginUser, registerUser };
