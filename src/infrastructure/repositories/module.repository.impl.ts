import { PrismaClient } from '@codezest-academy/db';
import { IModuleRepository } from '../../domain/repositories/module.repository';
import { Module } from '../../domain/entities/module.entity';
import PrismaService from '../database/prisma.service';

/**
 * Module Repository Implementation using Prisma
 */
export class ModuleRepositoryImpl implements IModuleRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = PrismaService.getInstance().client;
  }

  async findById(id: string): Promise<Module | null> {
    const module = await this.prisma.module.findUnique({
      where: { id },
    });

    return module ? this.toDomain(module) : null;
  }

  async findAll(options?: {
    skip?: number;
    take?: number;
    orderBy?: Record<string, 'asc' | 'desc'>;
  }): Promise<Module[]> {
    const modules = await this.prisma.module.findMany({
      skip: options?.skip,
      take: options?.take,
      orderBy: options?.orderBy,
    });

    return modules.map((m: any) => this.toDomain(m));
  }

  async create(entity: Module): Promise<Module> {
    const created = await this.prisma.module.create({
      data: {
        languageId: entity.languageId,
        title: entity.title,
        slug: entity.slug,
        description: entity.description,
        syllabus: entity.syllabus,
        order: entity.order,
      },
    });

    return this.toDomain(created);
  }

  async update(id: string, entity: Partial<Module>): Promise<Module> {
    const updated = await this.prisma.module.update({
      where: { id },
      data: {
        title: entity.title,
        description: entity.description,
        syllabus: entity.syllabus,
        order: entity.order,
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.module.delete({
      where: { id },
    });
  }

  async count(where?: Record<string, unknown>): Promise<number> {
    return this.prisma.module.count({ where });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.module.count({
      where: { id },
    });
    return count > 0;
  }

  async findByLanguageId(languageId: string): Promise<Module[]> {
    const modules = await this.prisma.module.findMany({
      where: { languageId },
    });

    return modules.map((m: any) => this.toDomain(m));
  }

  async findByLanguageAndSlug(languageId: string, slug: string): Promise<Module | null> {
    const module = await this.prisma.module.findUnique({
      where: {
        languageId_slug: {
          languageId,
          slug,
        },
      },
    });

    return module ? this.toDomain(module) : null;
  }

  async findByLanguageIdOrdered(languageId: string): Promise<Module[]> {
    const modules = await this.prisma.module.findMany({
      where: { languageId },
      orderBy: { order: 'asc' },
    });

    return modules.map((m: any) => this.toDomain(m));
  }

  async reorderModules(
    _languageId: string,
    moduleOrders: { id: string; order: number }[]
  ): Promise<void> {
    // Use transaction to update all module orders atomically
    await this.prisma.$transaction(
      moduleOrders.map((item) =>
        this.prisma.module.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );
  }

  /**
   * Map Prisma model to domain entity
   */
  private toDomain(prismaModule: any): Module {
    return new Module(
      prismaModule.id,
      prismaModule.languageId,
      prismaModule.title,
      prismaModule.slug,
      prismaModule.order,
      prismaModule.createdAt,
      prismaModule.updatedAt,
      prismaModule.description,
      prismaModule.syllabus
    );
  }
}
