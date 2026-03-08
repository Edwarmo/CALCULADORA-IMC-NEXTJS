/**
 * JWT Authentication Service
 * Infrastructure layer implementation for token management
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { IAuthService, AuthTokens, AuthPayload, User } from '@/lib/domain/entities';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ACCESS_TOKEN_EXPIRES_IN = '60s'; // Short-lived access token (30-60s recommended)
const REFRESH_TOKEN_EXPIRES_IN = '7d';

export class JwtAuthService implements IAuthService {
  /**
   * Generate access and refresh tokens for a user
   */
  generateTokens(user: User): AuthTokens {
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, type: 'access' },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email, type: 'refresh' },
      JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );

    // Parse expiresIn to seconds
    const expiresIn = ACCESS_TOKEN_EXPIRES_IN === '60s' ? 60 : 30;

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  /**
   * Verify and decode a JWT token
   */
  verifyToken(token: string): AuthPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * Hash a password using bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  /**
   * Verify a password against a hash
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate a new access token from a refresh token
   */
  generateAccessTokenFromRefresh(refreshToken: string): string {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as AuthPayload;
    
    return jwt.sign(
      { userId: decoded.userId, email: decoded.email, type: 'access' },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );
  }
}

// Singleton instance
export const authService = new JwtAuthService();
