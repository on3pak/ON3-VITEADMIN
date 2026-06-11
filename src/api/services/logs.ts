import { api, getToken } from '../client';

export interface LogFileInfo {
  name: string;
  path: string;
  module?: string;
  size: number;
  modifiedAt: string;
}

export interface LogFileContent {
  lines: string[];
  total: number;
}

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  context: string;
  service: string;
  correlationId?: string;
  method?: string;
  route?: string;
  statusCode?: number;
  duration?: number;
  ip?: string;
  body?: string;
  trace?: string;
}

export const logsApi = {
  getFiles: () =>
    api.get<LogFileInfo[]>('/logs/files'),

  getFileContent: (filename: string, offset?: number, limit?: number) =>
    api.get<LogFileContent>(`/logs/files/${encodeURIComponent(filename)}`, { offset, limit }),

  searchFile: (filename: string, q: string, limit?: number) =>
    api.get<LogFileContent>(`/logs/files/${encodeURIComponent(filename)}/search`, { q, limit }),

  deleteFile: (filename: string) =>
    api.delete('/logs/files', filename),

  cleanupOld: () =>
    api.deletePath<{ deleted: number }>('/logs/cleanup'),

  getStreamUrl: (token: string, level?: string, module?: string): string => {
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:6543';
    const url = new URL(`${baseUrl}/api/logs/stream`);
    url.searchParams.set('token', token);
    if (level) url.searchParams.set('level', level);
    if (module) url.searchParams.set('module', module);
    return url.toString();
  },
};
