/**
 * Get User Operations Use Case
 * Application layer - Retrieve user's calculation history
 */

import { prisma } from '@/lib/infrastructure/prisma/client';
import type { Operation } from '@/lib/domain/entities';
import type { Prisma } from '@prisma/client';

export interface OperacionData {
  id: string;
  usuarioId: string;
  tipo: string;
  resultado: number;
  parametros: Record<string, unknown> | null;
  createdAt: string;
}

/**
 * Get operations for a specific user
 * Returns the most recent operations ordered by creation date
 */
export async function getUserOperations(userId: string, limit = 20): Promise<OperacionData[]> {
  if (!userId) throw new Error('User ID is required');

  const operaciones = await prisma.operacion.findMany({
    where: { usuarioId: userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return operaciones.map((op: Prisma.OperacionGetPayload<null>) => ({
    id: op.id,
    usuarioId: op.usuarioId,
    tipo: op.tipo,
    resultado: Number(op.resultado),
    parametros: op.parametros ? JSON.parse(JSON.stringify(op.parametros)) : null,
    createdAt: op.createdAt.toISOString(),
  }));
}
