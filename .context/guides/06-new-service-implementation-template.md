# New Service Implementation Template

**Purpose**: Step-by-step template for implementing a new microservice with proper authentication and security  
**Last Updated**: 2025-11-27  
**Use Case**: Creating new resource servers (e.g., `codezest-learning`, `codezest-analytics`)

---

## 🎯 Service Type Selection

This template is for **Resource Servers** (business functionality services).

> For Identity Provider implementation, see [session-management-backend.md](../project-wide/session-management-backend.md)

---

## 📋 Phase 1: Project Setup

### 1.1 Initialize Project

```bash
mkdir codezest-<service-name>
cd codezest-<service-name>
npm init -y
npx tsc --init
```

### 1.2 Install Dependencies

```bash
# Core dependencies
npm install express cors helmet cookie-parser
npm install jsonwebtoken bcrypt zod
npm install express-rate-limit
npm install @prisma/client

# Development dependencies
npm install -D typescript @types/node @types/express
npm install -D @types/cors @types/cookie-parser
npm install -D @types/jsonwebtoken @types/bcrypt
npm install -D ts-node nodemon eslint prettier
npm install -D jest @types/jest ts-jest supertest @types/supertest
npm install -D prisma
```

### 1.3 Create Directory Structure

```bash
mkdir -p src/{config,domain,application,infrastructure,presentation}
mkdir -p src/domain/{entities,repositories}
mkdir -p src/application/{services,dtos}
mkdir -p src/infrastructure/{database,repositories}
mkdir -p src/presentation/{controllers,routes,middleware}
mkdir -p tests/{unit,integration}
```

### 1.4 Setup Environment Variables

```bash
# .env.example
NODE_ENV=development
PORT=3000
JWT_ACCESS_SECRET=your-super-secret-access-key-change-this
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/codezest_<service>
REDIS_URL=redis://localhost:6379
```

---

## 📋 Phase 2: Core Configuration

### 2.1 JWT Configuration

```typescript
// src/config/jwt.config.ts
export const jwtConfig = {
  accessToken: {
    secret: process.env.JWT_ACCESS_SECRET!,
    issuer: 'codezest-auth',
    audience: 'codezest-api',
  },
};

if (!jwtConfig.accessToken.secret) {
  throw new Error('JWT_ACCESS_SECRET must be defined');
}
```

### 2.2 CORS Configuration

```typescript
// src/config/cors.config.ts
import { CorsOptions } from 'cors';

export const corsConfig: CorsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
};
```

### 2.3 Rate Limit Configuration

```typescript
// src/config/rate-limit.config.ts
import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests, please try again later.',
});

export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
});
```

---

## 📋 Phase 3: Authentication Middleware

### 3.1 Auth Middleware

```typescript
// src/presentation/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../../config/jwt.config';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No access token provided' });
      return;
    }

    const token = authHeader.substring(7);

    const payload = jwt.verify(token, jwtConfig.accessToken.secret, {
      issuer: jwtConfig.accessToken.issuer,
      audience: jwtConfig.accessToken.audience,
    }) as TokenPayload;

    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token expired' });
      return;
    }
    res.status(401).json({ error: 'Invalid token' });
  }
}
```

### 3.2 Authorization Middleware

```typescript
// src/presentation/middleware/authorize.middleware.ts
import { Request, Response, NextFunction } from 'express';

export function authorize(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Insufficient permissions',
        required: allowedRoles,
        current: req.user.role,
      });
      return;
    }

    next();
  };
}
```

---

## 📋 Phase 4: Application Setup

### 4.1 Express App Configuration

```typescript
// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { corsConfig } from './config/cors.config';
import { globalLimiter } from './config/rate-limit.config';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors(corsConfig));
app.use(globalLimiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'codezest-<service-name>' });
});

// Routes
// app.use('/api/examples', exampleRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

export default app;
```

### 4.2 Package.json Scripts

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

## 📋 Phase 5: Example Implementation

### 5.1 Example DTO with Validation

```typescript
// src/application/dtos/example.dto.ts
import { z } from 'zod';

export const createExampleSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const updateExampleSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type CreateExampleDto = z.infer<typeof createExampleSchema>;
export type UpdateExampleDto = z.infer<typeof updateExampleSchema>;
```

### 5.2 Example Controller

```typescript
// src/presentation/controllers/example.controller.ts
import { Request, Response } from 'express';
import { createExampleSchema, updateExampleSchema } from '../../application/dtos/example.dto';
import { ZodError } from 'zod';

export class ExampleController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      res.json({ examples: [] });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch examples' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = createExampleSchema.parse(req.body);
      const userId = req.user!.userId;

      res.status(201).json({
        example: { ...data, userId },
        message: 'Example created successfully',
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.errors,
        });
        return;
      }
      res.status(500).json({ error: 'Failed to create example' });
    }
  }
}

export const exampleController = new ExampleController();
```

### 5.3 Example Routes

```typescript
// src/presentation/routes/example.routes.ts
import { Router } from 'express';
import { exampleController } from '../controllers/example.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';
import { strictLimiter } from '../../config/rate-limit.config';

const router = Router();

// Public routes
router.get('/', exampleController.getAll.bind(exampleController));

// Protected routes
router.post(
  '/',
  authenticate,
  authorize('INSTRUCTOR', 'ADMIN'),
  strictLimiter,
  exampleController.create.bind(exampleController)
);

export default router;
```

---

## 📋 Phase 6: Testing

### 6.1 Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
    },
  },
};
```

### 6.2 Unit Test Example

```typescript
// tests/unit/middleware/auth.middleware.test.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate } from '../../../src/presentation/middleware/auth.middleware';
import { jwtConfig } from '../../../src/config/jwt.config';

describe('Auth Middleware', () => {
  it('should authenticate valid token', () => {
    const payload = {
      userId: '123',
      email: 'test@example.com',
      role: 'USER',
    };

    const token = jwt.sign(payload, jwtConfig.accessToken.secret, {
      issuer: jwtConfig.accessToken.issuer,
      audience: jwtConfig.accessToken.audience,
      expiresIn: '15m',
    });

    const mockRequest = {
      headers: { authorization: `Bearer ${token}` },
    } as Partial<Request>;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    const nextFunction = jest.fn();

    authenticate(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.user).toEqual(expect.objectContaining(payload));
  });
});
```

---

## ✅ Final Checklist

### Configuration

- [ ] All environment variables documented
- [ ] JWT secret matches `codezest-auth`
- [ ] CORS configured with frontend URL
- [ ] Rate limiting configured

### Security

- [ ] `helmet()` middleware active
- [ ] `cors()` configured with `credentials: true`
- [ ] `authenticate` middleware implemented
- [ ] `authorize` middleware implemented
- [ ] All inputs validated with Zod

### Testing

- [ ] Unit tests for middleware
- [ ] Integration tests for endpoints
- [ ] Test coverage > 70%
- [ ] All tests passing

### Documentation

- [ ] README.md created
- [ ] API endpoints documented
- [ ] Setup instructions clear

---

## 🚀 Next Steps

1. Implement Prisma schema and migrations
2. Implement domain entities and services
3. Connect to RabbitMQ/Redis for events
4. Add logging and metrics
5. Deploy to staging environment

---

**Last Updated**: 2025-11-27  
**Template Version**: 1.0
