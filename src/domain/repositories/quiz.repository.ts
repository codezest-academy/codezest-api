import { IBaseRepository } from './base.repository';
import { Quiz } from '../entities/quiz.entity';

/**
 * Quiz Repository Interface
 */
export interface IQuizRepository extends IBaseRepository<Quiz> {
  /**
   * Find quizzes by module ID
   */
  findByModuleId(moduleId: string): Promise<Quiz[]>;

  /**
   * Find quiz with questions
   */
  findByIdWithQuestions(id: string): Promise<Quiz | null>;

  /**
   * Find quizzes by language ID (through module)
   */
  findByLanguageId(languageId: string): Promise<Quiz[]>;
}
