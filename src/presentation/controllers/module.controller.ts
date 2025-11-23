import { Request, Response, NextFunction } from 'express';
import { ModuleService } from '../../application/services/module.service';
import {
  CreateModuleDtoSchema,
  UpdateModuleDtoSchema,
  ModuleQuerySchema,
  ReorderModulesDtoSchema,
} from '../../application/dtos/module.dto';
import { PaginationQuerySchema, IdParamSchema } from '../../application/dtos/common.dto';
import { asyncHandler } from '../../common/utils/async-handler';
import { sendSuccess } from '../../common/utils/response';
import { HTTP_STATUS } from '../../common/constants/http-status';

/**
 * Module Controller
 * Handles HTTP requests for module management
 */
export class ModuleController {
  private service: ModuleService;

  constructor() {
    this.service = new ModuleService();
  }

  /**
   * GET /api/v1/modules
   * Get all modules with pagination and filtering
   */
  getAll = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const query = ModuleQuerySchema.parse(req.query);
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
   * GET /api/v1/modules/:id
   * Get module by ID
   */
  getById = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = IdParamSchema.parse(req.params);

    const module = await this.service.getById(id);

    return sendSuccess(res, module);
  });

  /**
   * GET /api/v1/modules/language/:languageId/slug/:slug
   * Get module by language ID and slug
   */
  getByLanguageAndSlug = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { languageId, slug } = req.params;

    const module = await this.service.getByLanguageAndSlug(languageId, slug);

    return sendSuccess(res, module);
  });

  /**
   * GET /api/v1/modules/language/:languageId
   * Get modules by language ID
   */
  getByLanguageId = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { languageId } = req.params;

    const modules = await this.service.getByLanguageId(languageId);

    return sendSuccess(res, modules);
  });

  /**
   * POST /api/v1/modules
   * Create a new module
   */
  create = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const dto = CreateModuleDtoSchema.parse(req.body);

    const module = await this.service.create(dto);

    return sendSuccess(res, module, HTTP_STATUS.CREATED);
  });

  /**
   * PUT /api/v1/modules/:id
   * Update a module
   */
  update = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = IdParamSchema.parse(req.params);
    const dto = UpdateModuleDtoSchema.parse(req.body);

    const module = await this.service.update(id, dto);

    return sendSuccess(res, module);
  });

  /**
   * DELETE /api/v1/modules/:id
   * Delete a module
   */
  delete = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = IdParamSchema.parse(req.params);

    await this.service.delete(id);

    return res.status(HTTP_STATUS.NO_CONTENT).send();
  });

  /**
   * POST /api/v1/modules/language/:languageId/reorder
   * Reorder modules for a language
   */
  reorder = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { languageId } = req.params;
    const dto = ReorderModulesDtoSchema.parse(req.body);

    await this.service.reorder(languageId, dto);

    return res.status(HTTP_STATUS.NO_CONTENT).send();
  });
}
