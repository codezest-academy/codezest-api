import { z } from 'zod';
import { MaterialTypeSchema } from './common.dto';

/**
 * Material DTOs and Validation Schemas
 */

// Create Material DTO
export const CreateMaterialDtoSchema = z.object({
  moduleId: z.string().uuid('Invalid module ID'),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  type: MaterialTypeSchema,
  content: z.string().min(1, 'Content is required').max(10000, 'Content too long'),
  duration: z.number().int().min(0, 'Duration must be non-negative').optional(),
  order: z.number().int().min(0, 'Order must be non-negative'),
});

export type CreateMaterialDto = z.infer<typeof CreateMaterialDtoSchema>;

// Update Material DTO
export const UpdateMaterialDtoSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  type: MaterialTypeSchema.optional(),
  content: z.string().min(1).max(10000).optional(),
  duration: z.number().int().min(0).optional(),
  order: z.number().int().min(0).optional(),
});

export type UpdateMaterialDto = z.infer<typeof UpdateMaterialDtoSchema>;

// Material Response DTO
export interface MaterialResponseDto {
  id: string;
  moduleId: string;
  title: string;
  type: string;
  content: string;
  duration?: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Query filters
export const MaterialQuerySchema = z.object({
  moduleId: z.string().uuid().optional(),
  type: MaterialTypeSchema.optional(),
});

export type MaterialQuery = z.infer<typeof MaterialQuerySchema>;

// Reorder materials DTO
export const ReorderMaterialsDtoSchema = z.object({
  materials: z.array(
    z.object({
      id: z.string().uuid(),
      order: z.number().int().min(0),
    })
  ),
});

export type ReorderMaterialsDto = z.infer<typeof ReorderMaterialsDtoSchema>;
