# CodeZest API - Quick Start Guide

## 🚀 Running the Server

### Option 1: Using ts-node-dev (Default)

```bash
npm run dev
```

### Option 2: Using Nodemon (Recommended)

```bash
npm run dev:nodemon
```

**Nodemon benefits**:

- Cleaner console output
- Better file watching
- Configurable via `nodemon.json`

## 📍 Server Information

- **Port**: 8082 (configured in `.env`)
- **Health Check**: `http://localhost:8082/health`
- **API Base**: `http://localhost:8082/api/v1`
- **Swagger Docs**: `http://localhost:8082/api/docs`

## ⚠️ Redis Errors (Normal)

If you see Redis connection errors:

```
Redis error: ECONNREFUSED
```

**This is normal** if Redis isn't running. The API works fine without it.

**To fix** (optional):

```bash
# Start Redis
brew services start redis

# Or run directly
redis-server
```

## 🔧 Prisma Setup (One-Time)

After `npm install`, run:

```bash
# Generate Prisma client in db package
cd node_modules/@codezest-academy/db && npx prisma generate
cd ../../..

# Copy to root node_modules
cp -r node_modules/@codezest-academy/db/node_modules/.prisma node_modules/
```

## 🧪 Test the API

```bash
# Health check
curl http://localhost:8082/health

# List languages
curl http://localhost:8082/api/v1/languages

# Open Swagger UI
open http://localhost:8082/api/docs
```

## 📊 Available Endpoints

### Languages API (8 endpoints)

- `GET /api/v1/languages` - List all
- `GET /api/v1/languages/:id` - Get by ID
- `GET /api/v1/languages/slug/:slug` - Get by slug
- `POST /api/v1/languages` - Create 🔒
- `PUT /api/v1/languages/:id` - Update 🔒
- `DELETE /api/v1/languages/:id` - Delete 🔒
- `POST /api/v1/languages/:id/activate` - Activate 🔒
- `POST /api/v1/languages/:id/deactivate` - Deactivate 🔒

### Modules API (8 endpoints)

- `GET /api/v1/modules` - List all
- `GET /api/v1/modules/:id` - Get by ID
- `GET /api/v1/modules/language/:languageId` - Get by language
- `GET /api/v1/modules/language/:languageId/slug/:slug` - Get by language & slug
- `POST /api/v1/modules` - Create 🔒
- `PUT /api/v1/modules/:id` - Update 🔒
- `DELETE /api/v1/modules/:id` - Delete 🔒
- `POST /api/v1/modules/language/:languageId/reorder` - Reorder 🔒

### Materials API (7 endpoints)

- `GET /api/v1/materials` - List all
- `GET /api/v1/materials/:id` - Get by ID
- `GET /api/v1/materials/module/:moduleId` - Get by module
- `POST /api/v1/materials` - Create 🔒
- `PUT /api/v1/materials/:id` - Update 🔒
- `DELETE /api/v1/materials/:id` - Delete 🔒
- `POST /api/v1/materials/module/:moduleId/reorder` - Reorder 🔒

🔒 = Requires JWT authentication

## 🎯 Development Commands

```bash
npm run dev              # Start with ts-node-dev
npm run dev:nodemon      # Start with nodemon
npm run build            # Build for production
npm run start            # Run production build
npm run test             # Run tests with coverage
npm run lint             # Check code quality
npm run typecheck        # TypeScript validation
```

## ✅ Project Status

- **Files**: 61 TypeScript files
- **Code**: ~9,000+ lines
- **Endpoints**: 23 REST APIs
- **Build**: ✅ Passing
- **Tests**: 9/9 ✅ Passing

## 📚 Documentation

- **Swagger UI**: `http://localhost:8082/api/docs`
- **Project Summary**: `PROJECT_SUMMARY.md`
- **Progress**: `PROGRESS.md`
- **Architecture**: `.context/PHASE2_DOMAIN_LAYER.md`

---

**Happy Coding!** 🎉
