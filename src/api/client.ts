import { API_BASE_URL, STORAGE_KEYS } from '../config';
import type { ApiErrorResponse, ApiPaginatedResponse } from './types';

class ApiError extends Error {
  constructor(
    public statusCode: number,
    messages: string[],
    public error: string,
  ) {
    super(messages.join('; '));
    this.name = 'ApiError';
  }
}

function getToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
}

function buildHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extra,
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    window.location.reload();
    throw new ApiError(401, ['Sesión expirada'], 'Unauthorized');
  }

  if (!res.ok) {
    let errorBody: ApiErrorResponse;
    try {
      errorBody = await res.json();
    } catch {
      throw new ApiError(res.status, [`HTTP ${res.status}: ${res.statusText}`], res.statusText);
    }
    throw new ApiError(
      errorBody.statusCode || res.status,
      errorBody.message || [res.statusText],
      errorBody.error || res.statusText,
    );
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

function buildUrl(path: string, params?: Record<string, string | number | undefined>): string {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

async function request<T>(
  method: string,
  path: string,
  options?: {
    body?: unknown;
    params?: Record<string, string | number | undefined>;
    headers?: Record<string, string>;
  },
): Promise<T> {
  const url = buildUrl(path, options?.params);
  const headers = buildHeaders(options?.headers);

  const res = await fetch(url, {
    method,
    headers,
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  return handleResponse<T>(res);
}

export const api = {
  get: <T>(path: string, params?: Record<string, string | number | undefined>) =>
    request<T>('GET', path, { params }),

  getList: <T>(path: string, params?: Record<string, string | number | undefined>) =>
    request<ApiPaginatedResponse<T>>('GET', path, { params }),

  getById: <T>(path: string, id: string) =>
    request<T>('GET', `${path}/${id}`),

  post: <T>(path: string, body: unknown) =>
    request<T>('POST', path, { body }),

  patch: <T>(path: string, id: string, body: unknown) =>
    request<T>('PATCH', `${path}/${id}`, { body }),

  delete: (path: string, id: string) =>
    request<void>('DELETE', `${path}/${id}`),

  ApiError,
};

export { getToken };
