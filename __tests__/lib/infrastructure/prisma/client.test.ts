/**
 * Tests for Prisma Client
 * Location mirrors: lib/infrastructure/prisma/client.ts
 */

// Mock pg and Prisma
jest.mock('pg', () => ({
  Pool: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  })),
}));

jest.mock('@prisma/adapter-pg', () => ({
  PrismaPg: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({})),
}));

describe('Prisma Client', () => {
  it('should have DATABASE_URL environment variable set for tests', () => {
    expect(process.env.DATABASE_URL).toBeDefined();
  });
});
