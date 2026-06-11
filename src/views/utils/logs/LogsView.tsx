import React, { useState, useEffect, useRef } from 'react';
import { logsApi, type LogFileInfo, type LogEntry } from '../../../api/services';
import { getToken } from '../../../api/client';
import { useAuth } from '../../../context/AuthContext';
import { ConfirmDialog } from '../../../components/modals/ConfirmDialog';
import { Search, RefreshCw, Trash2, Radio, RadioOff, ChevronDown, ChevronRight, Loader2, FileText } from 'lucide-react';

interface LogsViewProps {
  logType?: string;
}

type TabKey = 'all' | 'auth' | 'logout' | 'users' | 'employees';

interface TabDef {
  key: TabKey;
  label: string;
  module?: string;
  query?: string;
}

const TABS: TabDef[] = [
  { key: 'all', label: 'Todos' },
  { key: 'auth', label: 'Auth', module: 'AuthService' },
  { key: 'logout', label: 'Logout', query: 'logout' },
  { key: 'users', label: 'Usuarios', module: 'UsersService' },
  { key: 'employees', label: 'Empleados', module: 'EmployeesService' },
];

const LEVEL_ROW_STYLES: Record<string, string> = {
  error: 'border-l-red-500 bg-red-50/40 hover:bg-red-50/80',
  warn: 'border-l-amber-500 bg-amber-50/30 hover:bg-amber-50/70',
  info: 'border-l-blue-500 bg-blue-50/20 hover:bg-blue-50/50',
  debug: 'border-l-gray-400 bg-gray-50/20 hover:bg-gray-50/60',
  verbose: 'border-l-gray-400 bg-gray-50/20 hover:bg-gray-50/60',
};

const LEVEL_BADGE: Record<string, string> = {
  error: 'bg-red-100 text-red-700',
  warn: 'bg-amber-100 text-amber-700',
  info: 'bg-blue-100 text-blue-700',
  debug: 'bg-gray-200 text-gray-600',
  verbose: 'bg-gray-200 text-gray-600',
};

const LEVEL_DOT: Record<string, string> = {
  error: 'bg-red-500',
  warn: 'bg-amber-500',
  info: 'bg-blue-500',
  debug: 'bg-gray-400',
  verbose: 'bg-gray-400',
};

const PAGE_SIZE = 100;
const MAX_SSE_ENTRIES = 500;

function parseLogEntry(raw: string): LogEntry | null {
  try {
    return JSON.parse(raw) as LogEntry;
  } catch {
    return null;
  }
}

function formatTimestamp(ts?: string): string {
  if (!ts) return '—';
  try {
    const d = new Date(ts);
    return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return ts;
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileForTab(tab: TabDef, files: LogFileInfo[]): string | null {
  if (tab.module) {
    const mf = files.find(f => f.module === tab.module || f.name.includes(tab.module));
    if (mf) return mf.path;
  }
  return files.find(f => f.name.startsWith('combined-'))?.path || null;
}

function hasModuleFile(tab: TabDef, files: LogFileInfo[]): boolean {
  if (!tab.module) return false;
  return files.some(f => f.module === tab.module || f.name.includes(tab.module));
}

export const LogsView: React.FC<LogsViewProps> = ({ logType }) => {
  const { user, triggerToast } = useAuth();
  const isAdmin = user?.role === 'ROOT' || user?.role === 'ADMIN';

  const [files, setFiles] = useState<LogFileInfo[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [offset, setOffset] = useState(0);
  const [lines, setLines] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [sseConnected, setSseConnected] = useState(false);
  const [sseEntries, setSseEntries] = useState<LogEntry[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [cleaningUp, setCleaningUp] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fetchIdRef = useRef(0);

  useEffect(() => {
    if (logType) {
      const map: Record<string, TabKey> = {
        LOGS_AUTH: 'auth',
        LOGS_LOGOUT: 'logout',
        LOGS_USERS: 'users',
        LOGS_EMPLOYEES: 'employees',
      };
      setActiveTab(map[logType] || 'all');
    }
  }, [logType]);

  useEffect(() => {
    logsApi.getFiles()
      .then(setFiles)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (files.length === 0) return;

    const tab = TABS.find(t => t.key === activeTab);
    if (!tab) return;

    const filename = getFileForTab(tab, files);
    if (!filename) {
      setSelectedFile(null);
      setLines([]);
      setTotal(0);
      return;
    }

    setSelectedFile(filename);
    setLoading(true);
    setError(null);

    const thisFetch = ++fetchIdRef.current;

    const doFetch = async () => {
      try {
        let result;

        if (searchQuery) {
          result = await logsApi.searchFile(filename, searchQuery, PAGE_SIZE);
        } else if (tab.query) {
          result = await logsApi.searchFile(filename, tab.query, PAGE_SIZE);
        } else if (tab.module) {
          if (hasModuleFile(tab, files)) {
            result = await logsApi.getFileContent(filename, offset, PAGE_SIZE);
          } else {
            result = await logsApi.searchFile(filename, tab.module, PAGE_SIZE);
          }
        } else {
          result = await logsApi.getFileContent(filename, offset, PAGE_SIZE);
        }

        if (thisFetch === fetchIdRef.current) {
          setLines(result.lines);
          setTotal(result.total);
        }
      } catch (err) {
        if (thisFetch === fetchIdRef.current) {
          setError(err instanceof Error ? err.message : 'Error al cargar logs');
          setLines([]);
          setTotal(0);
        }
      } finally {
        if (thisFetch === fetchIdRef.current) {
          setLoading(false);
        }
      }
    };

    doFetch();
  }, [activeTab, searchQuery, offset, files]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setOffset(0);
    setExpandedRows(new Set());
  };

  const handleTabChange = (key: TabKey) => {
    setActiveTab(key);
    setSearchQuery('');
    setOffset(0);
    setExpandedRows(new Set());
    setSseEntries([]);
  };

  const toggleRow = (idx: number) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

  const goToPage = (page: number) => {
    const newOffset = (page - 1) * PAGE_SIZE;
    if (newOffset !== offset) {
      setOffset(newOffset);
      setExpandedRows(new Set());
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRefresh = () => {
    setLines([]);
    setTotal(0);
    fetchIdRef.current++;
  };

  const toggleSse = () => {
    if (sseConnected) {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      setSseConnected(false);
      return;
    }

    const token = getToken();
    if (!token) return;

    const tab = TABS.find(t => t.key === activeTab);
    const url = logsApi.getStreamUrl(
      token,
      undefined,
      tab?.module || undefined,
    );

    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.addEventListener('log', (event) => {
      try {
        const entry = JSON.parse(event.data) as LogEntry;
        setSseEntries(prev => {
          const next = [entry, ...prev];
          return next.slice(0, MAX_SSE_ENTRIES);
        });
      } catch {
        // skip malformed
      }
    });

    es.addEventListener('error', () => {
      es.close();
      setSseConnected(false);
    });

    setSseConnected(true);
  };

  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  const handleDeleteFile = async () => {
    if (!deleteTarget) return;
    try {
      await logsApi.deleteFile(deleteTarget);
      triggerToast('Archivo eliminado', 'success');
      setDeleteTarget(null);
      setSelectedFile(null);
      setLines([]);
      setTotal(0);
      fetchIdRef.current++;
      const data = await logsApi.getFiles();
      setFiles(data);
    } catch {
      triggerToast('Error al eliminar archivo', 'error');
    }
  };

  const handleCleanup = async () => {
    setCleaningUp(true);
    try {
      const result = await logsApi.cleanupOld();
      triggerToast(`${result.deleted} archivo(s) eliminado(s)`, 'success');
      const data = await logsApi.getFiles();
      setFiles(data);
    } catch {
      triggerToast('Error al limpiar logs antiguos', 'error');
    } finally {
      setCleaningUp(false);
    }
  };

  const renderToolbar = () => (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative grow max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-text-secondary" />
        <input
          type="text"
          placeholder="Buscar en logs..."
          value={searchQuery}
          onChange={e => handleSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border border-app-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
        />
      </div>

      <button
        onClick={handleRefresh}
        title="Recargar"
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-app-text-secondary border border-app-border rounded-xl hover:bg-app-bg transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Recargar
      </button>

      <button
        onClick={toggleSse}
        className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border rounded-xl transition-colors ${
          sseConnected
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'text-app-text-secondary border-app-border hover:bg-app-bg'
        }`}
      >
        {sseConnected ? <Radio className="w-4 h-4" /> : <RadioOff className="w-4 h-4" />}
        {sseConnected ? 'En vivo' : 'Tiempo real'}
      </button>

      {isAdmin && selectedFile && (
        <button
          onClick={() => setDeleteTarget(selectedFile)}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Eliminar archivo
        </button>
      )}

      {isAdmin && (
        <button
          onClick={handleCleanup}
          disabled={cleaningUp}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-amber-600 border border-amber-200 rounded-xl hover:bg-amber-50 transition-colors disabled:opacity-50"
        >
          {cleaningUp ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
          Limpiar antiguos
        </button>
      )}
    </div>
  );

  const renderFileInfo = () => {
    if (!selectedFile || total === 0) return null;
    const fileInfo = files.find(f => f.path === selectedFile);
    return (
      <div className="flex items-center gap-3 text-xs text-app-text-secondary">
        <span className="font-mono">{selectedFile}</span>
        {fileInfo && (
          <>
            <span className="w-px h-3 bg-app-border" />
            <span>{formatBytes(fileInfo.size)}</span>
            <span className="w-px h-3 bg-app-border" />
            <span>{new Date(fileInfo.modifiedAt).toLocaleDateString('es-MX')}</span>
          </>
        )}
      </div>
    );
  };

  const renderSSEBanner = () => {
    if (sseEntries.length === 0) return null;
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-green-700">
          <Radio className="w-4 h-4" />
          <span className="font-medium">{sseEntries.length} evento(s) en vivo</span>
        </div>
        <button
          onClick={() => setSseEntries([])}
          className="text-xs text-green-600 hover:text-green-800 underline"
        >
          Limpiar
        </button>
      </div>
    );
  };

  const renderLogRow = (raw: string, idx: number) => {
    const entry = parseLogEntry(raw);
    const level = entry?.level || 'info';
    const rowStyle = LEVEL_ROW_STYLES[level] || LEVEL_ROW_STYLES.info;
    const dotStyle = LEVEL_DOT[level] || LEVEL_DOT.info;
    const isExpanded = expandedRows.has(idx);

    return (
      <div key={`${offset + idx}`}>
        <div
          onClick={() => toggleRow(idx)}
          className={`flex items-start gap-2 px-4 py-2.5 border-l-4 cursor-pointer transition-colors ${rowStyle}`}
        >
          <div className="pt-0.5 shrink-0">
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-app-text-secondary" /> : <ChevronRight className="w-3.5 h-3.5 text-app-text-secondary" />}
          </div>

          <div className="flex items-center gap-2 w-20 shrink-0">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotStyle}`} />
            <span className={`text-[11px] font-semibold uppercase px-1.5 py-0.5 rounded ${LEVEL_BADGE[level] || LEVEL_BADGE.info}`}>
              {level}
            </span>
          </div>

          <span className="text-xs text-app-text-secondary font-mono w-20 shrink-0">{formatTimestamp(entry?.timestamp)}</span>

          {entry?.correlationId && (
            <span className="text-[11px] text-app-text-secondary font-mono w-24 truncate shrink-0" title={entry.correlationId}>
              {entry.correlationId.slice(0, 8)}…
            </span>
          )}

          {entry?.method && (
            <span className="text-[11px] font-mono text-app-text-secondary w-14 shrink-0">{entry.method}</span>
          )}

          {entry?.statusCode && (
            <span className={`text-[11px] font-mono font-semibold w-10 shrink-0 ${
              entry.statusCode >= 500 ? 'text-red-600' :
              entry.statusCode >= 400 ? 'text-amber-600' :
              entry.statusCode >= 300 ? 'text-blue-600' :
              'text-green-600'
            }`}>
              {entry.statusCode}
            </span>
          )}

          <span className="text-[11px] text-app-text-secondary font-mono w-24 truncate shrink-0" title={entry?.context}>
            {entry?.context}
          </span>

          <span className="text-sm text-app-text truncate min-w-0 leading-5">{entry?.message || raw}</span>

          {entry?.duration !== undefined && (
            <span className="text-[11px] text-app-text-secondary font-mono shrink-0 ml-auto">{entry.duration}ms</span>
          )}
        </div>

        {isExpanded && (
          <div className="bg-gray-50 border-t border-app-border px-4 py-3">
            <pre className="text-[11px] font-mono text-app-text-secondary whitespace-pre-wrap break-all leading-relaxed">
              {JSON.stringify(entry || raw, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-app-border pb-2">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => handleTabChange(t.key)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              activeTab === t.key
                ? 'bg-primary-100 text-primary-700'
                : 'text-app-text-secondary hover:text-app-text hover:bg-app-bg'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      {renderToolbar()}

      {/* SSE banner */}
      {renderSSEBanner()}

      {/* File info */}
      {renderFileInfo()}

      {/* Content */}
      <div ref={scrollRef} className="bg-white border border-app-border rounded-xl overflow-hidden min-h-[300px] max-h-[600px] overflow-y-auto">
        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
            <p className="text-sm text-app-text-secondary">Cargando logs...</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={handleRefresh}
              className="text-sm text-primary-600 hover:text-primary-700 underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* SSE entries */}
        {!loading && !error && sseEntries.length > 0 && (
          <div className="border-b border-green-200">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-green-700 bg-green-50 uppercase tracking-wider">
              Eventos en vivo
            </div>
            {sseEntries.map((entry, i) => (
              <div key={`sse-${i}`} className="border-b border-green-100 last:border-b-0">
                <div className={`px-4 py-2 flex items-center gap-2 border-l-4 ${LEVEL_ROW_STYLES[entry.level] || LEVEL_ROW_STYLES.info}`}>
                  <span className={`text-[11px] font-semibold uppercase px-1.5 py-0.5 rounded ${LEVEL_BADGE[entry.level] || LEVEL_BADGE.info}`}>
                    {entry.level}
                  </span>
                  <span className="text-xs text-app-text-secondary font-mono">{formatTimestamp(entry.timestamp)}</span>
                  <span className="text-[11px] text-app-text-secondary font-mono">{entry.context}</span>
                  <span className="text-sm text-app-text truncate">{entry.message}</span>
                  {entry.duration !== undefined && (
                    <span className="text-[11px] text-app-text-secondary font-mono ml-auto">{entry.duration}ms</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Log lines */}
        {!loading && !error && lines.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <FileText className="w-8 h-8 text-app-text-secondary/40" />
            <p className="text-sm text-app-text-secondary">
              {searchQuery ? 'Sin resultados para esta búsqueda' : 'No hay logs disponibles'}
            </p>
          </div>
        )}

        {!loading && !error && lines.length > 0 && (
          <div className="divide-y divide-app-border/50">
            {lines.map((raw, idx) => renderLogRow(raw, idx))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && total > PAGE_SIZE && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-app-text-secondary">
            {total} línea(s) — Página {currentPage} de {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage <= 1}
              className="px-2.5 py-1.5 text-xs font-medium border border-app-border rounded-lg hover:bg-app-bg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Primera
            </button>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-2.5 py-1.5 text-xs font-medium border border-app-border rounded-lg hover:bg-app-bg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <span className="px-3 py-1.5 text-xs font-mono text-app-text-secondary">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-2.5 py-1.5 text-xs font-medium border border-app-border rounded-lg hover:bg-app-bg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage >= totalPages}
              className="px-2.5 py-1.5 text-xs font-medium border border-app-border rounded-lg hover:bg-app-bg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Última
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Eliminar archivo de log"
        message={`¿Estás seguro de eliminar "${deleteTarget}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        onConfirm={handleDeleteFile}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
