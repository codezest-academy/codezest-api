# Swagger API Documentation - Implementation Plan

## Overview

Implement comprehensive API documentation using **Swagger UI** and **OpenAPI 3.0** specification for the CodeZest API.

---

## Current State

### ✅ Already Available

- `swagger-ui-express` package installed
- `tsoa` package available
- Configuration in `config/index.ts`:
  ```typescript
  swagger: {
    enabled: process.env.SWAGGER_ENABLED === 'true',
    path: process.env.SWAGGER_PATH || '/api/docs',
  }
  ```

### ❌ Not Implemented

- OpenAPI specification file
- Swagger middleware in `app.ts`
- Route documentation
- Swagger UI endpoint

---

## Implementation Approach

We'll use **manual OpenAPI specification** (Option A) for faster implementation and full control.

### Why Manual Over TSOA?

| Aspect             | Manual OpenAPI            | TSOA                          |
| ------------------ | ------------------------- | ----------------------------- |
| **Setup Time**     | ~10 minutes               | ~20 minutes                   |
| **Flexibility**    | Full control              | Limited by decorators         |
| **Maintenance**    | Update spec manually      | Auto-generated                |
| **Learning Curve** | Lower                     | Higher                        |
| **Best For**       | Quick setup, full control | Large teams, strict contracts |

**Decision**: Manual OpenAPI for now, can migrate to TSOA later if needed.

---

## Implementation Steps

### 1. Create OpenAPI Specification

**File**: `src/config/swagger.config.ts`

Structure:

```yaml
openapi: 3.0.0
info:
  title: CodeZest API
  version: 1.0.0
  description: Learning platform API for programming courses
servers:
  - url: http://localhost:3000/api/v1
    description: Development server
paths:
  /languages:
    get: # List languages
    post: # Create language
  /languages/{id}:
    get: # Get language by ID
    put: # Update language
    delete: # Delete language
components:
  schemas:
    Language: # Language response schema
    CreateLanguage: # Create request schema
    Error: # Error response schema
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

### 2. Setup Swagger Middleware

**File**: `src/app.ts`

Add after existing middleware:

```typescript
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.config';

// Swagger documentation
if (config.swagger.enabled) {
  app.use(config.swagger.path, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
```

### 3. Document Languages API

Include all 8 endpoints:

- `GET /languages` - List with pagination
- `GET /languages/{id}` - Get by ID
- `GET /languages/slug/{slug}` - Get by slug
- `POST /languages` - Create (protected)
- `PUT /languages/{id}` - Update (protected)
- `DELETE /languages/{id}` - Delete (protected)
- `POST /languages/{id}/activate` - Activate (protected)
- `POST /languages/{id}/deactivate` - Deactivate (protected)

### 4. Add Environment Variable

**File**: `.env.example`

```bash
# Swagger Documentation
SWAGGER_ENABLED=true
SWAGGER_PATH=/api/docs
```

### 5. Update README

Add documentation section:

```markdown
## API Documentation

Swagger UI is available at: http://localhost:3000/api/docs

To enable/disable:

- Set `SWAGGER_ENABLED=true` in `.env`
- Access at the path defined in `SWAGGER_PATH`
```

---

## OpenAPI Specification Structure

### Components

#### Schemas

1. **LanguageResponse**

   ```yaml
   type: object
   properties:
     id: { type: string, format: uuid }
     name: { type: string }
     slug: { type: string }
     description: { type: string, nullable: true }
     icon: { type: string, nullable: true }
     difficulty: { type: string, enum: [BEGINNER, INTERMEDIATE, ADVANCED] }
     isActive: { type: boolean }
     createdAt: { type: string, format: date-time }
     updatedAt: { type: string, format: date-time }
   ```

2. **CreateLanguageRequest**

   ```yaml
   type: object
   required: [name, slug, difficulty]
   properties:
     name: { type: string, minLength: 1, maxLength: 100 }
     slug: { type: string, pattern: '^[a-z0-9-]+$' }
     description: { type: string, maxLength: 500 }
     icon: { type: string, format: uri }
     difficulty: { type: string, enum: [BEGINNER, INTERMEDIATE, ADVANCED] }
   ```

3. **UpdateLanguageRequest**

   ```yaml
   type: object
   properties:
     name: { type: string }
     description: { type: string }
     icon: { type: string }
     difficulty: { type: string, enum: [BEGINNER, INTERMEDIATE, ADVANCED] }
   ```

4. **PaginatedLanguageResponse**

   ```yaml
   type: object
   properties:
     status: { type: string, enum: [success] }
     data: { type: array, items: { $ref: '#/components/schemas/LanguageResponse' } }
     pagination:
       type: object
       properties:
         page: { type: integer }
         limit: { type: integer }
         total: { type: integer }
         totalPages: { type: integer }
         hasNext: { type: boolean }
         hasPrev: { type: boolean }
   ```

5. **ErrorResponse**
   ```yaml
   type: object
   properties:
     status: { type: string, enum: [error] }
     error:
       type: object
       properties:
         code: { type: string }
         message: { type: string }
         details: { type: object }
     meta:
       type: object
       properties:
         timestamp: { type: string, format: date-time }
   ```

#### Security Schemes

```yaml
bearerAuth:
  type: http
  scheme: bearer
  bearerFormat: JWT
  description: JWT token from /auth/login endpoint
```

---

## Example Endpoint Documentation

### GET /languages

```yaml
/languages:
  get:
    summary: List all programming languages
    description: Get paginated list of languages with optional filtering
    tags: [Languages]
    parameters:
      - name: page
        in: query
        schema: { type: integer, minimum: 1, default: 1 }
      - name: limit
        in: query
        schema: { type: integer, minimum: 1, maximum: 100, default: 10 }
      - name: difficulty
        in: query
        schema: { type: string, enum: [BEGINNER, INTERMEDIATE, ADVANCED] }
      - name: search
        in: query
        schema: { type: string }
      - name: isActive
        in: query
        schema: { type: boolean }
    responses:
      200:
        description: Successful response
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PaginatedLanguageResponse'
      400:
        description: Invalid query parameters
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ErrorResponse'
```

### POST /languages (Protected)

```yaml
/languages:
  post:
    summary: Create a new programming language
    description: Create a new language (requires ADMIN or INSTRUCTOR role)
    tags: [Languages]
    security:
      - bearerAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/CreateLanguageRequest'
          example:
            name: Python
            slug: python
            description: A versatile programming language
            difficulty: BEGINNER
            icon: 🐍
    responses:
      201:
        description: Language created successfully
        content:
          application/json:
            schema:
              type: object
              properties:
                status: { type: string, enum: [success] }
                data: { $ref: '#/components/schemas/LanguageResponse' }
      400:
        description: Validation error
      401:
        description: Unauthorized - JWT token missing or invalid
      403:
        description: Forbidden - Insufficient permissions
      409:
        description: Conflict - Language with slug already exists
```

---

## Swagger UI Features

### Enabled Features

- **Try it out** - Test endpoints directly from UI
- **Authentication** - Add JWT token for protected endpoints
- **Request/Response examples** - See sample data
- **Schema validation** - View request/response schemas
- **Download spec** - Export OpenAPI JSON/YAML

### Configuration Options

```typescript
const swaggerOptions = {
  explorer: true,
  swaggerOptions: {
    persistAuthorization: true, // Remember JWT token
    displayRequestDuration: true,
    filter: true, // Enable search
    syntaxHighlight: {
      activate: true,
      theme: 'monokai',
    },
  },
};
```

---

## Testing the Documentation

### 1. Start the Server

```bash
npm run dev
```

### 2. Access Swagger UI

```
http://localhost:3000/api/docs
```

### 3. Test Endpoints

**Public Endpoint** (no auth):

1. Expand `GET /languages`
2. Click "Try it out"
3. Set parameters (page=1, limit=10)
4. Click "Execute"
5. View response

**Protected Endpoint** (requires auth):

1. Click "Authorize" button (top right)
2. Enter JWT token: `Bearer <your-token>`
3. Click "Authorize"
4. Expand `POST /languages`
5. Click "Try it out"
6. Enter request body
7. Click "Execute"

---

## Future Enhancements

### Phase 1 (Current)

- ✅ Manual OpenAPI spec
- ✅ Languages API documented
- ✅ Swagger UI setup

### Phase 2 (Later)

- [ ] Document Modules API
- [ ] Document Materials API
- [ ] Document Assignments API
- [ ] Document Quizzes API

### Phase 3 (Optional)

- [ ] Migrate to TSOA for auto-generation
- [ ] Add request/response examples
- [ ] Add code samples in multiple languages
- [ ] Setup Swagger validator

---

## File Structure

```
src/
├── config/
│   ├── swagger.config.ts     # OpenAPI specification
│   └── index.ts              # Existing config (already has swagger settings)
├── app.ts                    # Add Swagger middleware here
└── presentation/
    └── routes/
        └── language.routes.ts # Already implemented
```

---

## Maintenance

### When Adding New Endpoints

1. **Update OpenAPI spec** in `swagger.config.ts`
2. **Add path definition** with parameters, request body, responses
3. **Reference schemas** from components
4. **Test in Swagger UI** to verify

### When Modifying DTOs

1. **Update schema** in components/schemas
2. **Verify references** in path definitions
3. **Test validation** in Swagger UI

---

## Summary

**Effort**: ~15 minutes  
**Files to Create**: 1 (`swagger.config.ts`)  
**Files to Modify**: 2 (`app.ts`, `.env.example`)  
**Result**: Fully functional API documentation at `/api/docs`

This provides immediate value with minimal overhead and can be enhanced incrementally as we add more feature modules.
