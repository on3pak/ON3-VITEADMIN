export interface ApiPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiErrorResponse {
  success: boolean;
  statusCode: number;
  message: string[];
  timestamp: string;
  error?: string;
}

export type ApiResponse<T> = T;

export type ApiListResponse<T> = ApiPaginatedResponse<T>;

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    sub: string;
    email: string;
    role: string;
    employee_id: string | null;
    city_id: string | null;
    token_version: number;
  };
  employee: Record<string, unknown> | null;
}
