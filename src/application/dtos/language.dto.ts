import { z } from 'zod';
import { DifficultySchema } from './common.dto';

/**
 * Language DTOs and Validation Schemas
 */

// Create Language DTO
export const CreateLanguageDtoSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100, 'Slug too long')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().max(500, 'Description too long').optional(),
  icon: z.string().url('Invalid icon URL').optional().or(z.literal('')),
  difficulty: DifficultySchema.default('BEGINNER'),
});

export type CreateLanguageDto = z.infer<typeof CreateLanguageDtoSchema>;

// Update Language DTO
export const UpdateLanguageDtoSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  icon: z.string().url().optional().or(z.literal('')),
  difficulty: DifficultySchema.optional(),
});

export type UpdateLanguageDto = z.infer<typeof UpdateLanguageDtoSchema>;

// Language Response DTO
export interface LanguageResponseDto {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  difficulty: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Query filters
export const LanguageQuerySchema = z.object({
  difficulty: DifficultySchema.optional(),
  search: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
});

export type LanguageQuery = z.infer<typeof LanguageQuerySchema>;
