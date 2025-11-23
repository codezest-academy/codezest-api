/**
 * Base Repository Interface
 * Defines common CRUD operations for all repositories
 */
export interface IBaseRepository<T> {
  /**
   * Find entity by ID
   */
  findById(id: string): Promise<T | null>;

  /**
   * Find all entities with optional pagination
   */
  findAll(options?: {
    skip?: number;
    take?: number;
    orderBy?: Record<string, 'asc' | 'desc'>;
  }): Promise<T[]>;

  /**
   * Create a new entity
   */
  create(entity: T): Promise<T>;

  /**
   * Update an existing entity
   */
  update(id: string, entity: Partial<T>): Promise<T>;

  /**
   * Delete an entity by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Count total entities
   */
  count(where?: Record<string, unknown>): Promise<number>;

  /**
   * Check if entity exists
   */
  exists(id: string): Promise<boolean>;
}
