# Caching Logic Removal

This document outlines the removal of all caching-related components from the `codezest-api` project, as per the decision to handle caching in a separate, dedicated service.

The following actions will be performed:

### 1. File Deletions

The following files, which are specific to the Redis implementation, will be deleted:

-   `src/infrastructure/cache/redis.service.ts`: The core Redis client and service logic.
-   `scripts/test-redis.ts`: The utility script for testing the Redis connection.

### 2. Configuration Changes

-   **`docker-compose.yml`**: The `redis` service definition and its associated volume (`redis_data`) will be removed to prevent the Redis container from being part of the local development environment.

### 3. Code Modifications

-   **`src/server.ts`**: Any calls to `RedisService.connect()` on startup and `RedisService.disconnect()` on shutdown will be removed.
-   **`package.json`**: The following dependencies will be removed:
    -   `redis`: The Redis client library.
    -   `bullmq`: The queueing library that depends on Redis, as its functionality is also being decoupled.

### 4. Dependency Update

-   After modifying `package.json`, `npm install` will be run to remove the packages from `node_modules` and update the `package-lock.json` file.

This process will completely remove the integrated caching and queueing logic from this microservice.
