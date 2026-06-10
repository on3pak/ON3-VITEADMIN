export interface ApiPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string[];
  error: string;
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
    id: string;
    email: string;
    role: 'ROOT' | 'ADMIN' | 'MANAGER' | 'USER';
    employee_id: string | null;
    city_id: string;
    full_name?: string;
  };
}
