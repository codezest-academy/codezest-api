import { PrismaClient } from '@codezest-academy/db';
import { IMaterialRepository } from '../../domain/repositories/material.repository';
import { Material, MaterialType } from '../../domain/entities/material.entity';
import PrismaService from '../database/prisma.service';

/**
 * Material Repository Implementation using Prisma
 */
export class MaterialRepositoryImpl implements IMaterialRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = PrismaService.getInstance().client;
  }

  async findById(id: string): Promise<Material | null> {
    const material = await this.prisma.material.findUnique({
      where: { id },
    });

    return material ? this.toDomain(material) : null;
  }

  async findAll(options?: {
    skip?: number;
    take?: number;
    orderBy?: Record<string, 'asc' | 'desc'>;
  }): Promise<Material[]> {
    const materials = await this.prisma.material.findMany({
      skip: options?.skip,
      take: options?.take,
      orderBy: options?.orderBy,
    });

    return materials.map((m: any) => this.toDomain(m));
  }

  async create(entity: Material): Promise<Material> {
    const created = await this.prisma.material.create({
      data: {
        moduleId: entity.moduleId,
        title: entity.title,
        type: entity.type,
        content: entity.content,
        duration: entity.duration,
        order: entity.order,
      },
    });

    return this.toDomain(created);
  }

  async update(id: string, entity: Partial<Material>): Promise<Material> {
    const updated = await this.prisma.material.update({
      where: { id },
      data: {
        title: entity.title,
        content: entity.content,
        duration: entity.duration,
        order: entity.order,
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.material.delete({
      where: { id },
    });
  }

  async count(where?: Record<string, unknown>): Promise<number> {
    return this.prisma.material.count({ where });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.material.count({
      where: { id },
    });
    return count > 0;
  }

  async findByModuleId(moduleId: string): Promise<Material[]> {
    const materials = await this.prisma.material.findMany({
      where: { moduleId },
    });

    return materials.map((m: any) => this.toDomain(m));
  }

  async findByModuleIdOrdered(moduleId: string): Promise<Material[]> {
    const materials = await this.prisma.material.findMany({
      where: { moduleId },
      orderBy: { order: 'asc' },
    });

    return materials.map((m: any) => this.toDomain(m));
  }

  async findByType(moduleId: string, type: string): Promise<Material[]> {
    const materials = await this.prisma.material.findMany({
      where: {
        moduleId,
        type: type as MaterialType,
      },
      orderBy: { order: 'asc' },
    });

    return materials.map((m: any) => this.toDomain(m));
  }

  async reorderMaterials(
    _moduleId: string,
    materialOrders: { id: string; order: number }[]
  ): Promise<void> {
    await this.prisma.$transaction(
      materialOrders.map((item) =>
        this.prisma.material.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );
  }

  /**
   * Map Prisma model to domain entity
   */
  private toDomain(prismaMaterial: any): Material {
    return new Material(
      prismaMaterial.id,
      prismaMaterial.moduleId,
      prismaMaterial.title,
      prismaMaterial.type as MaterialType,
      prismaMaterial.content,
      prismaMaterial.order,
      prismaMaterial.createdAt,
      prismaMaterial.updatedAt,
      prismaMaterial.duration
    );
  }
}
