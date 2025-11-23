import { ProgrammingLanguage, Difficulty } from '../../domain/entities/language.entity';
import { CreateLanguageDto, LanguageResponseDto, UpdateLanguageDto } from '../dtos/language.dto';

/**
 * Language Mapper
 * Converts between domain entities and DTOs
 */
export class LanguageMapper {
  /**
   * Convert entity to response DTO
   */
  static toDto(entity: ProgrammingLanguage): LanguageResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      icon: entity.icon,
      difficulty: entity.difficulty,
      isActive: entity.isActive,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  /**
   * Convert create DTO to entity
   */
  static fromCreateDto(dto: CreateLanguageDto): ProgrammingLanguage {
    return ProgrammingLanguage.create(
      dto.name,
      dto.slug,
      dto.difficulty as Difficulty,
      dto.description,
      dto.icon
    );
  }

  /**
   * Convert array of entities to DTOs
   */
  static toDtoArray(entities: ProgrammingLanguage[]): LanguageResponseDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  /**
   * Apply update DTO to entity
   */
  static applyUpdateDto(entity: ProgrammingLanguage, dto: UpdateLanguageDto): void {
    entity.update({
      name: dto.name,
      description: dto.description,
      icon: dto.icon,
      difficulty: dto.difficulty as Difficulty | undefined,
    });
  }
}
