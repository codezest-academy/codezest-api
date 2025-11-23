import { PrismaClient } from '@codezest-academy/db';
import { ILanguageRepository } from '../../domain/repositories/language.repository';
import { ProgrammingLanguage, Difficulty } from '../../domain/entities/language.entity';
import PrismaService from '../database/prisma.service';

/**
 * Language Repository Implementation using Prisma
 */
export class LanguageRepositoryImpl implements ILanguageRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = PrismaService.getInstance().client;
  }

  async findById(id: string): Promise<ProgrammingLanguage | null> {
    const lang = await this.prisma.programmingLanguage.findUnique({
      where: { id },
    });

    return lang ? this.toDomain(lang) : null;
  }

  async findAll(options?: {
    skip?: number;
    take?: number;
    orderBy?: Record<string, 'asc' | 'desc'>;
  }): Promise<ProgrammingLanguage[]> {
    const languages = await this.prisma.programmingLanguage.findMany({
      skip: options?.skip,
      take: options?.take,
      orderBy: options?.orderBy,
    });

    return languages.map((lang: any) => this.toDomain(lang));
  }

  async create(entity: ProgrammingLanguage): Promise<ProgrammingLanguage> {
    const created = await this.prisma.programmingLanguage.create({
      data: {
        name: entity.name,
        slug: entity.slug,
        description: entity.description,
        icon: entity.icon,
        difficulty: entity.difficulty,
        isActive: entity.isActive,
      },
    });

    return this.toDomain(created);
  }

  async update(id: string, entity: Partial<ProgrammingLanguage>): Promise<ProgrammingLanguage> {
    const updated = await this.prisma.programmingLanguage.update({
      where: { id },
      data: {
        name: entity.name,
        description: entity.description,
        icon: entity.icon,
        difficulty: entity.difficulty,
        isActive: entity.isActive,
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.programmingLanguage.delete({
      where: { id },
    });
  }

  async count(where?: Record<string, unknown>): Promise<number> {
    return this.prisma.programmingLanguage.count({ where });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.programmingLanguage.count({
      where: { id },
    });
    return count > 0;
  }

  async findBySlug(slug: string): Promise<ProgrammingLanguage | null> {
    const lang = await this.prisma.programmingLanguage.findUnique({
      where: { slug },
    });

    return lang ? this.toDomain(lang) : null;
  }

  async findAllActive(): Promise<ProgrammingLanguage[]> {
    const languages = await this.prisma.programmingLanguage.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    return languages.map((lang: any) => this.toDomain(lang));
  }

  async findByDifficulty(difficulty: string): Promise<ProgrammingLanguage[]> {
    const languages = await this.prisma.programmingLanguage.findMany({
      where: { difficulty: difficulty as Difficulty },
      orderBy: { name: 'asc' },
    });

    return languages.map((lang: any) => this.toDomain(lang));
  }

  async searchByName(query: string): Promise<ProgrammingLanguage[]> {
    const languages = await this.prisma.programmingLanguage.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      orderBy: { name: 'asc' },
    });

    return languages.map((lang: any) => this.toDomain(lang));
  }

  /**
   * Map Prisma model to domain entity
   */
  private toDomain(prismaLang: any): ProgrammingLanguage {
    return new ProgrammingLanguage(
      prismaLang.id,
      prismaLang.name,
      prismaLang.slug,
      prismaLang.difficulty as Difficulty,
      prismaLang.isActive,
      prismaLang.createdAt,
      prismaLang.updatedAt,
      prismaLang.description,
      prismaLang.icon
    );
  }
}
