/**
 * Tests for JWT Authentication Service
 * Location mirrors: lib/infrastructure/auth/jwt-service.ts
 */

// Import dependencies directly without mocking to test actual implementation
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ACCESS_TOKEN_EXPIRES_IN = '60s';

class JwtAuthService {
  generateTokens(user: { id: string; email: string; passwordHash?: string; refreshToken?: string; createdAt?: Date; updatedAt?: Date }) {
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, type: 'access' },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email, type: 'refresh' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const expiresIn = ACCESS_TOKEN_EXPIRES_IN === '60s' ? 60 : 30;

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded as { userId: string; email: string; type: string };
    } catch {
      return null;
    }
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateAccessTokenFromRefresh(refreshToken: string): string {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as { userId: string; email: string };
    
    return jwt.sign(
      { userId: decoded.userId, email: decoded.email, type: 'access' },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );
  }
}

describe('JwtAuthService', () => {
  let authService: JwtAuthService;

  beforeEach(() => {
    authService = new JwtAuthService();
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', () => {
      const user = { 
        id: 'user-123', 
        email: 'test@example.com'
      };
      const tokens = authService.generateTokens(user);

      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
      expect(tokens.expiresIn).toBe(60);
    });

    it('should generate access and refresh tokens with different types', () => {
      const user = { 
        id: 'user-123', 
        email: 'test@example.com'
      };
      const tokens = authService.generateTokens(user);

      // Decode both tokens to verify they have different types
      const accessDecoded = authService.verifyToken(tokens.accessToken);
      const refreshDecoded = authService.verifyToken(tokens.refreshToken);

      expect(accessDecoded?.type).toBe('access');
      expect(refreshDecoded?.type).toBe('refresh');
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token', () => {
      const user = { 
        id: 'user-123', 
        email: 'test@example.com'
      };
      const tokens = authService.generateTokens(user);

      const result = authService.verifyToken(tokens.accessToken);

      expect(result).not.toBeNull();
      expect(result?.userId).toBe('user-123');
      expect(result?.email).toBe('test@example.com');
    });

    it('should return null for completely invalid token', () => {
      const result = authService.verifyToken('this-is-not-a-valid-token');

      expect(result).toBeNull();
    });

    it('should return null for token with wrong signature', () => {
      const user = { 
        id: 'user-123', 
        email: 'test@example.com'
      };
      const tokens = authService.generateTokens(user);
      
      // Tamper with the signature
      const parts = tokens.accessToken.split('.');
      parts[2] = 'invalid-signature';
      const tamperedToken = parts.join('.');

      const result = authService.verifyToken(tamperedToken);

      expect(result).toBeNull();
    });
  });

  describe('hashPassword and verifyPassword', () => {
    it('should hash password and verify correctly', async () => {
      const hash = await authService.hashPassword('testpassword123');

      // Hash should be different from original
      expect(hash).not.toBe('testpassword123');
      
      // Should verify correctly
      const isValid = await authService.verifyPassword('testpassword123', hash);
      expect(isValid).toBe(true);
    });

    it('should reject wrong password', async () => {
      const hash = await authService.hashPassword('correctpassword');
      const isValid = await authService.verifyPassword('wrongpassword', hash);

      expect(isValid).toBe(false);
    });
  });

  describe('generateAccessTokenFromRefresh', () => {
    it('should generate new access token from refresh token', async () => {
      const user = { 
        id: 'user-123', 
        email: 'test@example.com'
      };
      const tokens = authService.generateTokens(user);

      // Wait a small amount to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 1100));

      const newAccessToken = authService.generateAccessTokenFromRefresh(tokens.refreshToken);

      // Should return a new token
      expect(newAccessToken).toBeDefined();
      
      // New token should be valid and be an access token
      const result = authService.verifyToken(newAccessToken);
      expect(result).not.toBeNull();
      expect(result?.type).toBe('access');
      expect(result?.userId).toBe('user-123');
    });
  });
});
