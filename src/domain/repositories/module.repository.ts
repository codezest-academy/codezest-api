import { IBaseRepository } from './base.repository';
import { Module } from '../entities/module.entity';

/**
 * Module Repository Interface
 */
export interface IModuleRepository extends IBaseRepository<Module> {
  /**
   * Find modules by language ID
   */
  findByLanguageId(languageId: string): Promise<Module[]>;

  /**
   * Find module by language ID and slug
   */
  findByLanguageAndSlug(languageId: string, slug: string): Promise<Module | null>;

  /**
   * Find modules by language ID with ordering
   */
  findByLanguageIdOrdered(languageId: string): Promise<Module[]>;

  /**
   * Reorder modules for a language
   */
  reorderModules(languageId: string, moduleOrders: { id: string; order: number }[]): Promise<void>;
}
