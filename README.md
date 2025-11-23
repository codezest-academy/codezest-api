# CodeZest API - Learning Service

A production-ready microservice for managing programming languages, modules, learning materials, assignments, and quizzes for the CodeZest learning platform.

## 🎯 Features

- **Programming Languages Management** - CRUD operations for languages (Python, JavaScript, Java, etc.)
- **Module Management** - Organize learning content into structured modules
- **Learning Materials** - Support for videos, articles, code examples, and interactive content
- **Assignments** - Coding exercises with auto-grading and manual review
- **MCQ Quizzes** - Multiple choice assessments with automatic scoring
- **Progress Tracking** - Track user progress across languages and modules
- **AI Analysis** - AI-powered feedback on assignments and quiz performance

## 🏗️ Architecture

Built with **SOLID principles** and **design patterns**:

- **Layered Architecture** - Presentation → Application → Domain → Infrastructure
- **Repository Pattern** - Data access abstraction
- **Service Layer Pattern** - Business logic encapsulation
- **Factory Pattern** - Material type creation
- **Strategy Pattern** - Assignment grading algorithms
- **Singleton Pattern** - Database and cache connections
- **Observer Pattern** - Progress tracking events

## 🔧 Tech Stack

- **Runtime**: Node.js 20+ LTS
- **Language**: TypeScript 5+
- **Framework**: Express.js 4.x
- **Database**: PostgreSQL 15+ (via Prisma)
- **ORM**: Prisma 5+ (using `@codezest-academy/db`)
- **Cache**: Redis 7+
- **Queue**: BullMQ
- **Validation**: Zod
- **Logging**: Winston + Morgan
- **Testing**: Jest + Supertest
- **Documentation**: Swagger/OpenAPI

## 📋 Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- PostgreSQL >= 15
- Redis >= 7
- GitHub Personal Access Token (for `@codezest-academy/db` package)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd codezest-api
```

### 2. Install Dependencies

```bash
# Set GitHub token for private package
export GITHUB_TOKEN=your_github_personal_access_token

# Install dependencies
npm install
```

### 3. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 4. Database Setup

```bash
# Run migrations
npm run migrate:dev

# (Optional) Seed database
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## 🐳 Docker Setup

### Development with Docker Compose

```bash
# Start all services (PostgreSQL, Redis, API)
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

### Production Build

```bash
# Build production image
docker build -t codezest-api:latest .

# Run container
docker run -p 3001:3001 \
  -e DATABASE_URL=your_database_url \
  -e REDIS_HOST=your_redis_host \
  codezest-api:latest
```

## 📚 API Documentation

Once the server is running, access the Swagger documentation at:

```
http://localhost:3001/api/docs
```

### Health Check

```bash
curl http://localhost:3001/health
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run unit tests only
npm run test:unit

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

## 📝 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm test` | Run all tests with coverage |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run migrate:dev` | Run database migrations (dev) |
| `npm run migrate:deploy` | Run database migrations (prod) |
| `npm run db:seed` | Seed database with sample data |

## 📁 Project Structure

```
codezest-api/
├── src/
│   ├── config/              # Configuration files
│   ├── common/              # Shared utilities, errors, constants
│   ├── core/                # Domain layer (entities, interfaces)
│   ├── modules/             # Feature modules
│   ├── infrastructure/      # Database, cache, queue
│   ├── middleware/          # Express middleware
│   ├── validators/          # Zod validation schemas
│   ├── app.ts               # Express app setup
│   ├── server.ts            # HTTP server
│   └── index.ts             # Entry point
├── tests/                   # Test suite
├── docker/                  # Docker files
└── scripts/                 # Utility scripts
```

## 🔐 Environment Variables

See `.env.example` for all required environment variables.

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_REFRESH_SECRET` - JWT refresh token secret
- `GITHUB_TOKEN` - GitHub PAT for private packages

**Optional:**
- `REDIS_HOST` - Redis host (default: localhost)
- `REDIS_PORT` - Redis port (default: 6379)
- `PORT` - API port (default: 3001)
- `LOG_LEVEL` - Logging level (default: info)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT

## 👥 Authors

CodeZest Academy Team

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Status**: ✅ Phase 1 Complete - Infrastructure Setup  
**Next**: Phase 2 - Core Domain Layer Implementation
