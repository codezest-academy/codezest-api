# 📚 CodeZest Context & Documentation

Welcome to the documentation hub for the `codezest-api` service and the broader CodeZest platform. This folder is organized to help you find information quickly based on your needs.

---

## 📂 Documentation Structure

### 1. [📍 This Repository (`this-repo/`)](./this-repo/)

**Focus**: Specifics of the `codezest-api` microservice.
_Start here if you are working on this specific service._

- **[01-QUICK_START.md](./this-repo/01-QUICK_START.md)** - 🚀 **Start Here**: Run the project in 5 minutes
- **[02-PROJECT_STRUCTURE.md](./this-repo/02-PROJECT_STRUCTURE.md)** - 🗺️ File layout and organization
- **[03-ARCHITECTURE.md](./this-repo/03-ARCHITECTURE.md)** - 🏗️ Clean Architecture implementation details
- **[04-API_ENDPOINTS.md](./this-repo/04-API_ENDPOINTS.md)** - 🔌 API reference and endpoints
- **[05-SWAGGER_SETUP.md](./this-repo/05-SWAGGER_SETUP.md)** - 📖 How API documentation is generated
- **[06-PROGRESS.md](./this-repo/06-PROGRESS.md)** - 📊 Current development status and checklist
- **[07-PROJECT_SUMMARY.md](./this-repo/07-PROJECT_SUMMARY.md)** - 📈 Metrics, stats, and high-level status
- **[99-TROUBLESHOOTING.md](./this-repo/99-TROUBLESHOOTING.md)** - 🔧 Fixes for common issues (Prisma, etc.)

### 2. [🌐 Project Wide (`project-wide/`)](./project-wide/)

**Focus**: The broader CodeZest platform, database schemas, and architectural decisions.
_Read these to understand the "Big Picture"._

- **[01-PLATFORM_OVERVIEW.md](./project-wide/01-PLATFORM_OVERVIEW.md)** - 🌍 High-level platform architecture
- **[02-DATABASE_SCHEMA.md](./project-wide/02-DATABASE_SCHEMA.md)** - 🗄️ **Crucial**: Complete database schema & models
- **[03-DOMAIN_ARCHITECTURE.md](./project-wide/03-DOMAIN_ARCHITECTURE.md)** - 🧠 Domain-Driven Design principles
- **[04-IMPLEMENTATION_ROADMAP.md](./project-wide/04-IMPLEMENTATION_ROADMAP.md)** - 🛣️ Master plan and phases
- **[05-ARCHITECTURE_DECISIONS.md](./project-wide/05-ARCHITECTURE_DECISIONS.md)** - ⚖️ ADRs (Redis, etc.)

### 3. [📘 Guides (`guides/`)](./guides/)

**Focus**: How-to guides for shared packages and common tasks.
_Reference these when you need to do specific integration tasks._

- **[01-CONSUMING_DB_PACKAGE.md](./guides/01-CONSUMING_DB_PACKAGE.md)** - 📦 Using `@codezest-academy/codezest-db`
- **[02-CONSUMING_CACHE_PACKAGE.md](./guides/02-CONSUMING_CACHE_PACKAGE.md)** - ⚡ Using Redis cache
- **[03-REDIS_SETUP.md](./guides/03-REDIS_SETUP.md)** - 🛠️ Setting up Redis infrastructure
- **[04-SCHEMA_UPDATES.md](./guides/04-SCHEMA_UPDATES.md)** - 🔄 How to modify the database schema
- **[05-PACKAGE_MIGRATION.md](./guides/05-PACKAGE_MIGRATION.md)** - 🚚 Migration guides

---

## 🤖 For AI Agents

To get up to speed quickly, read these files in order:

1. `cat .context/this-repo/01-QUICK_START.md` (Setup)
2. `cat .context/this-repo/06-PROGRESS.md` (Current Status)
3. `cat .context/project-wide/02-DATABASE_SCHEMA.md` (Data Model)
4. `cat .context/this-repo/03-ARCHITECTURE.md` (Code Pattern)

---

**Last Updated**: November 2025
