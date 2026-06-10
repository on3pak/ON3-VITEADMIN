import { describe, it, expect, beforeEach, vi } from 'vitest';

const BASE = 'http://test:3000/api';

vi.stubEnv('VITE_API_URL', BASE);
vi.stubEnv('VITE_USE_API', 'false');

const mockFetch = vi.fn();
Object.defineProperty(globalThis, 'fetch', {
  value: mockFetch,
  writable: true,
});

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

function mockResponse(data: unknown, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: () => Promise.resolve(data),
  } as Response);
}

const paginatedResponse = {
  data: [{ id: '1' }],
  total: 1,
  page: 1,
  limit: 100,
  totalPages: 1,
};

describe('api/services', () => {
  beforeEach(() => {
    storage = {};
    mockFetch.mockReset();
  });

  describe('authApi', () => {
    it('login posts to /auth/login', async () => {
      const loginResponse = { accessToken: 'jwt', user: { id: 'u_1', email: 'a@b.com', role: 'ROOT', employee_id: 'e1', city_id: 'c1', full_name: 'Admin' } };
      mockFetch.mockResolvedValue(mockResponse(loginResponse));
      const { authApi } = await import('../services/auth');
      const result = await authApi.login({ email: 'a@b.com', password: 'secret' });
      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE}/auth/login`,
        expect.objectContaining({ method: 'POST', body: JSON.stringify({ email: 'a@b.com', password: 'secret' }) }),
      );
      expect(result).toEqual(loginResponse);
    });
  });

  describe('citiesApi', () => {
    it('list calls GET /cities', async () => {
      mockFetch.mockResolvedValue(mockResponse(paginatedResponse));
      const { citiesApi } = await import('../services/cities');
      const result = await citiesApi.list();
      expect(mockFetch).toHaveBeenCalledWith(`${BASE}/cities`, expect.objectContaining({ method: 'GET' }));
      expect(result).toEqual(paginatedResponse);
    });

    it('getById calls GET /cities/:id', async () => {
      mockFetch.mockResolvedValue(mockResponse({ id: 'ci_1' }));
      const { citiesApi } = await import('../services/cities');
      await citiesApi.getById('ci_1');
      expect(mockFetch).toHaveBeenCalledWith(`${BASE}/cities/ci_1`, expect.objectContaining({ method: 'GET' }));
    });

    it('create calls POST /cities with body', async () => {
      mockFetch.mockResolvedValue(mockResponse({ id: 'ci_2' }));
      const { citiesApi } = await import('../services/cities');
      await citiesApi.create({ name: 'Madrid' });
      expect(mockFetch).toHaveBeenCalledWith(`${BASE}/cities`, expect.objectContaining({
        method: 'POST', body: JSON.stringify({ name: 'Madrid' }),
      }));
    });

    it('update calls PATCH /cities/:id', async () => {
      mockFetch.mockResolvedValue(mockResponse({ id: 'ci_1' }));
      const { citiesApi } = await import('../services/cities');
      await citiesApi.update('ci_1', { name: 'Barcelona' });
      expect(mockFetch).toHaveBeenCalledWith(`${BASE}/cities/ci_1`, expect.objectContaining({ method: 'PATCH' }));
    });

    it('delete calls DELETE /cities/:id', async () => {
      mockFetch.mockResolvedValue(mockResponse(undefined, 204));
      const { citiesApi } = await import('../services/cities');
      await citiesApi.delete('ci_1');
      expect(mockFetch).toHaveBeenCalledWith(`${BASE}/cities/ci_1`, expect.objectContaining({ method: 'DELETE' }));
    });
  });

  describe('workCentersApi', () => {
    it('list calls GET /work-centers', async () => {
      mockFetch.mockResolvedValue(mockResponse(paginatedResponse));
      const { workCentersApi } = await import('../services/workCenters');
      await workCentersApi.list();
      expect(mockFetch).toHaveBeenCalledWith(`${BASE}/work-centers`, expect.objectContaining({ method: 'GET' }));
    });
  });

  describe('employeesApi', () => {
    it('list calls GET /employees', async () => {
      mockFetch.mockResolvedValue(mockResponse(paginatedResponse));
      const { employeesApi } = await import('../services/employees');
      await employeesApi.list();
      expect(mockFetch).toHaveBeenCalledWith(`${BASE}/employees`, expect.objectContaining({ method: 'GET' }));
    });

    it('getById calls GET /employees/:id', async () => {
      mockFetch.mockResolvedValue(mockResponse({ id: 'emp_1' }));
      const { employeesApi } = await import('../services/employees');
      await employeesApi.getById('emp_1');
      expect(mockFetch).toHaveBeenCalledWith(`${BASE}/employees/emp_1`, expect.objectContaining({ method: 'GET' }));
    });
  });

  describe('usersApi', () => {
    it('list calls GET /users', async () => {
      mockFetch.mockResolvedValue(mockResponse(paginatedResponse));
      const { usersApi } = await import('../services/users');
      await usersApi.list();
      expect(mockFetch).toHaveBeenCalledWith(`${BASE}/users`, expect.objectContaining({ method: 'GET' }));
    });

    it('create sends email, password, role, employee_id', async () => {
      mockFetch.mockResolvedValue(mockResponse({ id: 'u_1' }));
      const { usersApi } = await import('../services/users');
      await usersApi.create({ email: 'a@b.com', password: 'secret', role: 'MANAGER', employee_id: 'emp_1' });
      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body).toEqual({ email: 'a@b.com', password: 'secret', role: 'MANAGER', employee_id: 'emp_1' });
    });
  });

  describe('vehiclesApi', () => {
    it('list calls GET /vehicles', async () => {
      mockFetch.mockResolvedValue(mockResponse(paginatedResponse));
      const { vehiclesApi } = await import('../services/vehicles');
      await vehiclesApi.list();
      expect(mockFetch).toHaveBeenCalledWith(`${BASE}/vehicles`, expect.objectContaining({ method: 'GET' }));
    });
  });

  describe('servicesApi', () => {
    it('list calls GET /services', async () => {
      mockFetch.mockResolvedValue(mockResponse(paginatedResponse));
      const { servicesApi } = await import('../services/services');
      await servicesApi.list();
      expect(mockFetch).toHaveBeenCalledWith(`${BASE}/services`, expect.objectContaining({ method: 'GET' }));
    });
  });

  describe('inventoryApi', () => {
    it('list calls GET /inventory', async () => {
      mockFetch.mockResolvedValue(mockResponse(paginatedResponse));
      const { inventoryApi } = await import('../services/inventory');
      await inventoryApi.list();
      expect(mockFetch).toHaveBeenCalledWith(`${BASE}/inventory`, expect.objectContaining({ method: 'GET' }));
    });
  });

  describe('machineryApi', () => {
    it('list calls GET /machinery', async () => {
      mockFetch.mockResolvedValue(mockResponse(paginatedResponse));
      const { machineryApi } = await import('../services/machinery');
      await machineryApi.list();
      expect(mockFetch).toHaveBeenCalledWith(`${BASE}/machinery`, expect.objectContaining({ method: 'GET' }));
    });
  });

  describe('vacationsApi', () => {
    it('list passes employee_id param', async () => {
      mockFetch.mockResolvedValue(mockResponse(paginatedResponse));
      const { vacationsApi } = await import('../services/vacations');
      await vacationsApi.list({ employee_id: 'emp_1' });
      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain('employee_id=emp_1');
    });

    it('create sends days array', async () => {
      mockFetch.mockResolvedValue(mockResponse({ id: 'v_1' }));
      const { vacationsApi } = await import('../services/vacations');
      await vacationsApi.create({ employee_id: 'emp_1', type: 'FREE_DAYS', days: ['2025-08-01'] });
      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.days).toEqual(['2025-08-01']);
    });
  });

  describe('workReportsApi', () => {
    it('list passes date and employee_id params', async () => {
      mockFetch.mockResolvedValue(mockResponse(paginatedResponse));
      const { workReportsApi } = await import('../services/workReports');
      await workReportsApi.list({ date: '2025-08-01', employee_id: 'emp_1' });
      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain('date=2025-08-01');
      expect(url).toContain('employee_id=emp_1');
    });
  });

  describe('serviceReportsApi', () => {
    it('list calls GET /service-reports', async () => {
      mockFetch.mockResolvedValue(mockResponse(paginatedResponse));
      const { serviceReportsApi } = await import('../services/serviceReports');
      await serviceReportsApi.list();
      expect(mockFetch).toHaveBeenCalledWith(`${BASE}/service-reports`, expect.objectContaining({ method: 'GET' }));
    });
  });

  describe('lookupsApi', () => {
    it('cities calls GET /lookups/cities', async () => {
      mockFetch.mockResolvedValue(mockResponse([{ id: 'ci_1', name: 'Madrid' }]));
      const { lookupsApi } = await import('../services/lookups');
      const result = await lookupsApi.cities();
      expect(mockFetch).toHaveBeenCalledWith(`${BASE}/lookups/cities`, expect.objectContaining({ method: 'GET' }));
      expect(result).toEqual([{ id: 'ci_1', name: 'Madrid' }]);
    });

    it('workCenters calls GET /lookups/work_centers', async () => {
      mockFetch.mockResolvedValue(mockResponse([{ id: 'wc_1', name: 'Taller' }]));
      const { lookupsApi } = await import('../services/lookups');
      await lookupsApi.workCenters();
      expect(mockFetch).toHaveBeenCalledWith(`${BASE}/lookups/work_centers`, expect.objectContaining({ method: 'GET' }));
    });

    it('employees calls GET /lookups/employees', async () => {
      mockFetch.mockResolvedValue(mockResponse([{ id: 'emp_1', full_name: 'Juan' }]));
      const { lookupsApi } = await import('../services/lookups');
      await lookupsApi.employees();
      expect(mockFetch).toHaveBeenCalledWith(`${BASE}/lookups/employees`, expect.objectContaining({ method: 'GET' }));
    });
  });

  describe('dashboardApi', () => {
    it('getStats calls GET /dashboard', async () => {
      const stats = { employees: 10, work_centers: 5, vehicles: 3, inventory_items: 50 };
      mockFetch.mockResolvedValue(mockResponse(stats));
      const { dashboardApi } = await import('../services/dashboard');
      const result = await dashboardApi.getStats();
      expect(mockFetch).toHaveBeenCalledWith(`${BASE}/dashboard`, expect.objectContaining({ method: 'GET' }));
      expect(result).toEqual(stats);
    });
  });
});
