# 📚 CodeZest Context & Documentation

Welcome to the documentation hub for the `codezest-api` service and the broader CodeZest platform. This folder is organized to help you find information quickly based on your needs.

---

## 📂 Documentation Structure

### 1. [📍 This Repository (`this-repo/`)](./this-repo/)

**Focus**: Specifics of the `codezest-api` microservice.
_Start here if you are working on this specific service._

- **[01-quick-start.md](./this-repo/01-quick-start.md)** - 🚀 **Start Here**: Run the project in 5 minutes
- **[02-project-structure.md](./this-repo/02-project-structure.md)** - 🗺️ File layout and organization
- **[03-architecture.md](./this-repo/03-architecture.md)** - 🏗️ Clean Architecture implementation details
- **[04-api-endpoints.md](./this-repo/04-api-endpoints.md)** - 🔌 API reference and endpoints
- **[05-swagger-setup.md](./this-repo/05-swagger-setup.md)** - 📖 How API documentation is generated
- **[06-progress.md](./this-repo/06-progress.md)** - 📊 Current development status and checklist
- **[07-project-summary.md](./this-repo/07-project-summary.md)** - 📈 Metrics, stats, and high-level status
- **[99-troubleshooting.md](./this-repo/99-troubleshooting.md)** - 🔧 Fixes for common issues (Prisma, etc.)

### 2. [🌐 Project Wide (`project-wide/`)](./project-wide/)

**Focus**: The broader CodeZest platform, database schemas, and architectural decisions.
_Read these to understand the "Big Picture"._

- **[01-platform-overview.md](./project-wide/01-platform-overview.md)** - 🌍 High-level platform architecture
- **[02-database-schema.md](./project-wide/02-database-schema.md)** - 🗄️ **Crucial**: Complete database schema & models
- **[03-domain-architecture.md](./project-wide/03-domain-architecture.md)** - 🧠 Domain-Driven Design principles
- **[04-implementation-roadmap.md](./project-wide/04-implementation-roadmap.md)** - 🛣️ Master plan and phases
- **[05-architecture-decisions.md](./project-wide/05-architecture-decisions.md)** - ⚖️ ADRs (Redis, etc.)

### 3. [📘 Guides (`guides/`)](./guides/)

**Focus**: How-to guides for shared packages and common tasks.
_Reference these when you need to do specific integration tasks._

- **[01-consuming-db-package.md](./guides/01-consuming-db-package.md)** - 📦 Using `@codezest-academy/codezest-db`
- **[02-consuming-cache-package.md](./guides/02-consuming-cache-package.md)** - ⚡ Using Redis cache
- **[03-redis-setup.md](./guides/03-redis-setup.md)** - 🛠️ Setting up Redis infrastructure
- **[04-schema-updates.md](./guides/04-schema-updates.md)** - 🔄 How to modify the database schema
- **[05-package-migration.md](./guides/05-package-migration.md)** - 🚚 Migration guides

---

## 🤖 For AI Agents

To get up to speed quickly, read these files in order:

1. `cat .context/this-repo/01-quick-start.md` (Setup)
2. `cat .context/this-repo/06-progress.md` (Current Status)
3. `cat .context/project-wide/02-database-schema.md` (Data Model)
4. `cat .context/this-repo/03-architecture.md` (Code Pattern)

---

**Last Updated**: November 2025