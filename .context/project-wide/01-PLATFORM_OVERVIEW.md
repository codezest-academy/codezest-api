# 🌍 CodeZest Platform Overview

**CodeZest** is a comprehensive coding learning platform designed with a microservices architecture. It enables users to learn programming languages through modules, materials, assignments, and quizzes.

---

## 🏗️ High-Level Architecture

The platform is composed of several specialized microservices:

| Service                    | Responsibility                                                                    |
| -------------------------- | --------------------------------------------------------------------------------- |
| **codezest-auth**          | User identity, authentication, profiles, and session management.                  |
| **codezest-api**           | **(This Repo)** Core learning domain: Languages, Modules, Materials, Assignments. |
| **codezest-payments**      | Subscriptions, transactions, invoices, and payment gateway integration.           |
| **codezest-notifications** | Email, push, and in-app notifications.                                            |
| **codezest-activity**      | User activity tracking, analytics, and feeds.                                     |

### Shared Infrastructure

- **Database**: PostgreSQL (Single source of truth, accessed via `@codezest-academy/codezest-db`)
- **Cache**: Redis (Shared caching layer)
- **Message Broker**: (Planned) RabbitMQ/Kafka for inter-service communication
- **API Gateway**: (Planned) Unified entry point

---

## 🛠️ Technology Stack

- **Runtime**: Node.js (TypeScript)
- **Framework**: Express.js
- **Database ORM**: Prisma
- **Validation**: Zod
- **Documentation**: OpenAPI / Swagger
- **Testing**: Jest
- **Containerization**: Docker

---

## 📦 Shared Packages

To maintain consistency, we use private npm packages:

1. **`@codezest-academy/codezest-db`**: Contains the Prisma schema and generated client. Ensures all services use the exact same database model.
2. **`@codezest-academy/codezest-cache`**: Standardized Redis client wrapper.

---

## 🔄 Data Flow

1. **User Request** → **API Gateway** (or direct service LB)
2. **Auth Service** validates token & permissions
3. **Target Service** (e.g., Learning) processes request
   - Queries **Redis** for cached data
   - Queries **PostgreSQL** via Prisma if cache miss
4. **Response** sent back to user

---

## 🎯 Key Design Principles

1. **Clean Architecture**: Separation of concerns (Domain, Application, Infrastructure, Presentation).
2. **Domain-Driven Design (DDD)**: Code structure reflects business domains.
3. **Type Safety**: Strict TypeScript usage across the entire stack.
4. **Statelessness**: Services are stateless for horizontal scaling.
