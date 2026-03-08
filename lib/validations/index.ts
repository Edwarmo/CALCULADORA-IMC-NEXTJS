/**
 * Validations - Re-export from domain layer
 * @deprecated Use @/lib/domain/entities instead
 */

export { 
  authSchema, 
  operationSchema as operacionSchema, 
  type AuthInput, 
  type OperationInput as OperacionInput 
} from '@/lib/domain/entities';
