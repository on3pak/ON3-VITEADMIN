import { API_BASE_URL, API_BASE_URL_FALLBACK, STORAGE_KEYS } from '../config';
import type { ApiErrorResponse, ApiPaginatedResponse } from './types';

const MAX_RETRIES = 3;

let activeBaseUrl: string | null = null;

function setActiveBaseUrl(url: string): void {
  if (activeBaseUrl === url) return;
  activeBaseUrl = url;
  const env = url.includes('localhost') ? 'localhost' : '192.168.1.9 (Docker)';
  console.log(`[API] Conectado a: ${env}`);
}

class ApiError extends Error {
  constructor(
    public statusCode: number,
    public messages: string[],
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
  if (res.status === 401 && getToken()) {
    let errMsg = 'Sesión expirada. Inicia sesión de nuevo.';
    try {
      const body = await res.json();
      if (body.message) errMsg = Array.isArray(body.message) ? body.message.join('. ') : body.message;
      else if (body.error) errMsg = body.error;
    } catch { /* fallback to default message */ }
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    localStorage.setItem('on3_auth_error', errMsg);
    window.location.reload();
    throw new ApiError(401, [errMsg], 'Unauthorized');
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
      errorBody.error || errorBody.message?.join('; ') || res.statusText,
    );
  }

  if (res.status === 204) return undefined as T;
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text);
}

function buildUrl(path: string, params?: Record<string, string | number | undefined>, baseUrl?: string): string {
  const url = new URL(`${baseUrl ?? API_BASE_URL}${path}`);
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
    skipAuth401?: boolean;
  },
): Promise<T> {
  const headers = buildHeaders(options?.headers);

  async function doFetch(baseUrl: string): Promise<Response> {
    const url = buildUrl(path, options?.params, baseUrl);
    return fetch(url, {
      method,
      headers,
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });
  }

  let res: Response;
  let lastNetworkError: unknown;

  if (activeBaseUrl === null || activeBaseUrl === API_BASE_URL) {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        res = await doFetch(API_BASE_URL);
        setActiveBaseUrl(API_BASE_URL);
        if (options?.skipAuth401 && res.status === 401) {
          throw new ApiError(401, ['Sesión expirada'], 'Unauthorized');
        }
        return handleResponse<T>(res);
      } catch (e) {
        if (e instanceof ApiError && e.statusCode !== 0) {
          throw e;
        }
        lastNetworkError = e;
        if (attempt < MAX_RETRIES) continue;

      }
    }
  }

  setActiveBaseUrl(API_BASE_URL_FALLBACK);
  try {
    res = await doFetch(API_BASE_URL_FALLBACK);
  } catch {
    throw lastNetworkError instanceof ApiError
      ? lastNetworkError
      : new ApiError(0, ['No se puede conectar con el servidor. Verifica tu conexión.'], 'ConnectionRefused');
  }

  if (options?.skipAuth401 && res.status === 401) {
    throw new ApiError(401, ['Sesión expirada'], 'Unauthorized');
  }

  return handleResponse<T>(res);
}

function postRaw<T>(path: string, body: unknown): Promise<T> {
  return request<T>('POST', path, { body, skipAuth401: true });
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

  upload: <T>(path: string, form: FormData) => {
    const headers: Record<string, string> = {};
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    async function doUpload(baseUrl: string, signal: AbortSignal): Promise<Response> {
      const url = buildUrl(path, undefined, baseUrl);
      return fetch(url, { method: 'POST', headers, body: form, signal });
    }

    return Promise.race([
      new Promise<never>((_, reject) => {
        const timeout = 60000;
        setTimeout(() => reject(new ApiError(0, ['La solicitud superó el tiempo de espera (60s).'], 'Timeout')), timeout);
      }),
      (async () => {
        const controller = new AbortController();
        const signal = controller.signal;
        let lastNetworkError: unknown;

        if (activeBaseUrl === null || activeBaseUrl === API_BASE_URL) {
          for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
              const res = await doUpload(API_BASE_URL, signal);
              setActiveBaseUrl(API_BASE_URL);
              return handleResponse<T>(res);
            } catch (e) {
              if (e instanceof ApiError) throw e;
              lastNetworkError = e;
              if (attempt < MAX_RETRIES) continue;
            }
          }
        }

        try {
          const res = await doUpload(API_BASE_URL_FALLBACK, signal);
          setActiveBaseUrl(API_BASE_URL_FALLBACK);
          return handleResponse<T>(res);
        } catch {
          controller.abort();
          throw lastNetworkError instanceof ApiError
            ? lastNetworkError
            : new ApiError(0, ['No se puede conectar con el servidor. Verifica tu conexión.'], 'ConnectionRefused');
        }
      })(),
    ]) as Promise<T>;
  },

  postRaw,
  ApiError,
};

export { getToken };
