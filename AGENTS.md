# AGENTS.md

## Dev Commands

```bash
pnpm dev         # Start dev server
pnpm build       # Production build (single-file output via vite-plugin-singlefile)
pnpm preview     # Preview production build
```

## Build Notes

- `vite-plugin-singlefile` embeds all assets into a single HTML file (no separate JS/CSS)
- Output: `dist/index.html` with embedded bundles

## Path Alias

- `@` maps to `src/` (configured in `vite.config.ts` and `tsconfig.json`)

## Architecture

### Views

All admin CRUD views live under `src/views/admin/` organized in self-contained folders:

| View | Files | Pattern |
|------|-------|---------|
| `users/` | `UsersView.tsx` | Inline CRUD (no detail) |
| `employees/` | `EmployeesView.tsx` + `EmployeesDetailView.tsx` | View + Detail |
| `vehicles/` | `VehiclesView.tsx` + `VehiclesDetailView.tsx` | View + Detail |

Also: `login/`, `dashboard/`, `utils/` (tests + logs), `errors/` (AccessDeniedView).

### State (Contexts)

| Context | Hook | Provides | Used By |
|---------|------|----------|---------|
| `AuthContext` | `useAuth()` | `user`, `login`, `logout`, `hasRole`, `triggerToast` | All views |
| `UserContext` | `useUsers()` | `users`, `createUser`, `updateUser`, `deleteUser` | `UsersView` |
| `EmployeeContext` | `useEmployees()` | `employees`, `getEmployeeOverviews()`, `getEmployeeById()`, CRUD | `EmployeesView`, `EmployeesDetailView` |
| `VehicleContext` | `useVehicles()` | `vehicles`, `getVehicleOverviews()`, `getVehicleById()`, CRUD | `VehiclesView`, `VehiclesDetailView` |

Two context patterns:
- **Simple** (`UserContext`): exposes full entity array + direct CRUD
- **Overview** (`EmployeeContext`, `VehicleContext`): exposes `getOverviews()` (lightweight) + `getById()` (full entity) + CRUD

### ID Format Convention

All entity IDs follow a consistent pattern — `{prefix}_{6-digit-zero-padded}`:

| Entity | Prefix | Example | Notes |
|--------|--------|---------|-------|
| User | (none) | `a1b2c3d4-e5f6-47a7-b8i9-0k1l2m3n4o5p` | Raw UUID, no prefix |
| Employee | (none) | `000001` | Bare 6-digit zero-padded |
| Work Report | `wr_` | `wr_000001` | 6-digit zero-padded |
| Vehicle | `vh_` | `vh_000001` | 6-digit zero-padded |
| Service | `sv_` | `sv_000001` | 6-digit zero-padded |
| ServiceTask | `st_` | `st_000001` | 6-digit zero-padded |
| ServiceReport | `sr_` | `sr_000001` | 6-digit zero-padded |
| WorkCenter | `wc_` | `wc_000001` | 6-digit zero-padded |
| City | `ci_` | `ci_000001` | 6-digit zero-padded |
| EmployeeCategory | `ec_` | `ec_000001` | 6-digit zero-padded |
| EmployeeStatus | `es_` | `es_1` | **Not zero-padded** |
| Shift | `s_` | `s_1` | **Not zero-padded** |
| WorkDay | `wd_` | `wd_1` | **Not zero-padded** |
| ContractType | `ct_` | `ct_1` | **Not zero-padded** |
| VehicleType | `vt-` | `vt-1` | **Hyphen separator, not zero-padded** |
| InventoryItem | `inv_` | `inv_000001` | 6-digit zero-padded |
| InventoryCategory | `ic-` | `ic-1` | **Hyphen, not zero-padded** (frontend-only; DB uses ENUM) |
| InventorySubtype | `ist-` | `ist-1` | **Hyphen, not zero-padded** |
| InventoryStatus | `rs-`/`es-` | `rs-1` | **Hyphen, not zero-padded** (`rs-` = repair status, `es-` = exit status) |
| Machinery | `mch_` | `mch_000001` | 6-digit zero-padded |
| MachinerySubtype | `mst-` | `mst-1` | **Hyphen, not zero-padded** |
| MachineryStatus | `ms-` | `ms-1` | **Hyphen, not zero-padded** |
| EmployeeSchedule | `esch_` | `esch_000001` | 6-digit zero-padded (1:1 with employee) |
| EmployeeContract | `econ_` | `econ_000001` | 6-digit zero-padded (1:1 with employee) |
| EmployeePayroll | `epay_` | `epay_000001` | 6-digit zero-padded (1:1 with employee) |
| EmployeeExtras | `eext_` | `eext_000001` | 6-digit zero-padded (1:1 with employee) |
| EmployeeSize | `esiz_` | `esiz_000001` | 6-digit zero-padded |
| EmployeeLeaveBalance | `elb_` | `elb_000001` | 6-digit zero-padded |
| EmployeeDrivingLicense | `edl_` | `edl_000001` | 6-digit zero-padded |
| EmployeeDocument | `edoc_` | `edoc_000001` | 6-digit zero-padded |
| EmployeeClothing | `ecl_` | `ecl_000001` | 6-digit zero-padded |
| VacationRequest | `vr_` | `vr_000001` | 6-digit zero-padded |
| VacationRequestDay | `vrd_` | `vrd_000001` | 6-digit zero-padded |
| LeaveRequest | `lr_` | `lr_000001` | 6-digit zero-padded |
| LeaveType | `lt-` | `lt-1` | **Hyphen, not zero-padded** |
| Size (clothing/shoe) | `sz-` | `sz-1` | **Hyphen, not zero-padded** |
| AdvancePayment | `ap_` | `ap_000001` | 6-digit zero-padded |
| RepayableLoan | `rl_` | `rl_000001` | 6-digit zero-padded |
| SocialFundRequest | `sfr_` | `sfr_000001` | 6-digit zero-padded |
| Sabbatical | `sab_` | `sab_000001` | 6-digit zero-padded |
| SabbaticalType | `et-` | `et-1` | **Hyphen, not zero-padded** |

### Mock Data

`src/data/mock{Entity}s.ts` — each exports `INITIAL_ENTITIES` + lookup arrays (statuses, categories, work centers, etc.)

| File | Lookup Exports |
|------|---------------|
| `mockUsers.ts` | — |
| `mockEmployees.ts` | `INITIAL_EMPLOYEE_CATEGORIES`, `INITIAL_EMPLOYEE_STATUSES`, `INITIAL_WORK_CENTERS`, `INITIAL_WORK_DAYS`, `INITIAL_CONTRACT_TYPES`, `INITIAL_CITIES`, `INITIAL_SHIFTS` |
| `mockVehicles.ts` | `INITIAL_VEHICLE_TYPES` |

### Types

`src/types/` — each entity has its own file, re-exported via `index.ts`:

| File | Key Types |
|------|-----------|
| `user.ts` | `User`, `UserRole` |
| `employee.ts` | `Employee`, `EmployeeOverview`, `EmployeeCategory`, `EmployeeStatus`, `WorkDay`, `Shift`, `ContractType`, `ClothingSizes`, `ClothingSize`, `ShoeSize` |
| `vehicle.ts` | `Vehicle`, `VehicleOverview`, `VehicleType`, `VehicleStatus`, `FuelType`, `VehicleTypeOption` |
| `view.ts` | `DashboardViewType` (union of all view identifiers) |
| `index.ts` | Re-exports all |

### Shared Components

- `src/components/modals/{Entity}FormModal.tsx` — one per entity (UserFormModal, EmployeeFormModal, VehicleFormModal)
- `src/components/modals/ConfirmDialog.tsx` — shared delete confirmation
- `src/components/Header.tsx`, `Sidebar.tsx`, `Toast.tsx` — app shell

### App Routing (`src/App.tsx`)

- `DashboardViewType` union type drives all routing (no react-router — state-based)
- `VIEW_ROUTES`: maps view types to URL-like strings (metadata only)
- `VIEW_ROLES`: maps view types to allowed roles for RBAC gating
- `renderContent()`: switch-case rendering each view
- Detail navigation: parent stores `selectedEmployeeId`/`selectedVehicleId` and renders DetailView when `currentView === '{ENTITY}_DETAIL'`

### CRUD Patterns

Two patterns exist (documented in `.customSkills/list.md` for cloning):

1. **UsersView pattern** — single file, inline CRUD, `UserFormModal`, toggle status switch, avatar via dicebear API
2. **EmployeesView/VehiclesView pattern** — view + detail, `onViewEntity` prop, gradient header, `SectionCard`/`InfoRow` composition, `ConfirmDialog`

Both share: search bar, mobile filters (lg:hidden), sidebar filters (lg:flex), pagination (10/25/50), RBAC guard (read-only for USER role), `useEffect` reset page on filter change.

### Dependencies

- React 19, Vite 7, Tailwind CSS 4, TypeScript 5.9
- `clsx`, `tailwind-merge` for className utility
- `lucide-react` for icons (primary icon library)
- `vite-plugin-singlefile` for single-file builds

## TypeScript

- Strict mode enabled (`strict: true`)
- No unused locals/parameters allowed

## Scaffolding CRUD Prompts

See [`.customSkills/list.md`](./.customSkills/list.md) for 3 reusable prompts to clone existing CRUD patterns:
1. Clone `UsersView` (simple, single-file)
2. Clone `EmployeesView` + `EmployeesDetailView` (view + detail)
3. Tab with table inside an existing view (interactive)

## Repository Best Practices

### Git Workflow

- **Branch naming**: `feature/<nombre>` para nuevas funcionalidades, `fix/<nombre>` para bugs, `refactor/<nombre>` para reestructuraciones
- **Commits**: mensajes siempre en español, presente imperativo, máximo 72 caracteres en el título. Ej: `"feat: agregar vista CRUD de proveedores"` o `"fix: resetear paginación al cambiar filtro"`
- **Commits atómicos**: un commit por cambio lógico. No mezclar formateo con lógica, ni funcionalidades no relacionadas
- **No commits directos a main/master**: siempre usar ramas + PR (pull request). Las interacciones con IA también deben crear un branch nuevo para los cambios. Solo se permite commit directo a main si el usuario lo solicita explícitamente.
- **PRs**: título descriptivo, cuerpo con qué y por qué, referenciar issues si aplica

### Code Hygiene

- **TypeScript strict**: respetar `strict: true`. No usar `any` — preferir `unknown` + type guard si es necesario
- **No comentarios en código**: el código debe ser auto-documentado. Excepciones: JSDoc en APIs públicas, comentarios `eslint-disable` justificados
- **Importar sólo lo necesario**: no imports de `lucide-react` completos, solo los iconos específicos
- **Tailwind**: usar `clsx`/`tailwind-merge` para clases condicionales. No duplicar estilos entre componentes
- **Idioma**: el código (variables, funciones, tipos, props, archivos) se escribe en **inglés**. Los textos de UI, nombres de entidades, placeholders, notificaciones y cualquier string visible al usuario van en **castellano**

### File Organization

- **Nueva entidad CRUD**: crear carpeta propia en `src/views/admin/` con todos sus archivos (View + Detail si aplica)
- **Context + Types + Mock + Modal**: cada entidad tiene su propio archivo en la carpeta correspondiente (`src/context/`, `src/types/`, `src/data/`, `src/components/modals/`)
- **Singular vs plural**: los nombres de carpeta y archivo en plural (`users/`, `employees/`), los tipos y componentes en singular (`User`, `EmployeeFormModal`)
- **No archivos huérfanos**: toda nueva funcionalidad debe integrarse en `App.tsx` (Provider, ViewType, ruta, roles, renderContent) y opcionalmente en `Sidebar.tsx`

### Dependencies

- **Package manager**: usar exclusivamente `pnpm` — no mezclar con `npm` o `yarn`
- **No commits de lockfile innecesarios**: solo cuando hay cambios reales de dependencias
- **No instalar dependencias globales**: todo debe ir en `devDependencies` o `dependencies` del proyecto

## Preferencias personales

Ver [`.customSkills/on3.md`](./.customSkills/on3.md) para gustos personales del desarrollador (interacciones con git, filosofía de trabajo). Este archivo prevalece sobre reglas genéricas en caso de conflicto.