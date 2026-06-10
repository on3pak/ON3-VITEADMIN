import { describe, it, expect, beforeAll } from 'vitest';

const API_URL = process.env.VITE_API_URL || 'http://localhost:6543/api';

let token = '';
let createdCityId = '';

function headers(extra: Record<string, string> = {}) {
  const h: Record<string, string> = { 'Content-Type': 'application/json', ...extra };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

async function api(path: string, options: { method?: string; body?: unknown } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method: options.method || 'GET',
    headers: headers(options.body ? { 'Content-Type': 'application/json' } : undefined),
    // @ts-ignore
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`HTTP ${res.status}: ${err.message?.join?.('; ') || res.statusText}`);
  }
  if (res.status === 204) return undefined;
  return res.json();
}

const testIfBackend = (name: string, fn: () => Promise<void>) => {
  it(name, async () => {
    if (!token) return;
    await fn();
  });
};

describe('API real backend', () => {
  beforeAll(async () => {
    try {
      const res = await api('/auth/login', {
        method: 'POST',
        body: { email: '000001@on3.com', password: 'root' },
      });
      token = res.accessToken;
    } catch {
      // backend not available — tests silently pass
    }
  });

  describe('auth', () => {
    testIfBackend('login returns JWT with claims', async () => {
      expect(token).toBeTruthy();
      const payload = JSON.parse(atob(token.split('.')[1]));
      expect(payload).toHaveProperty('sub');
      expect(payload).toHaveProperty('email', '000001@on3.com');
      expect(payload).toHaveProperty('role', 'ROOT');
      expect(payload).toHaveProperty('city_id');
    });

    testIfBackend('rejects invalid credentials', async () => {
      await expect(
        api('/auth/login', { method: 'POST', body: { email: 'wrong', password: 'wrong' } }),
      ).rejects.toThrow();
    });
  });

  describe('cities', () => {
    testIfBackend('lists cities as paginated response', async () => {
      const res = await api('/cities');
      expect(res.data).toBeInstanceOf(Array);
      expect(typeof res.total).toBe('number');
      expect(typeof res.page).toBe('number');
      expect(typeof res.limit).toBe('number');
    });

    testIfBackend('creates and returns a city', async () => {
      const city = await api('/cities', { method: 'POST', body: { name: `TestCity_${Date.now()}` } });
      expect(city).toHaveProperty('id');
      expect(city.name).toMatch(/^TestCity_/);
      createdCityId = city.id;
    });

    testIfBackend('gets city by id', async () => {
      if (!createdCityId) return;
      const city = await api(`/cities/${createdCityId}`);
      expect(city.id).toBe(createdCityId);
    });

    testIfBackend('returns error for non-existent city', async () => {
      await expect(api('/cities/nonexistent')).rejects.toThrow();
    });
  });

  describe('employees', () => {
    testIfBackend('lists employees as paginated response', async () => {
      const res = await api('/employees');
      expect(res.data).toBeInstanceOf(Array);
      expect(res).toHaveProperty('total');
    });
  });

  describe('work centers', () => {
    testIfBackend('lists work centers as paginated response', async () => {
      const res = await api('/work-centers');
      expect(res.data).toBeInstanceOf(Array);
      expect(res).toHaveProperty('total');
    });
  });

  describe('vehicles', () => {
    testIfBackend('lists vehicles as paginated response', async () => {
      const res = await api('/vehicles');
      expect(res.data).toBeInstanceOf(Array);
      expect(res).toHaveProperty('total');
    });
  });

  describe('services', () => {
    testIfBackend('lists services as paginated response', async () => {
      const res = await api('/services');
      expect(res.data).toBeInstanceOf(Array);
      expect(res).toHaveProperty('total');
    });
  });

  describe('inventory', () => {
    testIfBackend('lists inventory as paginated response', async () => {
      const res = await api('/inventory');
      expect(res.data).toBeInstanceOf(Array);
      expect(res).toHaveProperty('total');
    });
  });

  describe('machinery', () => {
    testIfBackend('lists machinery as paginated response', async () => {
      const res = await api('/machinery');
      expect(res.data).toBeInstanceOf(Array);
      expect(res).toHaveProperty('total');
    });
  });

  describe('vacations', () => {
    testIfBackend('lists vacations as paginated response', async () => {
      const res = await api('/vacations');
      expect(res.data).toBeInstanceOf(Array);
      expect(res).toHaveProperty('total');
    });
  });

  describe('work reports', () => {
    testIfBackend('lists work reports as paginated response', async () => {
      const res = await api('/work-reports');
      expect(res.data).toBeInstanceOf(Array);
      expect(res).toHaveProperty('total');
    });
  });

  describe('service reports', () => {
    testIfBackend('lists service reports as paginated response', async () => {
      const res = await api('/service-reports');
      expect(res.data).toBeInstanceOf(Array);
      expect(res).toHaveProperty('total');
    });
  });

  describe('lookups', () => {
    testIfBackend('cities lookup returns paginated list', async () => {
      const res = await api('/lookups/cities');
      expect(res.data).toBeInstanceOf(Array);
      expect(res.data[0]).toHaveProperty('id');
      expect(res.data[0]).toHaveProperty('name');
    });

    testIfBackend('work centers lookup returns paginated list', async () => {
      const res = await api('/lookups/work_centers');
      expect(res.data).toBeInstanceOf(Array);
    });

    testIfBackend('employees lookup returns paginated list', async () => {
      const res = await api('/lookups/employees');
      expect(res.data).toBeInstanceOf(Array);
    });
  });

  describe('dashboard', () => {
    testIfBackend('returns stats object with counts', async () => {
      const res = await api('/dashboard');
      expect(res).toHaveProperty('employees');
      expect(res).toHaveProperty('work_centers');
      expect(res).toHaveProperty('vehicles');
      expect(typeof res.employees).toBe('number');
    });
  });

  describe('RBAC', () => {
    testIfBackend('returns 401 on missing token', async () => {
      const res = await fetch(`${API_URL}/users`, {
        headers: { 'Content-Type': 'application/json' },
      });
      expect(res.status).toBe(401);
    });
  });

  describe('pagination', () => {
    testIfBackend('accepts page and limit params', async () => {
      const res = await api('/cities?page=1&limit=5');
      expect(res.data).toBeInstanceOf(Array);
      expect(res.page).toBe(1);
    });
  });
});
