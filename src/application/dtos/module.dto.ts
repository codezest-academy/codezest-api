import { z } from 'zod';

/**
 * Module DTOs and Validation Schemas
 */

// Create Module DTO
export const CreateModuleDtoSchema = z.object({
  languageId: z.string().uuid('Invalid language ID'),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200, 'Slug too long')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().max(1000, 'Description too long').optional(),
  syllabus: z.string().max(5000, 'Syllabus too long').optional(),
  order: z.number().int().min(0, 'Order must be non-negative'),
});

export type CreateModuleDto = z.infer<typeof CreateModuleDtoSchema>;

// Update Module DTO
export const UpdateModuleDtoSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  syllabus: z.string().max(5000).optional(),
  order: z.number().int().min(0).optional(),
});

export type UpdateModuleDto = z.infer<typeof UpdateModuleDtoSchema>;

// Module Response DTO
export interface ModuleResponseDto {
  id: string;
  languageId: string;
  title: string;
  slug: string;
  description?: string;
  syllabus?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Query filters
export const ModuleQuerySchema = z.object({
  languageId: z.string().uuid().optional(),
  search: z.string().optional(),
});

export type ModuleQuery = z.infer<typeof ModuleQuerySchema>;

// Reorder modules DTO
export const ReorderModulesDtoSchema = z.object({
  modules: z.array(
    z.object({
      id: z.string().uuid(),
      order: z.number().int().min(0),
    })
  ),
});

export type ReorderModulesDto = z.infer<typeof ReorderModulesDtoSchema>;
