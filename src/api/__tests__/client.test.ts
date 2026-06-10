import { describe, it, expect, beforeEach, vi } from 'vitest';

const BASE = 'http://test:3000/api';

vi.stubEnv('VITE_API_URL', BASE);
vi.stubEnv('VITE_USE_API', 'false');

const STORAGE_KEY = 'on3_auth_token';
let storage: Record<string, string> = {};

Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: vi.fn((key: string) => storage[key] ?? null),
    setItem: vi.fn((key: string, val: string) => { storage[key] = val; }),
    removeItem: vi.fn((key: string) => { delete storage[key]; }),
    clear: vi.fn(() => { storage = {}; }),
  },
  writable: true,
});

const mockFetch = vi.fn();
Object.defineProperty(globalThis, 'fetch', {
  value: mockFetch,
  writable: true,
});

function mockResponse(data: unknown, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: () => Promise.resolve(data),
  } as Response);
}

async function importModules() {
  const { api, getToken } = await import('../client');
  return { api, getToken };
}

describe('api/client', () => {
  beforeEach(() => {
    storage = {};
    mockFetch.mockReset();
  });

  describe('getToken', () => {
    it('returns null when no token is stored', async () => {
      const { getToken } = await importModules();
      expect(getToken()).toBeNull();
    });

    it('returns the stored token', async () => {
      storage[STORAGE_KEY] = 'my-jwt-token';
      const { getToken } = await importModules();
      expect(getToken()).toBe('my-jwt-token');
    });
  });

  describe('api.get', () => {
    it('makes a GET request to the correct URL', async () => {
      mockFetch.mockResolvedValue(mockResponse([{ id: '1' }]));
      const { api } = await importModules();
      const result = await api.get('/cities');
      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE}/cities`,
        expect.objectContaining({ method: 'GET' }),
      );
      expect(result).toEqual([{ id: '1' }]);
    });

    it('appends query params', async () => {
      mockFetch.mockResolvedValue(mockResponse([]));
      const { api } = await importModules();
      await api.get('/cities', { page: 1, limit: 10 });
      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain('page=1');
      expect(url).toContain('limit=10');
    });

    it('attaches Bearer token when stored', async () => {
      storage[STORAGE_KEY] = 'test-token';
      mockFetch.mockResolvedValue(mockResponse({}));
      const { api } = await importModules();
      await api.get('/cities');
      const headers = mockFetch.mock.calls[0][1].headers;
      expect(headers['Authorization']).toBe('Bearer test-token');
    });

    it('does not attach Authorization when no token', async () => {
      mockFetch.mockResolvedValue(mockResponse({}));
      const { api } = await importModules();
      await api.get('/cities');
      const headers = mockFetch.mock.calls[0][1].headers;
      expect(headers['Authorization']).toBeUndefined();
    });
  });

  describe('api.getList', () => {
    it('returns paginated response', async () => {
      const paginated = {
        data: [{ id: '1' }, { id: '2' }],
        total: 2,
        page: 1,
        limit: 100,
        totalPages: 1,
      };
      mockFetch.mockResolvedValue(mockResponse(paginated));
      const { api } = await importModules();
      const result = await api.getList('/cities');
      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE}/cities`,
        expect.objectContaining({ method: 'GET' }),
      );
      expect(result).toEqual(paginated);
    });
  });

  describe('api.getById', () => {
    it('appends the id to the path', async () => {
      mockFetch.mockResolvedValue(mockResponse({ id: 'ci_1' }));
      const { api } = await importModules();
      const result = await api.getById('/cities', 'ci_1');
      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE}/cities/ci_1`,
        expect.objectContaining({ method: 'GET' }),
      );
      expect(result).toEqual({ id: 'ci_1' });
    });
  });

  describe('api.post', () => {
    it('sends a POST with JSON body', async () => {
      mockFetch.mockResolvedValue(mockResponse({ id: 'ci_new' }));
      const { api } = await importModules();
      const body = { name: 'Madrid' };
      const result = await api.post('/cities', body);
      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE}/cities`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(body),
        }),
      );
      expect(result).toEqual({ id: 'ci_new' });
    });
  });

  describe('api.patch', () => {
    it('sends a PATCH with id in path and JSON body', async () => {
      mockFetch.mockResolvedValue(mockResponse({ id: 'ci_1', name: 'Updated' }));
      const { api } = await importModules();
      const body = { name: 'Updated' };
      const result = await api.patch('/cities', 'ci_1', body);
      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE}/cities/ci_1`,
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(body),
        }),
      );
      expect(result).toEqual({ id: 'ci_1', name: 'Updated' });
    });
  });

  describe('api.delete', () => {
    it('sends a DELETE with id in path', async () => {
      mockFetch.mockResolvedValue(mockResponse(undefined, 204));
      const { api } = await importModules();
      await api.delete('/cities', 'ci_1');
      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE}/cities/ci_1`,
        expect.objectContaining({ method: 'DELETE' }),
      );
    });
  });

  describe('error handling', () => {
    it('throws ApiError with messages on 400', async () => {
      const errBody = { statusCode: 400, message: ['el nombre no puede estar vacío'], error: 'Bad Request' };
      mockFetch.mockResolvedValue(mockResponse(errBody, 400));
      const { api } = await importModules();
      await expect(api.get('/cities')).rejects.toThrow('el nombre no puede estar vacío');
    });

    it('throws ApiError with fallback on non-JSON error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.reject(new Error('not json')),
      } as Response);
      const { api } = await importModules();
      await expect(api.get('/cities')).rejects.toThrow('HTTP 500: Internal Server Error');
    });

    it('throws ApiError on 401 with unauthorized message', async () => {
      const errBody = { statusCode: 401, message: ['Token faltante o inválido'], error: 'Unauthorized' };
      mockFetch.mockResolvedValue(mockResponse(errBody, 401));
      const { api } = await importModules();
      await expect(api.get('/cities')).rejects.toThrow('Token faltante o inválido');
    });

    it('throws ApiError on 403 forbidden', async () => {
      const errBody = { statusCode: 403, message: ['Rol sin permisos'], error: 'Forbidden' };
      mockFetch.mockResolvedValue(mockResponse(errBody, 403));
      const { api } = await importModules();
      await expect(api.get('/cities')).rejects.toThrow('Rol sin permisos');
    });

    it('throws ApiError on 409 conflict', async () => {
      const errBody = { statusCode: 409, message: ['email duplicado'], error: 'Conflict' };
      mockFetch.mockResolvedValue(mockResponse(errBody, 409));
      const { api } = await importModules();
      await expect(api.get('/cities')).rejects.toThrow('email duplicado');
    });
  });

  describe('ApiError class', () => {
    it('has statusCode, messages, and error properties', async () => {
      const { api: { ApiError } } = await importModules();
      const err = new ApiError(404, ['Not found'], 'Not Found');
      expect(err.statusCode).toBe(404);
      expect(err.message).toBe('Not found');
      expect(err.error).toBe('Not Found');
      expect(err.name).toBe('ApiError');
    });
  });
});
