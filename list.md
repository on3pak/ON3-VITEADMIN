
# Prompt 1 — Clonar vista estilo UsersView

```
Crea un CRUD completo en src/views/admin/{EntityName}/ clonando la estructura de src/views/admin/users/UsersView.tsx.

## Requisitos previos
Crea los siguientes archivos siguiendo los patrones de empleados existentes:
- src/types/{EntityName}.ts → interface {EntityName}, {EntityName}Overview (si aplica), y tipos literales (ej. {EntityName}Status, {EntityName}Category)
- Añade export en src/types/index.ts
- src/data/mock{EntityName}s.ts → exporta INITIAL_{ENTITY_NAME}S con datos mock, y arrays de lookup (ej. INITIAL_{ENTITY_NAME}_STATUSES, INITIAL_{ENTITY_NAME}_CATEGORIES)
- src/context/{EntityName}Context.tsx → Provider + use{EntityName} hook con create/update/delete, siguiendo UserContext o EmployeeContext pattern
- src/components/modals/{EntityName}FormModal.tsx → modal de formulario

## Vista (src/views/admin/{EntityName}s/{EntityName}sView.tsx)
Clona UsersView.tsx y modifica:

### Datos y columnas de tabla
- Columna 1 (identidad): avatar/image + nombre principal + fila secundaria (ID, email, etc.)
- Columna 2: badge de categoría/tipo (colores mapeados por ID)
- Columna 3: badge de estado (colores mapeados por ID) o toggle switch
- Columna(s) extra opcionales: métricas numéricas, fechas, etc.
- Columna de acciones: editar, eliminar (y ver si aplica)

### Búsqueda y filtros
- Placeholder de búsqueda coherente con la entidad
- Filtro mobile (lg:hidden): selects desplegables inline
- Sidebar filters (hidden lg:flex): botones de filtro por categoría y estado en columnas separadas
- Sidebar usa datos de los arrays de lookup exportados desde mock{EntityName}s.ts

### CRUD
- Modal de creación/edición: {EntityName}FormModal
- ConfirmDialog nativo (con las comprobaciones necesarias de alto impacto)
- RBAC: read-only cuando loggedInUser.role === 'USER', con banner amber

### Integración con App.tsx (modificar)
- Importar el Provider y envolver en App.tsx
- Añadir DashboardViewType: '{ENTITY_NAME}S_CRUD'
- Añadir ruta en VIEW_ROUTES
- Añadir roles en VIEW_ROLES (ej. ['ROOT', 'ADMIN'])
- Añadir case en switch renderContent()
- Añadir en Sidebar.tsx item de menú ADMIN
```

---

# Prompt 2 — Clonar vista + detalle estilo EmployeesView

```
Crea un CRUD completo con vista de detalle en src/views/admin/{EntityName}/ clonando la estructura de src/views/admin/employees/ (EmployeesView.tsx + EmployeesDetailView.tsx).

## Requisitos previos
Crea los siguientes archivos siguiendo los patrones de empleados existentes:
- src/types/{EntityName}.ts → interface {EntityName}, {EntityName}Overview, {EntityName}Status, {EntityName}Category, arrays/tipos adicionales
- Añade export en src/types/index.ts
- src/data/mock{EntityName}s.ts → exporta INITIAL_{ENTITY_NAME}S + arrays de lookup
- src/context/{EntityName}Context.tsx → Provider con getOverviews(), getById(), create, update, delete
- src/components/modals/{EntityName}FormModal.tsx

### List View (src/views/admin/{EntityName}s/{EntityName}sView.tsx)
Clona EmployeesView.tsx y modifica:

**Props**: `{ onView{EntityName}?: (id: string) => void }`

**Datos y columnas de tabla**
- Columna identidad: avatar gradient + nombre + apellidos + ID/email
- Columna categoría: badge con colores mapeados por ID
- Columna estado: badge con colores mapeados por ID
- Acciones: ojo (view), editar, eliminar

**Búsqueda y filtros**
- Búsqueda por campos relevantes
- Sidebar: filtros por array lookup dinámico (ej. centros, categorías, estados)
- Los arrays se importan de mock{EntityName}s.ts

**Filtros dinámicos** (no hardcodeados):
- En el sidebar, itera sobre arrays lookup con .map()
- En mobile (lg:hidden), usa <select> con opciones del array
- Mantén la estructura de dos paneles: sidebar izquierdo con bloques de botones

### Detail View (src/views/admin/{EntityName}s/{EntityName}sDetailView.tsx)
Clona EmployeesDetailView.tsx y modifica:

**Props**: { entityId: string; onBack: () => void }

**Layout**:
- Header gradient (indigo) con iniciales/icono + nombre principal + StatusBadge
- SectionCards: Datos Principales, Info Adicional, Métricas, Estados
- InfoRow icon/label/value para cada campo
- Botones Editar/Eliminar (ocultos si read-only)
- Modal {EntityName}FormModal + ConfirmDialog

**Integración con App.tsx (modificar)**:
- Importar Provider y envolver
- DashboardViewType: '{ENTITY_NAME}S_CRUD' | '{ENTITY_NAME}_DETAIL'
- VIEW_ROUTES: ambas rutas
- VIEW_ROLES: ambas
- renderContent: caso list (con onView{EntityName}) y caso detail
- Sidebar.tsx: item menú ADMIN

**Integración con Sidebar.tsx**:
- Añadir icono (elige uno de lucide-react)
- label: 'Gestión {EntityName}s'
- description: 'CRUD de {entityName}s'
```

---

# Prompt 3 — Tab con tabla dentro de una vista existente

```
Agrega un sistema de tabs a una vista existente en src/views/ y dentro de uno de los tabs inserta una tabla CRUD completa.

## Antes de ejecutar, pregúntame:

1. **Estructura de la tabla**: ¿Quieres el patrón tipo **UsersView** (CRUD inline sin vista de detalle, para entidades simples) o tipo **EmployeesView** (con vista de detalle separada + onView prop, para entidades complejas)?

2. **Vista destino**: ¿En qué vista quieres agregar el tab? Dame la ruta completa del archivo (ej. src/views/dashboard/DashboardUsersView.tsx, src/views/admin/employees/EmployeesView.tsx, etc.)

3. **Datos de la entidad**: ¿Qué entidad manejará la tabla? Necesito saber:
   - Nombre de la entidad (ej. "Proveedores", "Multas", "Incidencias")
   - Columnas que debe mostrar la tabla
   - Campos de búsqueda y filtros
   - Si tendrá datos mock propios o compartidos

## Lo que haré:

### Fase 1 — Infraestructura (si los datos son nuevos)
1. Crear tipos: src/types/{EntityName}.ts + export en index.ts
2. Crear datos mock: src/data/mock{EntityName}s.ts
3. Crear context: src/context/{EntityName}Context.tsx
4. Crear form modal: src/components/modals/{EntityName}FormModal.tsx

### Fase 2 — Tab implementation
- En la vista destino, añadir estado `activeTab` con useState
- Renderizar tabs navigation (botones inline, con estilo active/inactive inspirado en los sidebars de filtros)
- Mantener el contenido original de la vista en `activeTab === 'original'` (o el nombre que corresponda)
- Insertar la tabla en `activeTab === '{entityName}'` dentro del mismo layout

### Fase 3 — Tabla dentro del tab
- Si elegiste **UsersView pattern**: la tabla es independiente, con su propio state, modales, paginación y filtros inline.
- Si elegiste **EmployeesView pattern**: la tabla acepta `onViewEntity` prop y delegar el detalle al padre (si el padre maneja navegación de vistas) o abre un modal de detalle expandido.

### Fase 4 — Integración
- No modificar App.tsx (el tab vive dentro de una vista que ya está integrada)
- No modificar Sidebar
- Si la entidad necesita Provider, envolver en App.tsx o dentro del componente que renderiza la vista
```
