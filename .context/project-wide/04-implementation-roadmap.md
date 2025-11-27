# CodeZest API - Production-Ready Implementation Plan

A comprehensive plan to build the **Learning Service** microservice for the CodeZest platform using SOLID principles, design patterns, and industry best practices.

---

## 🎯 Project Overview

**Service Name**: `codezest-api` (Learning Service)  
**Purpose**: Manages programming languages, modules, learning materials, assignments, MCQ quizzes, and user progress tracking  
**Architecture**: Microservices with shared database package (`@codezest-academy/db`)  
**Tech Stack**: Node.js, TypeScript, Express.js, Prisma, PostgreSQL, Redis, Docker

---

## 📋 Scope & Responsibilities

### Core Features

1. **Programming Languages Management** - CRUD for languages (Python, JavaScript, Java)
2. **Module Management** - Organize learning content into modules
3. **Learning Materials** - Videos, articles, code examples, interactive content
4. **Assignments** - Coding exercises with test cases and auto-grading
5. **MCQ Quizzes** - Multiple choice assessments with scoring
6. **Progress Tracking** - Track user progress across languages, modules, and materials
7. **AI/Manual Analysis** - Feedback on assignments and quiz performance

### Database Models (15 models in `learning.*` namespace)

**Core Structure:**

- `ProgrammingLanguage`, `Module`, `Material`, `Assignment`, `MCQQuiz`, `MCQQuestion`, `MCQOption`

**User Progress:**

- `LanguageEnrollment`, `ModuleProgress`, `MaterialProgress`, `AssignmentSubmission`, `MCQAttempt`, `MCQAnswer`

**Analysis:**

- `AssignmentAnalysis`, `QuizAnalysis`

---

## 🏗️ Architecture & Design Patterns

### 1. **Layered Architecture** (Separation of Concerns)

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Controllers, Routes, Middleware)      │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Application Layer               │
│  (Services, Use Cases, DTOs)            │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Domain Layer                    │
│  (Business Logic, Entities, Validators) │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Infrastructure Layer            │
│  (Repositories, Database, Cache, Queue) │
└─────────────────────────────────────────┘
```

### 2. **SOLID Principles Application**

#### **S - Single Responsibility Principle**

- Each class/module has one reason to change
- Controllers handle HTTP requests only
- Services contain business logic
- Repositories handle data access

#### **O - Open/Closed Principle**

- Use interfaces for extensibility
- Strategy pattern for grading algorithms
- Factory pattern for creating different material types

#### **L - Liskov Substitution Principle**

- Interface-based design for repositories
- Abstract base classes for common functionality

#### **I - Interface Segregation Principle**

- Small, focused interfaces
- Separate read/write interfaces where appropriate

#### **D - Dependency Inversion Principle**

- Depend on abstractions, not concretions
- Dependency injection throughout
- IoC container for managing dependencies

### 3. **Design Patterns to Implement**

| Pattern                     | Use Case                         | Location              |
| --------------------------- | -------------------------------- | --------------------- |
| **Repository Pattern**      | Data access abstraction          | `src/repositories/`   |
| **Service Layer Pattern**   | Business logic encapsulation     | `src/services/`       |
| **Factory Pattern**         | Create different material types  | `src/factories/`      |
| **Strategy Pattern**        | Assignment grading algorithms    | `src/strategies/`     |
| **Decorator Pattern**       | Add caching, logging to services | `src/decorators/`     |
| **Observer Pattern**        | Progress tracking events         | `src/events/`         |
| **Chain of Responsibility** | Request validation pipeline      | `src/middleware/`     |
| **Singleton Pattern**       | Database connection, cache       | `src/infrastructure/` |
| **DTO Pattern**             | Data transfer objects            | `src/dtos/`           |
| **Specification Pattern**   | Complex query building           | `src/specifications/` |

---

## 📁 Project Structure

```
codezest-api/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # CI/CD pipeline
│       └── deploy.yml                # Deployment workflow
│
├── prisma/                           # (From @codezest-academy/db)
│   └── migrations/
│
├── src/
│   ├── index.ts                      # Application entry point
│   ├── app.ts                        # Express app setup
│   ├── server.ts                     # HTTP server
│   │
│   ├── config/                       # Configuration
│   │   ├── index.ts                  # Config aggregator
│   │   ├── database.config.ts        # Database configuration
│   │   ├── redis.config.ts           # Redis configuration
│   │   ├── swagger.config.ts         # Swagger/OpenAPI setup
│   │   └── logger.config.ts          # Winston logger setup
│   │
│   ├── common/                       # Shared utilities
│   │   ├── constants/
│   │   │   ├── error-codes.ts
│   │   │   └── http-status.ts
│   │   ├── errors/
│   │   │   ├── base.error.ts
│   │   │   ├── not-found.error.ts
│   │   │   ├── validation.error.ts
│   │   │   └── unauthorized.error.ts
│   │   ├── types/
│   │   │   ├── express.d.ts          # Express type extensions
│   │   │   └── common.types.ts
│   │   └── utils/
│   │       ├── logger.ts
│   │       ├── response.ts           # Standardized API responses
│   │       └── async-handler.ts      # Async error handling
│   │
│   ├── core/                         # Core domain layer
│   │   ├── entities/                 # Domain entities
│   │   │   ├── language.entity.ts
│   │   │   ├── module.entity.ts
│   │   │   ├── material.entity.ts
│   │   │   ├── assignment.entity.ts
│   │   │   └── quiz.entity.ts
│   │   ├── interfaces/               # Core interfaces
│   │   │   ├── repository.interface.ts
│   │   │   ├── service.interface.ts
│   │   │   └── grading.interface.ts
│   │   └── value-objects/            # Value objects
│   │       ├── difficulty.vo.ts
│   │       └── progress.vo.ts
│   │
│   ├── modules/                      # Feature modules
│   │   ├── languages/
│   │   │   ├── language.controller.ts
│   │   │   ├── language.service.ts
│   │   │   ├── language.repository.ts
│   │   │   ├── language.routes.ts
│   │   │   ├── language.validator.ts
│   │   │   └── dtos/
│   │   │       ├── create-language.dto.ts
│   │   │       └── update-language.dto.ts
│   │   │
│   │   ├── modules/
│   │   │   ├── module.controller.ts
│   │   │   ├── module.service.ts
│   │   │   ├── module.repository.ts
│   │   │   ├── module.routes.ts
│   │   │   └── dtos/
│   │   │
│   │   ├── materials/
│   │   │   ├── material.controller.ts
│   │   │   ├── material.service.ts
│   │   │   ├── material.repository.ts
│   │   │   ├── material.factory.ts   # Factory for different types
│   │   │   ├── material.routes.ts
│   │   │   └── dtos/
│   │   │
│   │   ├── assignments/
│   │   │   ├── assignment.controller.ts
│   │   │   ├── assignment.service.ts
│   │   │   ├── assignment.repository.ts
│   │   │   ├── assignment.routes.ts
│   │   │   ├── grading/              # Grading strategies
│   │   │   │   ├── grading.strategy.ts
│   │   │   │   ├── auto-grading.strategy.ts
│   │   │   │   └── manual-grading.strategy.ts
│   │   │   └── dtos/
│   │   │
│   │   ├── quizzes/
│   │   │   ├── quiz.controller.ts
│   │   │   ├── quiz.service.ts
│   │   │   ├── quiz.repository.ts
│   │   │   ├── quiz.routes.ts
│   │   │   └── dtos/
│   │   │
│   │   ├── progress/
│   │   │   ├── progress.controller.ts
│   │   │   ├── progress.service.ts
│   │   │   ├── progress.repository.ts
│   │   │   ├── progress.routes.ts
│   │   │   ├── progress.calculator.ts # Progress calculation logic
│   │   │   └── dtos/
│   │   │
│   │   ├── enrollments/
│   │   │   ├── enrollment.controller.ts
│   │   │   ├── enrollment.service.ts
│   │   │   ├── enrollment.repository.ts
│   │   │   └── enrollment.routes.ts
│   │   │
│   │   └── analysis/
│   │       ├── analysis.controller.ts
│   │       ├── analysis.service.ts
│   │       ├── analysis.repository.ts
│   │       ├── ai-analyzer.ts        # AI analysis integration
│   │       └── dtos/
│   │
│   ├── infrastructure/               # Infrastructure layer
│   │   ├── database/
│   │   │   ├── prisma.service.ts     # Prisma client wrapper
│   │   │   └── transaction.manager.ts
│   │   ├── cache/
│   │   │   ├── redis.service.ts
│   │   │   └── cache.decorator.ts    # Caching decorator
│   │   ├── queue/
│   │   │   ├── bull.service.ts       # Job queue (Bull/BullMQ)
│   │   │   └── processors/
│   │   │       ├── grading.processor.ts
│   │   │       └── analysis.processor.ts
│   │   └── events/
│   │       ├── event-emitter.ts
│   │       └── listeners/
│   │           ├── progress-updated.listener.ts
│   │           └── submission-graded.listener.ts
│   │
│   ├── middleware/                   # Express middleware
│   │   ├── auth.middleware.ts        # JWT verification
│   │   ├── error.middleware.ts       # Global error handler
│   │   ├── validation.middleware.ts  # Zod validation
│   │   ├── rate-limit.middleware.ts  # Rate limiting
│   │   ├── cors.middleware.ts
│   │   └── logging.middleware.ts     # Morgan + Winston
│   │
│   ├── validators/                   # Zod schemas
│   │   ├── language.validator.ts
│   │   ├── module.validator.ts
│   │   ├── assignment.validator.ts
│   │   └── common.validator.ts
│   │
│   └── routes/                       # Route aggregator
│       └── index.ts                  # All routes combined
│
├── tests/                            # Test suite
│   ├── unit/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── validators/
│   ├── integration/
│   │   └── api/
│   └── e2e/
│       └── workflows/
│
├── scripts/                          # Utility scripts
│   ├── seed.ts                       # Database seeding
│   └── migrate.ts                    # Migration runner
│
├── docker/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   └── docker-compose.yml
│
├── .env.example
├── .env.development
├── .env.production
├── .gitignore
├── .npmrc                            # GitHub Packages config
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── jest.config.js
├── .eslintrc.js
├── .prettierrc
├── README.md
├── ARCHITECTURE.md
└── API_DOCUMENTATION.md
```

---

## 🔧 Technology Stack

### Core

- **Runtime**: Node.js 20+ LTS
- **Language**: TypeScript 5+
- **Framework**: Express.js 4.x
- **Database**: PostgreSQL 15+ (via Prisma)
- **ORM**: Prisma 5+
- **Cache**: Redis 7+
- **Queue**: BullMQ (Redis-based)

### Development

- **Validation**: Zod
- **Logging**: Winston + Morgan
- **Testing**: Jest + Supertest
- **Documentation**: Swagger/OpenAPI (tsoa)
- **Code Quality**: ESLint + Prettier
- **Git Hooks**: Husky + lint-staged

### DevOps

- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: (Future: Prometheus + Grafana)

---

## 📦 Dependencies

### Production Dependencies

```json
{
  "@codezest-academy/db": "latest",
  "express": "^4.18.2",
  "zod": "^3.22.4",
  "winston": "^3.11.0",
  "morgan": "^1.10.0",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "redis": "^4.6.11",
  "bullmq": "^5.1.0",
  "cors": "^2.8.5",
  "helmet": "^7.1.0",
  "express-rate-limit": "^7.1.5",
  "dotenv": "^16.3.1",
  "tsoa": "^5.1.1",
  "swagger-ui-express": "^5.0.0"
}
```

### Development Dependencies

```json
{
  "typescript": "^5.3.3",
  "@types/node": "^20.10.5",
  "@types/express": "^4.17.21",
  "@types/jest": "^29.5.11",
  "jest": "^29.7.0",
  "ts-jest": "^29.1.1",
  "supertest": "^6.3.3",
  "eslint": "^8.56.0",
  "prettier": "^3.1.1",
  "husky": "^8.0.3",
  "lint-staged": "^15.2.0",
  "ts-node-dev": "^2.0.0"
}
```

---

## 🎯 Implementation Phases

### **Phase 1: Project Setup & Infrastructure** (Week 1)

#### 1.1 Initialize Project

- [ ] Create `package.json` with all dependencies
- [ ] Setup TypeScript configuration
- [ ] Configure ESLint + Prettier
- [ ] Setup Git hooks (Husky)
- [ ] Create `.env.example` with all required variables
- [ ] Setup `.npmrc` for GitHub Packages

#### 1.2 Core Infrastructure

- [ ] Database connection (`PrismaService`)
- [ ] Redis connection (`RedisService`)
- [ ] Logger setup (Winston + Morgan)
- [ ] Error handling middleware
- [ ] Response standardization utility
- [ ] Async handler wrapper

#### 1.3 Authentication Middleware

- [ ] JWT verification middleware
- [ ] User context injection
- [ ] Role-based access control (RBAC)

#### 1.4 Docker Setup

- [ ] Create `Dockerfile` for production
- [ ] Create `Dockerfile.dev` for development
- [ ] Setup `docker-compose.yml` (app, postgres, redis)

---

### **Phase 2: Core Domain Layer** (Week 1-2)

#### 2.1 Define Interfaces

- [ ] `IRepository<T>` - Base repository interface
- [ ] `IService<T>` - Base service interface
- [ ] `IGradingStrategy` - Grading strategy interface
- [ ] `IMaterialFactory` - Material factory interface

#### 2.2 Create Base Classes

- [ ] `BaseRepository<T>` - Common CRUD operations
- [ ] `BaseService<T>` - Common business logic
- [ ] `BaseError` - Custom error hierarchy

#### 2.3 Value Objects

- [ ] `Difficulty` value object
- [ ] `Progress` value object
- [ ] `Score` value object

---

### **Phase 3: Feature Modules - Part 1** (Week 2-3)

#### 3.1 Programming Languages Module

- [ ] `LanguageController` - HTTP handlers
- [ ] `LanguageService` - Business logic
- [ ] `LanguageRepository` - Data access
- [ ] DTOs (Create, Update, Response)
- [ ] Zod validators
- [ ] Routes setup
- [ ] Unit tests
- [ ] Integration tests

#### 3.2 Modules Module

- [ ] `ModuleController`
- [ ] `ModuleService`
- [ ] `ModuleRepository`
- [ ] DTOs and validators
- [ ] Routes
- [ ] Tests

#### 3.3 Materials Module

- [ ] `MaterialController`
- [ ] `MaterialService`
- [ ] `MaterialRepository`
- [ ] `MaterialFactory` (Factory Pattern)
  - Video material
  - Article material
  - Code example material
  - Interactive material
- [ ] DTOs and validators
- [ ] Routes
- [ ] Tests

---

### **Phase 4: Feature Modules - Part 2** (Week 3-4)

#### 4.1 Assignments Module

- [ ] `AssignmentController`
- [ ] `AssignmentService`
- [ ] `AssignmentRepository`
- [ ] Grading Strategies (Strategy Pattern)
  - `AutoGradingStrategy` - Run code against test cases
  - `ManualGradingStrategy` - Instructor grading
- [ ] DTOs and validators
- [ ] Routes
- [ ] Tests

#### 4.2 Quizzes Module

- [ ] `QuizController`
- [ ] `QuizService`
- [ ] `QuizRepository`
- [ ] `QuestionRepository`
- [ ] `OptionRepository`
- [ ] Auto-scoring logic
- [ ] DTOs and validators
- [ ] Routes
- [ ] Tests

---

### **Phase 5: Progress Tracking & Enrollments** (Week 4-5)

#### 5.1 Enrollment Module

- [ ] `EnrollmentController`
- [ ] `EnrollmentService`
- [ ] `EnrollmentRepository`
- [ ] Enrollment validation
- [ ] DTOs and validators
- [ ] Routes
- [ ] Tests

#### 5.2 Progress Module

- [ ] `ProgressController`
- [ ] `ProgressService`
- [ ] `ProgressRepository`
- [ ] `ProgressCalculator` - Calculate module/language progress
- [ ] Event listeners (Observer Pattern)
  - Material completed → Update progress
  - Assignment passed → Update progress
  - Quiz passed → Update progress
- [ ] DTOs and validators
- [ ] Routes
- [ ] Tests

---

### **Phase 6: Analysis & AI Integration** (Week 5-6)

#### 6.1 Analysis Module

- [ ] `AnalysisController`
- [ ] `AnalysisService`
- [ ] `AnalysisRepository`
- [ ] `AIAnalyzer` - Integration with AI (OpenAI/Claude)
  - Assignment code analysis
  - Quiz performance analysis
- [ ] DTOs and validators
- [ ] Routes
- [ ] Tests

#### 6.2 Background Jobs

- [ ] Setup BullMQ queues
- [ ] `GradingProcessor` - Process assignment grading
- [ ] `AnalysisProcessor` - Process AI analysis
- [ ] Job monitoring and retry logic

---

### **Phase 7: Caching & Performance** (Week 6)

#### 7.1 Redis Caching

- [ ] `CacheService` - Redis wrapper
- [ ] `@Cache()` decorator for methods
- [ ] Cache invalidation strategies
- [ ] Cache warming for frequently accessed data

#### 7.2 Performance Optimization

- [ ] Database query optimization
- [ ] Pagination implementation
- [ ] Response compression
- [ ] Rate limiting per endpoint

---

### **Phase 8: Documentation & Testing** (Week 7)

#### 8.1 API Documentation

- [ ] Setup Swagger/OpenAPI with tsoa
- [ ] Document all endpoints
- [ ] Add request/response examples
- [ ] Generate API documentation

#### 8.2 Comprehensive Testing

- [ ] Unit tests (80%+ coverage)
- [ ] Integration tests
- [ ] E2E tests for critical workflows
- [ ] Load testing (optional)

#### 8.3 Documentation

- [ ] `README.md` - Setup and usage
- [ ] `ARCHITECTURE.md` - System design
- [ ] `API_DOCUMENTATION.md` - API guide
- [ ] `CONTRIBUTING.md` - Contribution guidelines

---

### **Phase 9: CI/CD & Deployment** (Week 7-8)

#### 9.1 CI/CD Pipeline

- [ ] GitHub Actions workflow
  - Linting
  - Type checking
  - Unit tests
  - Integration tests
  - Build Docker image
  - Push to registry
- [ ] Deployment workflow
  - Deploy to staging
  - Deploy to production (manual approval)

#### 9.2 Production Readiness

- [ ] Environment-specific configurations
- [ ] Health check endpoints
- [ ] Graceful shutdown
- [ ] Database migration strategy
- [ ] Monitoring setup (logs, metrics)

---

## 🔐 Security Best Practices

1. **Authentication & Authorization**

   - JWT token verification on all protected routes
   - Role-based access control (RBAC)
   - Token refresh mechanism

2. **Input Validation**

   - Zod validation on all inputs
   - SQL injection prevention (Prisma ORM)
   - XSS protection (helmet)

3. **Rate Limiting**

   - Per-IP rate limiting
   - Per-user rate limiting
   - API key rate limiting (future)

4. **CORS**

   - Whitelist allowed origins
   - Credentials handling

5. **Environment Variables**
   - Never commit `.env` files
   - Use secrets management in production

---

## 📊 API Design Principles

### RESTful API Standards

```
GET    /api/v1/languages              # List all languages
GET    /api/v1/languages/:id          # Get language by ID
POST   /api/v1/languages              # Create language (ADMIN)
PUT    /api/v1/languages/:id          # Update language (ADMIN)
DELETE /api/v1/languages/:id          # Delete language (ADMIN)

GET    /api/v1/languages/:id/modules  # Get modules for language
POST   /api/v1/modules                # Create module (ADMIN)

GET    /api/v1/modules/:id/materials  # Get materials for module
POST   /api/v1/materials              # Create material (ADMIN)

GET    /api/v1/assignments/:id        # Get assignment
POST   /api/v1/assignments/:id/submit # Submit assignment
GET    /api/v1/submissions/:id        # Get submission details

GET    /api/v1/quizzes/:id            # Get quiz
POST   /api/v1/quizzes/:id/attempt    # Start quiz attempt
POST   /api/v1/attempts/:id/submit    # Submit quiz answers

GET    /api/v1/progress/languages/:id # Get language progress
GET    /api/v1/progress/modules/:id   # Get module progress

POST   /api/v1/enrollments            # Enroll in language
GET    /api/v1/enrollments            # Get user enrollments
```

### Response Format

```json
{
  "status": "success",
  "data": {
    "language": {
      "id": "uuid",
      "name": "Python",
      "slug": "python",
      "description": "...",
      "difficulty": "BEGINNER"
    }
  },
  "meta": {
    "timestamp": "2025-11-22T10:23:36Z",
    "version": "v1"
  }
}
```

### Error Response

```json
{
  "status": "error",
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Language not found",
    "details": {
      "languageId": "invalid-uuid"
    }
  },
  "meta": {
    "timestamp": "2025-11-22T10:23:36Z",
    "version": "v1"
  }
}
```

---

## 🧪 Testing Strategy

### Unit Tests

- Test individual functions/methods
- Mock external dependencies
- 80%+ code coverage

### Integration Tests

- Test API endpoints
- Use test database
- Test database interactions

### E2E Tests

- Test complete user workflows
- Test critical paths:
  - User enrolls in language
  - User completes module
  - User submits assignment
  - User takes quiz

---

## 📈 Monitoring & Observability

1. **Logging**

   - Structured logging (JSON format)
   - Log levels: ERROR, WARN, INFO, DEBUG
   - Request/response logging

2. **Metrics** (Future)

   - Request count, latency
   - Error rates
   - Database query performance

3. **Health Checks**
   - `/health` - Basic health check
   - `/health/db` - Database connectivity
   - `/health/redis` - Redis connectivity

---

## 🚀 Deployment Strategy

### Development

```bash
docker-compose up -d
npm run dev
```

### Staging

- Deploy on push to `develop` branch
- Run all tests
- Manual QA

### Production

- Deploy on push to `main` branch (with approval)
- Blue-green deployment
- Database migrations before deployment
- Rollback strategy

---

## ✅ Success Criteria

- [ ] All 15 database models implemented
- [ ] All CRUD operations working
- [ ] Authentication/authorization working
- [ ] Progress tracking accurate
- [ ] Assignment grading functional
- [ ] Quiz scoring working
- [ ] API documentation complete
- [ ] 80%+ test coverage
- [ ] CI/CD pipeline operational
- [ ] Docker deployment working
- [ ] Production-ready error handling
- [ ] Logging and monitoring setup

---

## 📚 Reference Documents

1. **plan-overview.md** - Complete database schema (30 models)
2. **api.md** - Auth service API reference
3. **consuming.md** - How to use `@codezest-academy/db`
4. **Conversation History** - Previous implementation context

---

## 🎯 Next Steps

1. **Review this plan** - Approve or request changes
2. **Setup project** - Initialize repository with structure
3. **Implement Phase 1** - Infrastructure and core setup
4. **Iterative development** - Build feature by feature
5. **Testing** - Continuous testing throughout
6. **Documentation** - Document as you build
7. **Deployment** - Deploy to staging/production

---

**Estimated Timeline**: 7-8 weeks for complete implementation  
**Team Size**: 1-2 developers  
**Complexity**: Medium-High (Production-ready microservice)

---

> **Note**: This plan follows industry best practices, SOLID principles, and proven design patterns to create a maintainable, scalable, and production-ready Learning Service microservice.