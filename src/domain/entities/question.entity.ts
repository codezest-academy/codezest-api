import { BaseEntity } from './base.entity';

export interface QuestionOption {
  id: string;
  optionText: string;
  isCorrect: boolean;
  order: number;
}

/**
 * Question Domain Entity
 */
export class Question extends BaseEntity {
  quizId: string;
  question: string;
  explanation?: string;
  order: number;
  points: number;
  options: QuestionOption[];

  constructor(
    id: string,
    quizId: string,
    question: string,
    order: number,
    points: number,
    options: QuestionOption[],
    createdAt: Date,
    updatedAt: Date,
    explanation?: string
  ) {
    super(id, createdAt, updatedAt);
    this.quizId = quizId;
    this.question = question;
    this.explanation = explanation;
    this.order = order;
    this.points = points;
    this.options = options;
  }

  /**
   * Create a new question
   */
  static create(
    quizId: string,
    question: string,
    order: number,
    options: QuestionOption[],
    points: number = 1,
    explanation?: string
  ): Question {
    return new Question(
      '',
      quizId,
      question,
      order,
      points,
      options,
      new Date(),
      new Date(),
      explanation
    );
  }

  /**
   * Update question details
   */
  update(data: {
    question?: string;
    explanation?: string;
    order?: number;
    points?: number;
    options?: QuestionOption[];
  }): void {
    if (data.question) this.question = data.question;
    if (data.explanation !== undefined) this.explanation = data.explanation;
    if (data.order !== undefined) this.order = data.order;
    if (data.points !== undefined) this.points = data.points;
    if (data.options) this.options = data.options;
    this.updatedAt = new Date();
  }

  /**
   * Get correct option(s)
   */
  getCorrectOptions(): QuestionOption[] {
    return this.options.filter((opt) => opt.isCorrect);
  }

  /**
   * Check if an option is correct
   */
  isCorrectOption(optionId: string): boolean {
    const option = this.options.find((opt) => opt.id === optionId);
    return option?.isCorrect ?? false;
  }

  /**
   * Validate that question has at least one correct answer
   */
  isValid(): boolean {
    return this.options.some((opt) => opt.isCorrect);
  }

  /**
   * Reorder question
   */
  reorder(newOrder: number): void {
    this.order = newOrder;
    this.updatedAt = new Date();
  }

  clone(): Question {
    return new Question(
      this.id,
      this.quizId,
      this.question,
      this.order,
      this.points,
      [...this.options],
      this.createdAt,
      this.updatedAt,
      this.explanation
    );
  }
}
