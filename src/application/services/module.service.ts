import { IModuleRepository } from '../../domain/repositories/module.repository';
import { ModuleRepositoryImpl } from '../../infrastructure/repositories/module.repository.impl';
import { ModuleMapper } from '../mappers/module.mapper';
import {
  CreateModuleDto,
  ModuleResponseDto,
  UpdateModuleDto,
  ModuleQuery,
  ReorderModulesDto,
} from '../dtos/module.dto';
import { PaginatedResponse, PaginationQuery, PaginationMeta } from '../dtos/common.dto';
import { NotFoundError } from '../../common/errors/not-found.error';
import { ValidationError } from '../../common/errors/validation.error';

/**
 * Module Service
 * Business logic for module management
 */
export class ModuleService {
  private repository: IModuleRepository;

  constructor(repository?: IModuleRepository) {
    this.repository = repository || new ModuleRepositoryImpl();
  }

  /**
   * Get all modules with pagination and filtering
   */
  async getAll(
    query: ModuleQuery,
    pagination: PaginationQuery
  ): Promise<PaginatedResponse<ModuleResponseDto>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    let modules;
    let total;

    if (query.languageId) {
      // Filter by language
      modules = await this.repository.findByLanguageIdOrdered(query.languageId);
      total = modules.length;
      modules = modules.slice(skip, skip + limit);
    } else if (query.search) {
      // Search by title (simple implementation)
      const all = await this.repository.findAll();
      modules = all.filter((m) => m.title.toLowerCase().includes(query.search!.toLowerCase()));
      total = modules.length;
      modules = modules.slice(skip, skip + limit);
    } else {
      modules = await this.repository.findAll({ skip, take: limit });
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
      data: ModuleMapper.toDtoArray(modules),
      pagination: paginationMeta,
    };
  }

  /**
   * Get module by ID
   */
  async getById(id: string): Promise<ModuleResponseDto> {
    const module = await this.repository.findById(id);

    if (!module) {
      throw new NotFoundError(`Module with ID ${id} not found`);
    }

    return ModuleMapper.toDto(module);
  }

  /**
   * Get module by language ID and slug
   */
  async getByLanguageAndSlug(languageId: string, slug: string): Promise<ModuleResponseDto> {
    const module = await this.repository.findByLanguageAndSlug(languageId, slug);

    if (!module) {
      throw new NotFoundError(`Module with slug ${slug} not found for language ${languageId}`);
    }

    return ModuleMapper.toDto(module);
  }

  /**
   * Get modules by language ID
   */
  async getByLanguageId(languageId: string): Promise<ModuleResponseDto[]> {
    const modules = await this.repository.findByLanguageIdOrdered(languageId);
    return ModuleMapper.toDtoArray(modules);
  }

  /**
   * Create a new module
   */
  async create(dto: CreateModuleDto): Promise<ModuleResponseDto> {
    // Check if slug already exists for this language
    const existing = await this.repository.findByLanguageAndSlug(dto.languageId, dto.slug);
    if (existing) {
      throw new ValidationError(`Module with slug ${dto.slug} already exists for this language`);
    }

    const module = ModuleMapper.fromCreateDto(dto);
    const created = await this.repository.create(module);

    return ModuleMapper.toDto(created);
  }

  /**
   * Update a module
   */
  async update(id: string, dto: UpdateModuleDto): Promise<ModuleResponseDto> {
    const module = await this.repository.findById(id);

    if (!module) {
      throw new NotFoundError(`Module with ID ${id} not found`);
    }

    ModuleMapper.applyUpdateDto(module, dto);
    const updated = await this.repository.update(id, module);

    return ModuleMapper.toDto(updated);
  }

  /**
   * Delete a module
   */
  async delete(id: string): Promise<void> {
    const exists = await this.repository.exists(id);

    if (!exists) {
      throw new NotFoundError(`Module with ID ${id} not found`);
    }

    await this.repository.delete(id);
  }

  /**
   * Reorder modules for a language
   */
  async reorder(languageId: string, dto: ReorderModulesDto): Promise<void> {
    // Validate that all modules belong to the language
    for (const item of dto.modules) {
      const module = await this.repository.findById(item.id);
      if (!module) {
        throw new NotFoundError(`Module with ID ${item.id} not found`);
      }
      if (module.languageId !== languageId) {
        throw new ValidationError(`Module ${item.id} does not belong to language ${languageId}`);
      }
    }

    await this.repository.reorderModules(languageId, dto.modules);
  }
}
