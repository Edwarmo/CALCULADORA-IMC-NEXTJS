/**
 * Tests for Get Operations Use Case
 * Location mirrors: lib/application/operations/get-operations.use-case.ts
 */

import { getUserOperations } from '@/lib/application/operations/get-operations.use-case';

// Mock prisma
jest.mock('@/lib/infrastructure/prisma/client', () => ({
  prisma: {
    operacion: {
      findMany: jest.fn(),
    },
  },
}));

import { prisma } from '@/lib/infrastructure/prisma/client';

describe('getUserOperations Use Case', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if userId is empty', async () => {
    await expect(getUserOperations('')).rejects.toThrow('User ID is required');
  });

  it('should throw error if userId is null', async () => {
    await expect(getUserOperations(null as any)).rejects.toThrow('User ID is required');
  });

  it('should return empty array if no operations found', async () => {
    (prisma.operacion.findMany as jest.Mock).mockResolvedValue([]);

    const result = await getUserOperations('user-123');

    expect(result).toEqual([]);
    expect(prisma.operacion.findMany).toHaveBeenCalledWith({
      where: { usuarioId: 'user-123' },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  });

  it('should return operations for user', async () => {
    const mockOperations = [
      {
        id: 'op-1',
        usuarioId: 'user-123',
        tipo: 'bmr',
        resultado: 1600,
        parametros: { age: 30 },
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 'op-2',
        usuarioId: 'user-123',
        tipo: 'tdee',
        resultado: 2200,
        parametros: null,
        createdAt: new Date('2024-01-02'),
      },
    ];

    (prisma.operacion.findMany as jest.Mock).mockResolvedValue(mockOperations);

    const result = await getUserOperations('user-123');

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('op-1');
    expect(result[0].tipo).toBe('bmr');
    expect(result[0].resultado).toBe(1600);
    expect(result[0].createdAt).toBe('2024-01-01T00:00:00.000Z');
  });

  it('should respect limit parameter', async () => {
    (prisma.operacion.findMany as jest.Mock).mockResolvedValue([]);

    await getUserOperations('user-123', 10);

    expect(prisma.operacion.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 10 })
    );
  });

  it('should convert resultado to number', async () => {
    const mockOperations = [
      {
        id: 'op-1',
        usuarioId: 'user-123',
        tipo: 'bmr',
        resultado: '1600', // String from DB
        parametros: null,
        createdAt: new Date(),
      },
    ];

    (prisma.operacion.findMany as jest.Mock).mockResolvedValue(mockOperations);

    const result = await getUserOperations('user-123');

    expect(typeof result[0].resultado).toBe('number');
  });

  it('should handle null parametros', async () => {
    const mockOperations = [
      {
        id: 'op-1',
        usuarioId: 'user-123',
        tipo: 'bmr',
        resultado: 1600,
        parametros: null,
        createdAt: new Date(),
      },
    ];

    (prisma.operacion.findMany as jest.Mock).mockResolvedValue(mockOperations);

    const result = await getUserOperations('user-123');

    expect(result[0].parametros).toBeNull();
  });
});
