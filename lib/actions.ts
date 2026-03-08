/**
 * Server Actions - Re-export from application layer
 * @deprecated Use @/lib/application/operations/get-operations.use-case instead
 */

import { getUserOperations, type OperacionData as UserOperacionData } from '@/lib/application/operations/get-operations.use-case';

// Re-export with original name for backward compatibility
export const getOperaciones = getUserOperations;
export type OperacionData = UserOperacionData;
