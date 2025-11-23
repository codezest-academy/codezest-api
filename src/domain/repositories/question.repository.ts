import { IBaseRepository } from './base.repository';
import { Question } from '../entities/question.entity';

/**
 * Question Repository Interface
 */
export interface IQuestionRepository extends IBaseRepository<Question> {
  /**
   * Find questions by quiz ID
   */
  findByQuizId(quizId: string): Promise<Question[]>;

  /**
   * Find questions by quiz ID with ordering
   */
  findByQuizIdOrdered(quizId: string): Promise<Question[]>;

  /**
   * Reorder questions for a quiz
   */
  reorderQuestions(quizId: string, questionOrders: { id: string; order: number }[]): Promise<void>;

  /**
   * Find question with options
   */
  findByIdWithOptions(id: string): Promise<Question | null>;
}
