import { PrismaClient } from '@codezest-academy/db';
import { IQuestionRepository } from '../../domain/repositories/question.repository';
import { Question, QuestionOption } from '../../domain/entities/question.entity';
import PrismaService from '../database/prisma.service';

/**
 * Question Repository Implementation using Prisma
 */
export class QuestionRepositoryImpl implements IQuestionRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = PrismaService.getInstance().client;
  }

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.mCQQuestion.findUnique({
      where: { id },
      include: {
        options: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return question ? this.toDomain(question) : null;
  }

  async findAll(options?: {
    skip?: number;
    take?: number;
    orderBy?: Record<string, 'asc' | 'desc'>;
  }): Promise<Question[]> {
    const questions = await this.prisma.mCQQuestion.findMany({
      skip: options?.skip,
      take: options?.take,
      orderBy: options?.orderBy,
      include: {
        options: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return questions.map((q: any) => this.toDomain(q));
  }

  async create(entity: Question): Promise<Question> {
    const created = await this.prisma.mCQQuestion.create({
      data: {
        quizId: entity.quizId,
        question: entity.question,
        explanation: entity.explanation,
        order: entity.order,
        points: entity.points,
        options: {
          create: entity.options.map((opt) => ({
            optionText: opt.optionText,
            isCorrect: opt.isCorrect,
            order: opt.order,
          })),
        },
      },
      include: {
        options: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return this.toDomain(created);
  }

  async update(id: string, entity: Partial<Question>): Promise<Question> {
    // If options are being updated, delete old ones and create new ones
    if (entity.options) {
      await this.prisma.mCQOption.deleteMany({
        where: { questionId: id },
      });
    }

    const updated = await this.prisma.mCQQuestion.update({
      where: { id },
      data: {
        question: entity.question,
        explanation: entity.explanation,
        order: entity.order,
        points: entity.points,
        ...(entity.options && {
          options: {
            create: entity.options.map((opt) => ({
              optionText: opt.optionText,
              isCorrect: opt.isCorrect,
              order: opt.order,
            })),
          },
        }),
      },
      include: {
        options: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    // Delete options first (cascade should handle this, but being explicit)
    await this.prisma.mCQOption.deleteMany({
      where: { questionId: id },
    });

    await this.prisma.mCQQuestion.delete({
      where: { id },
    });
  }

  async count(where?: Record<string, unknown>): Promise<number> {
    return this.prisma.mCQQuestion.count({ where });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.mCQQuestion.count({
      where: { id },
    });
    return count > 0;
  }

  async findByQuizId(quizId: string): Promise<Question[]> {
    const questions = await this.prisma.mCQQuestion.findMany({
      where: { quizId },
      include: {
        options: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return questions.map((q: any) => this.toDomain(q));
  }

  async findByQuizIdOrdered(quizId: string): Promise<Question[]> {
    const questions = await this.prisma.mCQQuestion.findMany({
      where: { quizId },
      include: {
        options: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });

    return questions.map((q: any) => this.toDomain(q));
  }

  async reorderQuestions(
    _quizId: string,
    questionOrders: { id: string; order: number }[]
  ): Promise<void> {
    await this.prisma.$transaction(
      questionOrders.map((item) =>
        this.prisma.mCQQuestion.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );
  }

  async findByIdWithOptions(id: string): Promise<Question | null> {
    return this.findById(id); // Already includes options
  }

  /**
   * Map Prisma model to domain entity
   */
  private toDomain(prismaQuestion: any): Question {
    const options: QuestionOption[] = prismaQuestion.options.map((opt: any) => ({
      id: opt.id,
      optionText: opt.optionText,
      isCorrect: opt.isCorrect,
      order: opt.order,
    }));

    return new Question(
      prismaQuestion.id,
      prismaQuestion.quizId,
      prismaQuestion.question,
      prismaQuestion.order,
      prismaQuestion.points,
      options,
      prismaQuestion.createdAt,
      prismaQuestion.updatedAt,
      prismaQuestion.explanation
    );
  }
}
