export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:6543/api';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'on3_auth_token',
  AUTH_USER: 'on3_auth_user',
  DARK_MODE: 'on3_dark_mode',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 100,
} as const;
