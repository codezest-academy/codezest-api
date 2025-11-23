import { IMaterialRepository } from '../../domain/repositories/material.repository';
import { MaterialRepositoryImpl } from '../../infrastructure/repositories/material.repository.impl';
import { MaterialMapper } from '../mappers/material.mapper';
import {
  CreateMaterialDto,
  MaterialResponseDto,
  UpdateMaterialDto,
  MaterialQuery,
  ReorderMaterialsDto,
} from '../dtos/material.dto';
import { PaginatedResponse, PaginationQuery, PaginationMeta } from '../dtos/common.dto';
import { NotFoundError } from '../../common/errors/not-found.error';
import { ValidationError } from '../../common/errors/validation.error';

/**
 * Material Service
 * Business logic for material management
 */
export class MaterialService {
  private repository: IMaterialRepository;

  constructor(repository?: IMaterialRepository) {
    this.repository = repository || new MaterialRepositoryImpl();
  }

  /**
   * Get all materials with pagination and filtering
   */
  async getAll(
    query: MaterialQuery,
    pagination: PaginationQuery
  ): Promise<PaginatedResponse<MaterialResponseDto>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    let materials;
    let total;

    if (query.moduleId && query.type) {
      // Filter by module and type
      materials = await this.repository.findByType(query.moduleId, query.type);
      total = materials.length;
      materials = materials.slice(skip, skip + limit);
    } else if (query.moduleId) {
      // Filter by module
      materials = await this.repository.findByModuleIdOrdered(query.moduleId);
      total = materials.length;
      materials = materials.slice(skip, skip + limit);
    } else if (query.type) {
      // Filter by type (all modules)
      const all = await this.repository.findAll();
      materials = all.filter((m) => m.type === query.type);
      total = materials.length;
      materials = materials.slice(skip, skip + limit);
    } else {
      materials = await this.repository.findAll({ skip, take: limit });
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
      data: MaterialMapper.toDtoArray(materials),
      pagination: paginationMeta,
    };
  }

  /**
   * Get material by ID
   */
  async getById(id: string): Promise<MaterialResponseDto> {
    const material = await this.repository.findById(id);

    if (!material) {
      throw new NotFoundError(`Material with ID ${id} not found`);
    }

    return MaterialMapper.toDto(material);
  }

  /**
   * Get materials by module ID
   */
  async getByModuleId(moduleId: string): Promise<MaterialResponseDto[]> {
    const materials = await this.repository.findByModuleIdOrdered(moduleId);
    return MaterialMapper.toDtoArray(materials);
  }

  /**
   * Create a new material
   */
  async create(dto: CreateMaterialDto): Promise<MaterialResponseDto> {
    const material = MaterialMapper.fromCreateDto(dto);
    const created = await this.repository.create(material);

    return MaterialMapper.toDto(created);
  }

  /**
   * Update a material
   */
  async update(id: string, dto: UpdateMaterialDto): Promise<MaterialResponseDto> {
    const material = await this.repository.findById(id);

    if (!material) {
      throw new NotFoundError(`Material with ID ${id} not found`);
    }

    MaterialMapper.applyUpdateDto(material, dto);
    const updated = await this.repository.update(id, material);

    return MaterialMapper.toDto(updated);
  }

  /**
   * Delete a material
   */
  async delete(id: string): Promise<void> {
    const exists = await this.repository.exists(id);

    if (!exists) {
      throw new NotFoundError(`Material with ID ${id} not found`);
    }

    await this.repository.delete(id);
  }

  /**
   * Reorder materials for a module
   */
  async reorder(moduleId: string, dto: ReorderMaterialsDto): Promise<void> {
    // Validate that all materials belong to the module
    for (const item of dto.materials) {
      const material = await this.repository.findById(item.id);
      if (!material) {
        throw new NotFoundError(`Material with ID ${item.id} not found`);
      }
      if (material.moduleId !== moduleId) {
        throw new ValidationError(`Material ${item.id} does not belong to module ${moduleId}`);
      }
    }

    await this.repository.reorderMaterials(moduleId, dto.materials);
  }
}
