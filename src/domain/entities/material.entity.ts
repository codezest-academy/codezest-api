import { BaseEntity } from './base.entity';

export enum MaterialType {
  VIDEO = 'VIDEO',
  ARTICLE = 'ARTICLE',
  CODE_EXAMPLE = 'CODE_EXAMPLE',
  INTERACTIVE = 'INTERACTIVE',
}

/**
 * Material Domain Entity
 */
export class Material extends BaseEntity {
  moduleId: string;
  title: string;
  type: MaterialType;
  content: string;
  duration?: number; // in minutes
  order: number;

  constructor(
    id: string,
    moduleId: string,
    title: string,
    type: MaterialType,
    content: string,
    order: number,
    createdAt: Date,
    updatedAt: Date,
    duration?: number
  ) {
    super(id, createdAt, updatedAt);
    this.moduleId = moduleId;
    this.title = title;
    this.type = type;
    this.content = content;
    this.duration = duration;
    this.order = order;
  }

  /**
   * Create a new material
   */
  static create(
    moduleId: string,
    title: string,
    type: MaterialType,
    content: string,
    order: number,
    duration?: number
  ): Material {
    return new Material(
      '',
      moduleId,
      title,
      type,
      content,
      order,
      new Date(),
      new Date(),
      duration
    );
  }

  /**
   * Update material details
   */
  update(data: { title?: string; content?: string; duration?: number; order?: number }): void {
    if (data.title) this.title = data.title;
    if (data.content) this.content = data.content;
    if (data.duration !== undefined) this.duration = data.duration;
    if (data.order !== undefined) this.order = data.order;
    this.updatedAt = new Date();
  }

  /**
   * Check if material is a video
   */
  isVideo(): boolean {
    return this.type === MaterialType.VIDEO;
  }

  /**
   * Check if material is an article
   */
  isArticle(): boolean {
    return this.type === MaterialType.ARTICLE;
  }

  /**
   * Reorder material
   */
  reorder(newOrder: number): void {
    this.order = newOrder;
    this.updatedAt = new Date();
  }

  clone(): Material {
    return new Material(
      this.id,
      this.moduleId,
      this.title,
      this.type,
      this.content,
      this.order,
      this.createdAt,
      this.updatedAt,
      this.duration
    );
  }
}
