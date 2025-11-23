import { Material, MaterialType } from '../../domain/entities/material.entity';
import { CreateMaterialDto, MaterialResponseDto, UpdateMaterialDto } from '../dtos/material.dto';

/**
 * Material Mapper
 * Converts between domain entities and DTOs
 */
export class MaterialMapper {
  /**
   * Convert entity to response DTO
   */
  static toDto(entity: Material): MaterialResponseDto {
    return {
      id: entity.id,
      moduleId: entity.moduleId,
      title: entity.title,
      type: entity.type,
      content: entity.content,
      duration: entity.duration,
      order: entity.order,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  /**
   * Convert create DTO to entity
   */
  static fromCreateDto(dto: CreateMaterialDto): Material {
    return Material.create(
      dto.moduleId,
      dto.title,
      dto.type as MaterialType,
      dto.content,
      dto.order,
      dto.duration
    );
  }

  /**
   * Convert array of entities to DTOs
   */
  static toDtoArray(entities: Material[]): MaterialResponseDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  /**
   * Apply update DTO to entity
   */
  static applyUpdateDto(entity: Material, dto: UpdateMaterialDto): void {
    entity.update({
      title: dto.title,
      content: dto.content,
      duration: dto.duration,
      order: dto.order,
    });
    // Update type separately if provided
    if (dto.type) {
      entity.type = dto.type as MaterialType;
      entity.updatedAt = new Date();
    }
  }
}
