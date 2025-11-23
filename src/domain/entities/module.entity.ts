import { BaseEntity } from './base.entity';

/**
 * Module Domain Entity
 */
export class Module extends BaseEntity {
  languageId: string;
  title: string;
  slug: string;
  description?: string;
  syllabus?: string;
  order: number;

  constructor(
    id: string,
    languageId: string,
    title: string,
    slug: string,
    order: number,
    createdAt: Date,
    updatedAt: Date,
    description?: string,
    syllabus?: string
  ) {
    super(id, createdAt, updatedAt);
    this.languageId = languageId;
    this.title = title;
    this.slug = slug;
    this.description = description;
    this.syllabus = syllabus;
    this.order = order;
  }

  /**
   * Create a new module
   */
  static create(
    languageId: string,
    title: string,
    slug: string,
    order: number,
    description?: string,
    syllabus?: string
  ): Module {
    return new Module(
      '',
      languageId,
      title,
      slug,
      order,
      new Date(),
      new Date(),
      description,
      syllabus
    );
  }

  /**
   * Update module details
   */
  update(data: { title?: string; description?: string; syllabus?: string; order?: number }): void {
    if (data.title) this.title = data.title;
    if (data.description !== undefined) this.description = data.description;
    if (data.syllabus !== undefined) this.syllabus = data.syllabus;
    if (data.order !== undefined) this.order = data.order;
    this.updatedAt = new Date();
  }

  /**
   * Reorder module
   */
  reorder(newOrder: number): void {
    this.order = newOrder;
    this.updatedAt = new Date();
  }

  clone(): Module {
    return new Module(
      this.id,
      this.languageId,
      this.title,
      this.slug,
      this.order,
      this.createdAt,
      this.updatedAt,
      this.description,
      this.syllabus
    );
  }
}
