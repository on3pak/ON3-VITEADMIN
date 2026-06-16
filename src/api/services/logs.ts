import { api } from '../client';

interface LogFile {
  id: string; filename: string; size: number; created_at: string;
}

interface LogEntry {
  timestamp: string; level: string; message: string; context?: Record<string, unknown>;
}

const BASE = '/logs';

export const logsApi = {
  listFiles: () =>
    api.getList<LogFile>(`${BASE}/files`),
  getFile: (id: string) =>
    api.get<string>(`${BASE}/files/${id}`),
  search: (params: { query?: string; level?: string; start_date?: string; end_date?: string; limit?: number }) =>
    api.getList<LogEntry>(`${BASE}/search`, params),
};
