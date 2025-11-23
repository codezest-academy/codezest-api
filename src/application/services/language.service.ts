import { ILanguageRepository } from '../../domain/repositories/language.repository';
import { LanguageRepositoryImpl } from '../../infrastructure/repositories/language.repository.impl';
import { LanguageMapper } from '../mappers/language.mapper';
import {
  CreateLanguageDto,
  LanguageResponseDto,
  UpdateLanguageDto,
  LanguageQuery,
} from '../dtos/language.dto';
import { PaginatedResponse, PaginationQuery, PaginationMeta } from '../dtos/common.dto';
import { NotFoundError } from '../../common/errors/not-found.error';
import { ValidationError } from '../../common/errors/validation.error';

/**
 * Language Service
 * Business logic for language management
 */
export class LanguageService {
  private repository: ILanguageRepository;

  constructor(repository?: ILanguageRepository) {
    this.repository = repository || new LanguageRepositoryImpl();
  }

  /**
   * Get all languages with pagination and filtering
   */
  async getAll(
    query: LanguageQuery,
    pagination: PaginationQuery
  ): Promise<PaginatedResponse<LanguageResponseDto>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    let languages;
    let total;

    // Apply filters
    if (query.search) {
      languages = await this.repository.searchByName(query.search);
      total = languages.length;
      // Apply pagination manually for search
      languages = languages.slice(skip, skip + limit);
    } else if (query.difficulty) {
      languages = await this.repository.findByDifficulty(query.difficulty);
      total = languages.length;
      languages = languages.slice(skip, skip + limit);
    } else if (query.isActive !== undefined) {
      if (query.isActive) {
        languages = await this.repository.findAllActive();
      } else {
        const all = await this.repository.findAll();
        languages = all.filter((l) => !l.isActive);
      }
      total = languages.length;
      languages = languages.slice(skip, skip + limit);
    } else {
      languages = await this.repository.findAll({ skip, take: limit });
      total = await this.repository.count();
    }

    const paginationMeta: PaginationMeta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    };

    return {
      data: LanguageMapper.toDtoArray(languages),
      pagination: paginationMeta,
    };
  }

  /**
   * Get language by ID
   */
  async getById(id: string): Promise<LanguageResponseDto> {
    const language = await this.repository.findById(id);

    if (!language) {
      throw new NotFoundError(`Language with ID ${id} not found`);
    }

    return LanguageMapper.toDto(language);
  }

  /**
   * Get language by slug
   */
  async getBySlug(slug: string): Promise<LanguageResponseDto> {
    const language = await this.repository.findBySlug(slug);

    if (!language) {
      throw new NotFoundError(`Language with slug ${slug} not found`);
    }

    return LanguageMapper.toDto(language);
  }

  /**
   * Create a new language
   */
  async create(dto: CreateLanguageDto): Promise<LanguageResponseDto> {
    // Check if slug already exists
    const existing = await this.repository.findBySlug(dto.slug);
    if (existing) {
      throw new ValidationError(`Language with slug ${dto.slug} already exists`);
    }

    const language = LanguageMapper.fromCreateDto(dto);
    const created = await this.repository.create(language);

    return LanguageMapper.toDto(created);
  }

  /**
   * Update a language
   */
  async update(id: string, dto: UpdateLanguageDto): Promise<LanguageResponseDto> {
    const language = await this.repository.findById(id);

    if (!language) {
      throw new NotFoundError(`Language with ID ${id} not found`);
    }

    LanguageMapper.applyUpdateDto(language, dto);
    const updated = await this.repository.update(id, language);

    return LanguageMapper.toDto(updated);
  }

  /**
   * Delete a language
   */
  async delete(id: string): Promise<void> {
    const exists = await this.repository.exists(id);

    if (!exists) {
      throw new NotFoundError(`Language with ID ${id} not found`);
    }

    await this.repository.delete(id);
  }

  /**
   * Activate a language
   */
  async activate(id: string): Promise<LanguageResponseDto> {
    const language = await this.repository.findById(id);

    if (!language) {
      throw new NotFoundError(`Language with ID ${id} not found`);
    }

    language.activate();
    const updated = await this.repository.update(id, language);

    return LanguageMapper.toDto(updated);
  }

  /**
   * Deactivate a language
   */
  async deactivate(id: string): Promise<LanguageResponseDto> {
    const language = await this.repository.findById(id);

    if (!language) {
      throw new NotFoundError(`Language with ID ${id} not found`);
    }

    language.deactivate();
    const updated = await this.repository.update(id, language);

    return LanguageMapper.toDto(updated);
  }
}
