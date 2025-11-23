import { BaseEntity } from './base.entity';

/**
 * Quiz Domain Entity
 */
export class Quiz extends BaseEntity {
  moduleId: string;
  title: string;
  description?: string;
  passingScore: number;
  timeLimit?: number; // in minutes

  constructor(
    id: string,
    moduleId: string,
    title: string,
    passingScore: number,
    createdAt: Date,
    updatedAt: Date,
    description?: string,
    timeLimit?: number
  ) {
    super(id, createdAt, updatedAt);
    this.moduleId = moduleId;
    this.title = title;
    this.description = description;
    this.passingScore = passingScore;
    this.timeLimit = timeLimit;
  }

  /**
   * Create a new quiz
   */
  static create(
    moduleId: string,
    title: string,
    passingScore: number = 70,
    description?: string,
    timeLimit?: number
  ): Quiz {
    return new Quiz(
      '',
      moduleId,
      title,
      passingScore,
      new Date(),
      new Date(),
      description,
      timeLimit
    );
  }

  /**
   * Update quiz details
   */
  update(data: {
    title?: string;
    description?: string;
    passingScore?: number;
    timeLimit?: number;
  }): void {
    if (data.title) this.title = data.title;
    if (data.description !== undefined) this.description = data.description;
    if (data.passingScore !== undefined) this.passingScore = data.passingScore;
    if (data.timeLimit !== undefined) this.timeLimit = data.timeLimit;
    this.updatedAt = new Date();
  }

  /**
   * Check if score passes the quiz
   */
  isPassing(score: number): boolean {
    return score >= this.passingScore;
  }

  /**
   * Check if quiz has time limit
   */
  hasTimeLimit(): boolean {
    return this.timeLimit !== undefined && this.timeLimit > 0;
  }

  clone(): Quiz {
    return new Quiz(
      this.id,
      this.moduleId,
      this.title,
      this.passingScore,
      this.createdAt,
      this.updatedAt,
      this.description,
      this.timeLimit
    );
  }
}
