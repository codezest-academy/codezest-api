import { IBaseRepository } from './base.repository';
import { ProgrammingLanguage } from '../entities/language.entity';

/**
 * Programming Language Repository Interface
 */
export interface ILanguageRepository extends IBaseRepository<ProgrammingLanguage> {
  /**
   * Find language by slug
   */
  findBySlug(slug: string): Promise<ProgrammingLanguage | null>;

  /**
   * Find all active languages
   */
  findAllActive(): Promise<ProgrammingLanguage[]>;

  /**
   * Find languages by difficulty
   */
  findByDifficulty(difficulty: string): Promise<ProgrammingLanguage[]>;

  /**
   * Search languages by name
   */
  searchByName(query: string): Promise<ProgrammingLanguage[]>;
}
