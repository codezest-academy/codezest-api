import { Module } from '../../domain/entities/module.entity';
import { CreateModuleDto, ModuleResponseDto, UpdateModuleDto } from '../dtos/module.dto';

/**
 * Module Mapper
 * Converts between domain entities and DTOs
 */
export class ModuleMapper {
  /**
   * Convert entity to response DTO
   */
  static toDto(entity: Module): ModuleResponseDto {
    return {
      id: entity.id,
      languageId: entity.languageId,
      title: entity.title,
      slug: entity.slug,
      description: entity.description,
      syllabus: entity.syllabus,
      order: entity.order,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  /**
   * Convert create DTO to entity
   */
  static fromCreateDto(dto: CreateModuleDto): Module {
    return Module.create(
      dto.languageId,
      dto.title,
      dto.slug,
      dto.order,
      dto.description,
      dto.syllabus
    );
  }

  /**
   * Convert array of entities to DTOs
   */
  static toDtoArray(entities: Module[]): ModuleResponseDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  /**
   * Apply update DTO to entity
   */
  static applyUpdateDto(entity: Module, dto: UpdateModuleDto): void {
    entity.update({
      title: dto.title,
      description: dto.description,
      syllabus: dto.syllabus,
      order: dto.order,
    });
  }
}
