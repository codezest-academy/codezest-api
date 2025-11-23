import { PrismaClient } from '@codezest-academy/db';
import { IQuizRepository } from '../../domain/repositories/quiz.repository';
import { Quiz } from '../../domain/entities/quiz.entity';
import PrismaService from '../database/prisma.service';

/**
 * Quiz Repository Implementation using Prisma
 */
export class QuizRepositoryImpl implements IQuizRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = PrismaService.getInstance().client;
  }

  async findById(id: string): Promise<Quiz | null> {
    const quiz = await this.prisma.mCQQuiz.findUnique({
      where: { id },
    });

    return quiz ? this.toDomain(quiz) : null;
  }

  async findAll(options?: {
    skip?: number;
    take?: number;
    orderBy?: Record<string, 'asc' | 'desc'>;
  }): Promise<Quiz[]> {
    const quizzes = await this.prisma.mCQQuiz.findMany({
      skip: options?.skip,
      take: options?.take,
      orderBy: options?.orderBy,
    });

    return quizzes.map((q: any) => this.toDomain(q));
  }

  async create(entity: Quiz): Promise<Quiz> {
    const created = await this.prisma.mCQQuiz.create({
      data: {
        moduleId: entity.moduleId,
        title: entity.title,
        description: entity.description,
        passingScore: entity.passingScore,
        timeLimit: entity.timeLimit,
      },
    });

    return this.toDomain(created);
  }

  async update(id: string, entity: Partial<Quiz>): Promise<Quiz> {
    const updated = await this.prisma.mCQQuiz.update({
      where: { id },
      data: {
        title: entity.title,
        description: entity.description,
        passingScore: entity.passingScore,
        timeLimit: entity.timeLimit,
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.mCQQuiz.delete({
      where: { id },
    });
  }

  async count(where?: Record<string, unknown>): Promise<number> {
    return this.prisma.mCQQuiz.count({ where });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.mCQQuiz.count({
      where: { id },
    });
    return count > 0;
  }

  async findByModuleId(moduleId: string): Promise<Quiz[]> {
    const quizzes = await this.prisma.mCQQuiz.findMany({
      where: { moduleId },
      orderBy: { createdAt: 'desc' },
    });

    return quizzes.map((q: any) => this.toDomain(q));
  }

  async findByIdWithQuestions(id: string): Promise<Quiz | null> {
    const quiz = await this.prisma.mCQQuiz.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            options: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    return quiz ? this.toDomain(quiz) : null;
  }

  async findByLanguageId(languageId: string): Promise<Quiz[]> {
    const quizzes = await this.prisma.mCQQuiz.findMany({
      where: {
        module: {
          languageId,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return quizzes.map((q: any) => this.toDomain(q));
  }

  /**
   * Map Prisma model to domain entity
   */
  private toDomain(prismaQuiz: any): Quiz {
    return new Quiz(
      prismaQuiz.id,
      prismaQuiz.moduleId,
      prismaQuiz.title,
      prismaQuiz.passingScore,
      prismaQuiz.createdAt,
      prismaQuiz.updatedAt,
      prismaQuiz.description,
      prismaQuiz.timeLimit
    );
  }
}
