# Logs — API Reference

Base: `/api/logs`

> **Acceso**: Requiere JWT de usuario con rol **ADMIN (3)** o superior.
> El token se envía como `Authorization: Bearer <token>` en REST, o como `?token=<jwt>` en SSE.

---

## `GET /api/logs/files`

Lista todos los archivos de log disponibles (globales + por módulo).

### Response 200
```json
[
  {
    "name": "combined-2026-06-11.log",
    "path": "combined-2026-06-11.log",
    "size": 2847,
    "modifiedAt": "2026-06-11T14:30:22.000Z"
  },
  {
    "name": "error-2026-06-11.log",
    "path": "error-2026-06-11.log",
    "size": 523,
    "modifiedAt": "2026-06-11T14:30:22.000Z"
  },
  {
    "name": "HTTP-2026-06-11.log",
    "path": "modules/HTTP-2026-06-11.log",
    "module": "HTTP",
    "size": 12450,
    "modifiedAt": "2026-06-11T14:30:22.000Z"
  },
  {
    "name": "CitiesService-2026-06-11.log",
    "path": "modules/CitiesService-2026-06-11.log",
    "module": "CitiesService",
    "size": 890,
    "modifiedAt": "2026-06-11T14:30:22.000Z"
  }
]
```

### Fields

| Campo | Tipo | Descripción |
|---|---|---|
| `name` | string | Nombre del archivo |
| `path` | string | Ruta relativa para usar en otros endpoints |
| `module` | string | *Solo en archivos de módulo* — nombre del contexto |
| `size` | number | Tamaño en bytes |
| `modifiedAt` | string | ISO 8601 de última modificación |

---

## `GET /api/logs/files/:filename`

Lee el contenido de un archivo con paginación.

### Query Parameters

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `offset` | number | `0` | Línea desde la que empezar |
| `limit` | number | `100` | Máximo de líneas a devolver |

### Response 200
```json
// GET /api/logs/files/combined-2026-06-11.log?offset=0&limit=2
{
  "lines": [
    "{\"timestamp\":\"2026-06-11 14:30:22.123\",\"level\":\"info\",\"message\":\"▶\",\"context\":\"HTTP\",\"service\":\"nestjs-backend\",\"correlationId\":\"abc123\",\"method\":\"POST\",\"route\":\"/api/auth/login\",\"ip\":\"::1\",\"body\":\"{\\\"email\\\":\\\"...\\\",\\\"password\\\":\\\"******\\\"}\"}",
    "{\"timestamp\":\"2026-06-11 14:30:22.168\",\"level\":\"info\",\"message\":\"✔\",\"context\":\"HTTP\",\"service\":\"nestjs-backend\",\"correlationId\":\"abc123\",\"method\":\"POST\",\"route\":\"/api/auth/login\",\"statusCode\":200,\"duration\":45,\"ip\":\"::1\"}"
  ],
  "total": 2
}
```

| Campo | Tipo | Descripción |
|---|---|---|
| `lines` | string[] | Líneas del archivo (cada línea es un JSON) |
| `total` | number | Total de líneas en el archivo (no solo las devueltas) |

---

## `GET /api/logs/files/:filename/search`

Busca texto dentro de un archivo (case-insensitive).

### Query Parameters

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `q` | string | — | Texto a buscar |
| `limit` | number | `100` | Máximo de resultados |

### Response 200
```json
// GET /api/logs/files/combined-2026-06-11.log/search?q=error&limit=5
{
  "lines": [
    "{\"timestamp\":\"...\",\"level\":\"error\",\"message\":\"✖\",\"context\":\"HTTP\",...}",
    "{\"timestamp\":\"...\",\"level\":\"error\",\"message\":\"✖ 500 Error interno\",\"context\":\"ExceptionFilter\",...}"
  ],
  "total": 2
}
```

---

## `DELETE /api/logs/files/:filename`

Elimina un archivo de log.

### Response 200
Sin body.

---

## `DELETE /api/logs/cleanup`

Fuerza la limpieza manual de archivos de log con más de 30 días de antigüedad.

### Response 200
```json
{
  "deleted": 5
}
```

---

## `GET /api/logs/stream` (SSE)

Stream en tiempo real de logs vía **Server-Sent Events**.

**Importante**: Como `EventSource` nativo no permite cabeceras personalizadas, el JWT se pasa como query param `?token=`.

```
GET /api/logs/stream?token=<jwt>&level=error&module=HTTP
```

### Query Parameters

| Parámetro | Tipo | Descripción |
|---|---|---|
| `token` | string | **Requerido** — JWT del usuario autenticado |
| `level` | string | Filtro opcional: `info`, `warn`, `error`, `debug` |
| `module` | string | Filtro opcional: nombre del contexto (ej: `HTTP`, `AuthService`, `CitiesService`) |

### Consumo desde el front

```typescript
// Ejemplo con EventSource nativo
const url = new URL('http://localhost:6543/api/logs/stream');
url.searchParams.set('token', jwtToken);
url.searchParams.set('level', 'error');

const evtSource = new EventSource(url.toString());

evtSource.addEventListener('log', (event) => {
  const logEntry = JSON.parse(event.data);
  console.log(logEntry.level, logEntry.message, logEntry.context);
});

evtSource.addEventListener('error', (event) => {
  console.error('SSE error', event);
});
```

```typescript
// Ejemplo con fetch + ReadableStream (alternativa con headers)
const response = await fetch(
  `http://localhost:6543/api/logs/stream?token=${jwtToken}`,
  { headers: { Authorization: `Bearer ${jwtToken}` } },
);
const reader = response.body.getReader();
// ... procesar stream
```

### Formato de cada evento SSE

Cada evento SSE tiene `type: "log"` y `data` con un JSON:

```json
{
  "timestamp": "2026-06-11 14:30:22.168",
  "level": "info",
  "message": "✔",
  "context": "HTTP",
  "service": "nestjs-backend",
  "correlationId": "m1k2a3b4c5d6",
  "method": "POST",
  "route": "/api/auth/login",
  "statusCode": 200,
  "duration": 45,
  "ip": "::1"
}
```

### Campos del evento

| Campo | Tipo | Aparece en | Descripción |
|---|---|---|---|
| `timestamp` | string | siempre | `YYYY-MM-DD HH:mm:ss.SSS` |
| `level` | string | siempre | `info`, `warn`, `error`, `debug`, `verbose` |
| `message` | string | siempre | El mensaje o indicador (`▶`, `✔`, `⚠`, `✖`) |
| `context` | string | siempre | Módulo que emitió el log (`HTTP`, `AuthService`, `ExceptionFilter`, etc.) |
| `service` | string | siempre | `"nestjs-backend"` |
| `correlationId` | string | HTTP | ID único por request para correlacionar entrada/salida |
| `method` | string | HTTP | `GET`, `POST`, `PATCH`, `DELETE` |
| `route` | string | HTTP | Ruta del endpoint (ej: `/api/auth/login`) |
| `statusCode` | number | HTTP response | Código HTTP de respuesta |
| `duration` | number | HTTP response | Duración en milisegundos |
| `ip` | string | HTTP | IP del cliente |
| `body` | string | HTTP request | Body sanitizado (passwords ocultos con `******`) |
| `trace` | string | errores | Stack trace (solo en errores) |
