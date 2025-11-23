import { BaseEntity } from './base.entity';

export enum Difficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

/**
 * Programming Language Domain Entity
 */
export class ProgrammingLanguage extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  difficulty: Difficulty;
  isActive: boolean;

  constructor(
    id: string,
    name: string,
    slug: string,
    difficulty: Difficulty,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
    description?: string,
    icon?: string
  ) {
    super(id, createdAt, updatedAt);
    this.name = name;
    this.slug = slug;
    this.description = description;
    this.icon = icon;
    this.difficulty = difficulty;
    this.isActive = isActive;
  }

  /**
   * Create a new programming language
   */
  static create(
    name: string,
    slug: string,
    difficulty: Difficulty = Difficulty.BEGINNER,
    description?: string,
    icon?: string
  ): ProgrammingLanguage {
    return new ProgrammingLanguage(
      '', // ID will be set by repository
      name,
      slug,
      difficulty,
      true, // isActive defaults to true
      new Date(),
      new Date(),
      description,
      icon
    );
  }

  /**
   * Update language details
   */
  update(data: {
    name?: string;
    description?: string;
    icon?: string;
    difficulty?: Difficulty;
  }): void {
    if (data.name) this.name = data.name;
    if (data.description !== undefined) this.description = data.description;
    if (data.icon !== undefined) this.icon = data.icon;
    if (data.difficulty) this.difficulty = data.difficulty;
    this.updatedAt = new Date();
  }

  /**
   * Activate the language
   */
  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  /**
   * Deactivate the language
   */
  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  clone(): ProgrammingLanguage {
    return new ProgrammingLanguage(
      this.id,
      this.name,
      this.slug,
      this.difficulty,
      this.isActive,
      this.createdAt,
      this.updatedAt,
      this.description,
      this.icon
    );
  }
}
