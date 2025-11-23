import { describe, it, expect, beforeAll } from '@jest/globals';
import request from 'supertest';
import { Application } from 'express';
import createApp from '../../src/app';

describe('Application Integration Tests', () => {
  let app: Application;

  beforeAll(() => {
    app = createApp();
  });

  describe('Health Check', () => {
    it('should return 200 OK for health check endpoint', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('environment');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/non-existent-route');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body.error).toHaveProperty('code', 'ROUTE_NOT_FOUND');
      expect(response.body.error).toHaveProperty('message');
    });
  });

  describe('CORS', () => {
    it('should include CORS headers', async () => {
      const response = await request(app).get('/health').set('Origin', 'http://localhost:3000');

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });

  describe('Security Headers', () => {
    it('should include security headers from Helmet', async () => {
      const response = await request(app).get('/health');

      expect(response.headers).toHaveProperty('x-content-type-options', 'nosniff');
      expect(response.headers).toHaveProperty('x-frame-options');
    });
  });
});
