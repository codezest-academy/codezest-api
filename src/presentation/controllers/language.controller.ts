import { Request, Response, NextFunction } from 'express';
import { LanguageService } from '../../application/services/language.service';
import {
  CreateLanguageDtoSchema,
  UpdateLanguageDtoSchema,
  LanguageQuerySchema,
} from '../../application/dtos/language.dto';
import { PaginationQuerySchema, IdParamSchema } from '../../application/dtos/common.dto';
import { asyncHandler } from '../../common/utils/async-handler';
import { sendSuccess } from '../../common/utils/response';
import { HTTP_STATUS } from '../../common/constants/http-status';

/**
 * Language Controller
 * Handles HTTP requests for language management
 */
export class LanguageController {
  private service: LanguageService;

  constructor() {
    this.service = new LanguageService();
  }

  /**
   * GET /api/v1/languages
   * Get all languages with pagination and filtering
   */
  getAll = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const query = LanguageQuerySchema.parse(req.query);
    const pagination = PaginationQuerySchema.parse(req.query);

    const result = await this.service.getAll(query, pagination);

    return res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: result.data,
      pagination: result.pagination,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  });

  /**
   * GET /api/v1/languages/:id
   * Get language by ID
   */
  getById = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = IdParamSchema.parse(req.params);

    const language = await this.service.getById(id);

    return sendSuccess(res, language);
  });

  /**
   * GET /api/v1/languages/slug/:slug
   * Get language by slug
   */
  getBySlug = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { slug } = req.params;

    const language = await this.service.getBySlug(slug);

    return sendSuccess(res, language);
  });

  /**
   * POST /api/v1/languages
   * Create a new language
   */
  create = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const dto = CreateLanguageDtoSchema.parse(req.body);

    const language = await this.service.create(dto);

    return sendSuccess(res, language, HTTP_STATUS.CREATED);
  });

  /**
   * PUT /api/v1/languages/:id
   * Update a language
   */
  update = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = IdParamSchema.parse(req.params);
    const dto = UpdateLanguageDtoSchema.parse(req.body);

    const language = await this.service.update(id, dto);

    return sendSuccess(res, language);
  });

  /**
   * DELETE /api/v1/languages/:id
   * Delete a language
   */
  delete = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = IdParamSchema.parse(req.params);

    await this.service.delete(id);

    return res.status(HTTP_STATUS.NO_CONTENT).send();
  });

  /**
   * POST /api/v1/languages/:id/activate
   * Activate a language
   */
  activate = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = IdParamSchema.parse(req.params);

    const language = await this.service.activate(id);

    return sendSuccess(res, language);
  });

  /**
   * POST /api/v1/languages/:id/deactivate
   * Deactivate a language
   */
  deactivate = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = IdParamSchema.parse(req.params);

    const language = await this.service.deactivate(id);

    return sendSuccess(res, language);
  });
}
