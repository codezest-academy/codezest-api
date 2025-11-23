import { OpenAPIV3 } from 'openapi-types';

/**
 * OpenAPI 3.0 Specification for CodeZest API
 */
export const swaggerSpec: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'CodeZest API',
    version: '1.0.0',
    description:
      'Learning platform API for programming courses, modules, materials, assignments, and quizzes',
    contact: {
      name: 'CodeZest Academy',
      email: 'api@codezest.academy',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:{port}/api/v1',
      description: 'Development server',
      variables: {
        port: {
          default: '3000',
        },
      },
    },
    {
      url: 'https://api.codezest.academy/api/v1',
      description: 'Production server',
    },
  ],
  tags: [
    {
      name: 'Languages',
      description: 'Programming languages management',
    },
    {
      name: 'Modules',
      description: 'Course modules (coming soon)',
    },
    {
      name: 'Materials',
      description: 'Learning materials (coming soon)',
    },
  ],
  paths: {
    '/languages': {
      get: {
        tags: ['Languages'],
        summary: 'List all programming languages',
        description: 'Get paginated list of languages with optional filtering',
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Page number',
            schema: { type: 'integer', minimum: 1, default: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Items per page',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          },
          {
            name: 'difficulty',
            in: 'query',
            description: 'Filter by difficulty level',
            schema: { type: 'string', enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] },
          },
          {
            name: 'search',
            in: 'query',
            description: 'Search by language name',
            schema: { type: 'string' },
          },
          {
            name: 'isActive',
            in: 'query',
            description: 'Filter by active status',
            schema: { type: 'boolean' },
          },
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedLanguageResponse' },
              },
            },
          },
          '400': {
            description: 'Invalid query parameters',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Languages'],
        summary: 'Create a new programming language',
        description: 'Create a new language (requires ADMIN or INSTRUCTOR role)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateLanguageRequest' },
              example: {
                name: 'Python',
                slug: 'python',
                description: 'A versatile programming language',
                difficulty: 'BEGINNER',
                icon: '🐍',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Language created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '409': {
            description: 'Language with slug already exists',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/languages/{id}': {
      get: {
        tags: ['Languages'],
        summary: 'Get language by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Language ID (UUID)',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Languages'],
        summary: 'Update a language',
        description: 'Update language details (requires ADMIN or INSTRUCTOR role)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateLanguageRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Language updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Languages'],
        summary: 'Delete a language',
        description: 'Delete a language (requires ADMIN role)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '204': { description: 'Language deleted successfully' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/languages/slug/{slug}': {
      get: {
        tags: ['Languages'],
        summary: 'Get language by slug',
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            description: 'Language slug (e.g., python, javascript)',
            schema: { type: 'string', pattern: '^[a-z0-9-]+$' },
          },
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/languages/{id}/activate': {
      post: {
        tags: ['Languages'],
        summary: 'Activate a language',
        description: 'Make language visible (requires ADMIN or INSTRUCTOR role)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Language activated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/languages/{id}/deactivate': {
      post: {
        tags: ['Languages'],
        summary: 'Deactivate a language',
        description: 'Hide language from public view (requires ADMIN or INSTRUCTOR role)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Language deactivated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token from authentication endpoint',
      },
    },
    schemas: {
      LanguageResponse: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          slug: { type: 'string' },
          description: { type: 'string', nullable: true },
          icon: { type: 'string', nullable: true },
          difficulty: { type: 'string', enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] },
          isActive: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateLanguageRequest: {
        type: 'object',
        required: ['name', 'slug', 'difficulty'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          slug: { type: 'string', pattern: '^[a-z0-9-]+$', minLength: 1, maxLength: 100 },
          description: { type: 'string', maxLength: 500 },
          icon: { type: 'string', format: 'uri' },
          difficulty: {
            type: 'string',
            enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
            default: 'BEGINNER',
          },
        },
      },
      UpdateLanguageRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          description: { type: 'string', maxLength: 500 },
          icon: { type: 'string', format: 'uri' },
          difficulty: { type: 'string', enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] },
        },
      },
      PaginationMeta: {
        type: 'object',
        properties: {
          page: { type: 'integer' },
          limit: { type: 'integer' },
          total: { type: 'integer' },
          totalPages: { type: 'integer' },
          hasNext: { type: 'boolean' },
          hasPrev: { type: 'boolean' },
        },
      },
      PaginatedLanguageResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['success'] },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/LanguageResponse' },
          },
          pagination: { $ref: '#/components/schemas/PaginationMeta' },
          meta: {
            type: 'object',
            properties: {
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['success'] },
          data: { $ref: '#/components/schemas/LanguageResponse' },
          meta: {
            type: 'object',
            properties: {
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['error'] },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string' },
              message: { type: 'string' },
              details: { type: 'object' },
            },
          },
          meta: {
            type: 'object',
            properties: {
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
    responses: {
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: {
              status: 'error',
              error: {
                code: 'NOT_FOUND',
                message: 'Language not found',
              },
              meta: {
                timestamp: '2025-11-22T11:15:00.000Z',
              },
            },
          },
        },
      },
      ValidationError: {
        description: 'Validation error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      Unauthorized: {
        description: 'Unauthorized - JWT token missing or invalid',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      Forbidden: {
        description: 'Forbidden - Insufficient permissions',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
    },
  },
};
