import { BaseEntity } from './base.entity';
import { Difficulty } from './language.entity';
export { Difficulty };

export interface TestCase {
  input: string;
  expectedOutput: string;
  description?: string;
}

/**
 * Assignment Domain Entity
 */
export class Assignment extends BaseEntity {
  moduleId: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  starterCode?: string;
  testCases: TestCase[];
  hints?: string[];
  maxScore: number;
  timeLimit?: number; // in minutes

  constructor(
    id: string,
    moduleId: string,
    title: string,
    description: string,
    difficulty: Difficulty,
    testCases: TestCase[],
    maxScore: number,
    createdAt: Date,
    updatedAt: Date,
    starterCode?: string,
    hints?: string[],
    timeLimit?: number
  ) {
    super(id, createdAt, updatedAt);
    this.moduleId = moduleId;
    this.title = title;
    this.description = description;
    this.difficulty = difficulty;
    this.starterCode = starterCode;
    this.testCases = testCases;
    this.hints = hints;
    this.maxScore = maxScore;
    this.timeLimit = timeLimit;
  }

  /**
   * Create a new assignment
   */
  static create(
    moduleId: string,
    title: string,
    description: string,
    difficulty: Difficulty,
    testCases: TestCase[],
    maxScore: number = 100,
    starterCode?: string,
    hints?: string[],
    timeLimit?: number
  ): Assignment {
    return new Assignment(
      '',
      moduleId,
      title,
      description,
      difficulty,
      testCases,
      maxScore,
      new Date(),
      new Date(),
      starterCode,
      hints,
      timeLimit
    );
  }

  /**
   * Update assignment details
   */
  update(data: {
    title?: string;
    description?: string;
    difficulty?: Difficulty;
    starterCode?: string;
    testCases?: TestCase[];
    hints?: string[];
    maxScore?: number;
    timeLimit?: number;
  }): void {
    if (data.title) this.title = data.title;
    if (data.description) this.description = data.description;
    if (data.difficulty) this.difficulty = data.difficulty;
    if (data.starterCode !== undefined) this.starterCode = data.starterCode;
    if (data.testCases) this.testCases = data.testCases;
    if (data.hints !== undefined) this.hints = data.hints;
    if (data.maxScore !== undefined) this.maxScore = data.maxScore;
    if (data.timeLimit !== undefined) this.timeLimit = data.timeLimit;
    this.updatedAt = new Date();
  }

  /**
   * Add a test case
   */
  addTestCase(testCase: TestCase): void {
    this.testCases.push(testCase);
    this.updatedAt = new Date();
  }

  /**
   * Add a hint
   */
  addHint(hint: string): void {
    if (!this.hints) this.hints = [];
    this.hints.push(hint);
    this.updatedAt = new Date();
  }

  /**
   * Check if assignment has time limit
   */
  hasTimeLimit(): boolean {
    return this.timeLimit !== undefined && this.timeLimit > 0;
  }

  clone(): Assignment {
    return new Assignment(
      this.id,
      this.moduleId,
      this.title,
      this.description,
      this.difficulty,
      [...this.testCases],
      this.maxScore,
      this.createdAt,
      this.updatedAt,
      this.starterCode,
      this.hints ? [...this.hints] : undefined,
      this.timeLimit
    );
  }
}
