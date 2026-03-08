/**
 * Prisma Client Adapter
 * Infrastructure layer - Database connection management
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

declare global {
  var prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  
  console.log('[Prisma] Connection string:', connectionString.replace(/password[^:]+:/i, 'password:***:'));
  
  const pool = new Pool({ 
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

// Singleton pattern for Prisma client
export const prisma = global.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Re-export Prisma types for convenience
export type { User, Operacion } from '@prisma/client';
