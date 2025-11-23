import { describe, it, expect } from '@jest/globals';
import { successResponse, errorResponse, paginatedResponse } from '../../src/common/utils/response';

describe('Response Utilities', () => {
  describe('successResponse', () => {
    it('should create a success response with data', () => {
      const data = { id: 1, name: 'Test' };
      const response = successResponse(data);

      expect(response.status).toBe('success');
      expect(response.data).toEqual(data);
      expect(response.meta).toHaveProperty('timestamp');
    });

    it('should include custom message when provided', () => {
      const data = { id: 1 };
      const message = 'Operation successful';
      const response = successResponse(data, message);

      expect(response.message).toBe(message);
    });
  });

  describe('errorResponse', () => {
    it('should create an error response', () => {
      const code = 'TEST_ERROR';
      const message = 'Test error message';
      const response = errorResponse(code, message);

      expect(response.status).toBe('error');
      expect(response.error.code).toBe(code);
      expect(response.error.message).toBe(message);
      expect(response.meta).toHaveProperty('timestamp');
    });

    it('should include details when provided', () => {
      const details = { field: 'email', issue: 'invalid format' };
      const response = errorResponse('VALIDATION_ERROR', 'Validation failed', details);

      expect(response.error.details).toEqual(details);
    });
  });

  describe('paginatedResponse', () => {
    it('should create a paginated response', () => {
      const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const pagination = {
        page: 1,
        limit: 10,
        total: 25,
        totalPages: 3,
      };

      const response = paginatedResponse(items, pagination);

      expect(response.status).toBe('success');
      expect(response.data).toEqual(items);
      expect(response.pagination).toEqual(pagination);
      expect(response.meta).toHaveProperty('timestamp');
    });
  });
});
