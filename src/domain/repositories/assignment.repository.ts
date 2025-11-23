import { IBaseRepository } from './base.repository';
import { Assignment } from '../entities/assignment.entity';

/**
 * Assignment Repository Interface
 */
export interface IAssignmentRepository extends IBaseRepository<Assignment> {
  /**
   * Find assignments by module ID
   */
  findByModuleId(moduleId: string): Promise<Assignment[]>;

  /**
   * Find assignments by difficulty
   */
  findByDifficulty(moduleId: string, difficulty: string): Promise<Assignment[]>;

  /**
   * Find assignments by language ID (through module)
   */
  findByLanguageId(languageId: string): Promise<Assignment[]>;
}
