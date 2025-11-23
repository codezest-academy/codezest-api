import { IBaseRepository } from './base.repository';
import { Material } from '../entities/material.entity';

/**
 * Material Repository Interface
 */
export interface IMaterialRepository extends IBaseRepository<Material> {
  /**
   * Find materials by module ID
   */
  findByModuleId(moduleId: string): Promise<Material[]>;

  /**
   * Find materials by module ID with ordering
   */
  findByModuleIdOrdered(moduleId: string): Promise<Material[]>;

  /**
   * Find materials by type
   */
  findByType(moduleId: string, type: string): Promise<Material[]>;

  /**
   * Reorder materials for a module
   */
  reorderMaterials(
    moduleId: string,
    materialOrders: { id: string; order: number }[]
  ): Promise<void>;
}
