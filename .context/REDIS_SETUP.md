# Redis Setup and Maintenance Guide

This guide provides a complete understanding of how Redis is integrated into the CodeZest API, how to run it locally, and how to manage it in a deployment environment.

## 1. Project Integration

The project uses the `redis` npm package and manages the connection via a Singleton service located at `src/infrastructure/cache/redis.service.ts`.

### Configuration

Redis configuration is handled in `src/config/index.ts` and maps to the following environment variables:

| Variable         | Default     | Description                  |
| ---------------- | ----------- | ---------------------------- |
| `REDIS_HOST`     | `localhost` | Hostname of the Redis server |
| `REDIS_PORT`     | `6379`      | Port number                  |
| `REDIS_PASSWORD` | undefined   | Password (optional)          |
| `REDIS_DB`       | `0`         | Database index (0-15)        |

### Code Usage Example

You don't need to manually connect; the server handles it on startup. To use Redis in your services:

```typescript
import RedisService from '../infrastructure/cache/redis.service';

const redis = RedisService.getInstance();

// Set a value (expires in 1 hour)
await redis.set('user:123', JSON.stringify(userData), 3600);

// Get a value
const data = await redis.get('user:123');

// Delete a value
await redis.del('user:123');
```

## 2. Local Development

We use **Docker Compose** to run Redis locally, ensuring a consistent environment without needing to install Redis directly on your machine.

### Starting Redis

Redis is defined in `docker-compose.yml`. To start it along with the database:

```bash
docker-compose up -d redis
```

To check if it's running:

```bash
docker ps | grep redis
```

### connecting via CLI

You can interact with the local Redis instance using the Docker container:

```bash
docker exec -it codezest-redis redis-cli
```

Common commands:

- `PING`: Check connection (returns PONG)
- `KEYS *`: List all keys (use carefully in production!)
- `FLUSHDB`: Clear the current database
- `MONITOR`: Watch all requests in real-time

## 3. Deployment (Production)

In a production environment (e.g., AWS, DigitalOcean, Heroku), you have two main options:

### Option A: Managed Redis (Recommended)

Use a managed service like AWS ElastiCache, Redis Cloud, or DigitalOcean Managed Redis.

1. Create the Redis instance in your cloud provider.
2. Get the **Host**, **Port**, and **Password**.
3. Set the environment variables in your deployment platform (e.g., via `.env` or CI/CD secrets):
   ```env
   REDIS_HOST=your-production-redis.com
   REDIS_PORT=6379
   REDIS_PASSWORD=your-complex-password
   ```

### Option B: Self-Hosted (VPS)

If you run your own Docker container on a VPS:

1. Ensure the `redis` service in `docker-compose.yml` uses a persistent volume (already configured as `redis_data`).
2. **IMPORTANT**: Set a strong password.
   - Update `docker-compose.yml` command: `command: redis-server --requirepass ${REDIS_PASSWORD}`
   - Or use a custom `redis.conf`.
3. Ensure port `6379` is **NOT** exposed to the public internet via firewall rules. Only your API container should access it.

## 4. Maintenance & Troubleshooting

### Monitoring

- **Memory Usage**: Redis stores everything in RAM. Monitor memory usage to prevent crashes.
- **Eviction Policy**: If memory is full, Redis removes keys based on policy. Default is usually `noeviction` (returns error) or `volatile-lru`.

### Common Issues

1. **Connection Refused**:
   - Check if the Redis container is running.
   - Verify `REDIS_HOST` is correct (use `redis` if inside docker network, `localhost` if running app outside docker).
2. **Docker Not Running**:
   - If you see `Cannot connect to the Docker daemon`, ensure Docker Desktop is running.
3. **NOAUTH Authentication required**:
   - You set a password on the server but didn't provide `REDIS_PASSWORD` in the app config.

### Verification Script

We have included a script to verify your Redis connection:

```bash
npm run test:redis
```
