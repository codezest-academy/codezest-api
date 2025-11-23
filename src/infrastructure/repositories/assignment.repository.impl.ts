import { PrismaClient } from '@codezest-academy/db';
import { IAssignmentRepository } from '../../domain/repositories/assignment.repository';
import { Assignment, Difficulty } from '../../domain/entities/assignment.entity';
import PrismaService from '../database/prisma.service';

/**
 * Assignment Repository Implementation using Prisma
 */
export class AssignmentRepositoryImpl implements IAssignmentRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = PrismaService.getInstance().client;
  }

  async findById(id: string): Promise<Assignment | null> {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
    });

    return assignment ? this.toDomain(assignment) : null;
  }

  async findAll(options?: {
    skip?: number;
    take?: number;
    orderBy?: Record<string, 'asc' | 'desc'>;
  }): Promise<Assignment[]> {
    const assignments = await this.prisma.assignment.findMany({
      skip: options?.skip,
      take: options?.take,
      orderBy: options?.orderBy,
    });

    return assignments.map((a: any) => this.toDomain(a));
  }

  async create(entity: Assignment): Promise<Assignment> {
    const created = await this.prisma.assignment.create({
      data: {
        moduleId: entity.moduleId,
        title: entity.title,
        description: entity.description,
        difficulty: entity.difficulty,
        starterCode: entity.starterCode,
        testCases: JSON.stringify(entity.testCases),
        hints: entity.hints ? JSON.stringify(entity.hints) : null,
        maxScore: entity.maxScore,
        timeLimit: entity.timeLimit,
      },
    });

    return this.toDomain(created);
  }

  async update(id: string, entity: Partial<Assignment>): Promise<Assignment> {
    const updated = await this.prisma.assignment.update({
      where: { id },
      data: {
        title: entity.title,
        description: entity.description,
        difficulty: entity.difficulty,
        starterCode: entity.starterCode,
        testCases: entity.testCases ? JSON.stringify(entity.testCases) : undefined,
        hints: entity.hints ? JSON.stringify(entity.hints) : undefined,
        maxScore: entity.maxScore,
        timeLimit: entity.timeLimit,
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.assignment.delete({
      where: { id },
    });
  }

  async count(where?: Record<string, unknown>): Promise<number> {
    return this.prisma.assignment.count({ where });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.assignment.count({
      where: { id },
    });
    return count > 0;
  }

  async findByModuleId(moduleId: string): Promise<Assignment[]> {
    const assignments = await this.prisma.assignment.findMany({
      where: { moduleId },
      orderBy: { createdAt: 'desc' },
    });

    return assignments.map((a: any) => this.toDomain(a));
  }

  async findByDifficulty(moduleId: string, difficulty: string): Promise<Assignment[]> {
    const assignments = await this.prisma.assignment.findMany({
      where: {
        moduleId,
        difficulty: difficulty as Difficulty,
      },
      orderBy: { createdAt: 'desc' },
    });

    return assignments.map((a: any) => this.toDomain(a));
  }

  async findByLanguageId(languageId: string): Promise<Assignment[]> {
    const assignments = await this.prisma.assignment.findMany({
      where: {
        module: {
          languageId,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return assignments.map((a: any) => this.toDomain(a));
  }

  /**
   * Map Prisma model to domain entity
   */
  private toDomain(prismaAssignment: any): Assignment {
    return new Assignment(
      prismaAssignment.id,
      prismaAssignment.moduleId,
      prismaAssignment.title,
      prismaAssignment.description,
      prismaAssignment.difficulty as Difficulty,
      JSON.parse(prismaAssignment.testCases),
      prismaAssignment.maxScore,
      prismaAssignment.createdAt,
      prismaAssignment.updatedAt,
      prismaAssignment.starterCode,
      prismaAssignment.hints ? JSON.parse(prismaAssignment.hints) : undefined,
      prismaAssignment.timeLimit
    );
  }
}
