import { z } from 'zod';

/**
 * Common DTO types and schemas
 */

// Pagination
export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// Difficulty enum
export const DifficultySchema = z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']);
export type DifficultyDto = z.infer<typeof DifficultySchema>;

// Material Type enum
export const MaterialTypeSchema = z.enum(['VIDEO', 'ARTICLE', 'CODE_EXAMPLE', 'INTERACTIVE']);
export type MaterialTypeDto = z.infer<typeof MaterialTypeSchema>;

// ID parameter
export const IdParamSchema = z.object({
  id: z.string().uuid(),
});

export type IdParam = z.infer<typeof IdParamSchema>;
