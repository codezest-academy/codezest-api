import { Request, Response, NextFunction } from 'express';
import { MaterialService } from '../../application/services/material.service';
import {
  CreateMaterialDtoSchema,
  UpdateMaterialDtoSchema,
  MaterialQuerySchema,
  ReorderMaterialsDtoSchema,
} from '../../application/dtos/material.dto';
import { PaginationQuerySchema, IdParamSchema } from '../../application/dtos/common.dto';
import { asyncHandler } from '../../common/utils/async-handler';
import { sendSuccess } from '../../common/utils/response';
import { HTTP_STATUS } from '../../common/constants/http-status';

/**
 * Material Controller
 * Handles HTTP requests for material management
 */
export class MaterialController {
  private service: MaterialService;

  constructor() {
    this.service = new MaterialService();
  }

  /**
   * GET /api/v1/materials
   * Get all materials with pagination and filtering
   */
  getAll = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const query = MaterialQuerySchema.parse(req.query);
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
   * GET /api/v1/materials/:id
   * Get material by ID
   */
  getById = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = IdParamSchema.parse(req.params);

    const material = await this.service.getById(id);

    return sendSuccess(res, material);
  });

  /**
   * GET /api/v1/materials/module/:moduleId
   * Get materials by module ID
   */
  getByModuleId = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { moduleId } = req.params;

    const materials = await this.service.getByModuleId(moduleId);

    return sendSuccess(res, materials);
  });

  /**
   * POST /api/v1/materials
   * Create a new material
   */
  create = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const dto = CreateMaterialDtoSchema.parse(req.body);

    const material = await this.service.create(dto);

    return sendSuccess(res, material, HTTP_STATUS.CREATED);
  });

  /**
   * PUT /api/v1/materials/:id
   * Update a material
   */
  update = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = IdParamSchema.parse(req.params);
    const dto = UpdateMaterialDtoSchema.parse(req.body);

    const material = await this.service.update(id, dto);

    return sendSuccess(res, material);
  });

  /**
   * DELETE /api/v1/materials/:id
   * Delete a material
   */
  delete = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = IdParamSchema.parse(req.params);

    await this.service.delete(id);

    return res.status(HTTP_STATUS.NO_CONTENT).send();
  });

  /**
   * POST /api/v1/materials/module/:moduleId/reorder
   * Reorder materials for a module
   */
  reorder = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { moduleId } = req.params;
    const dto = ReorderMaterialsDtoSchema.parse(req.body);

    await this.service.reorder(moduleId, dto);

    return res.status(HTTP_STATUS.NO_CONTENT).send();
  });
}
