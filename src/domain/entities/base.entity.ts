/**
 * Base Entity Class
 * All domain entities extend this class
 */
export abstract class BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(id: string, createdAt: Date, updatedAt: Date) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Check if entity is new (not persisted yet)
   */
  isNew(): boolean {
    return !this.id || this.id === '';
  }

  /**
   * Check if two entities are equal based on ID
   */
  equals(other: BaseEntity): boolean {
    if (!other) return false;
    return this.id === other.id;
  }

  /**
   * Clone the entity
   */
  abstract clone(): BaseEntity;
}
