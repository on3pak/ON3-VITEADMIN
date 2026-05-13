
# Prompt 1 — Clonar vista estilo UsersView

```
Crea un CRUD completo en src/views/admin/{EntityName}/ clonando la estructura de src/views/admin/users/UsersView.tsx.

## Antes de empezar, pregúntame:
1. **Avatar/Icono**: ¿Qué tipo de avatar quieres usar en la columna identidad?
   - **dicebear**: imagen externa vía `https://api.dicebear.com/7.x/bottts/svg?seed={field}` (como UsersView)
   - **gradient initials**: círculo/cuadrado con gradiente + iniciales del nombre (como EmployeesView)
   - **custom icon**: ícono de lucide-react genérico (especifica cuál, ej. Truck, Package, Building2)

## Requisitos previos
Crea los siguientes archivos siguiendo los patrones de empleados existentes:
- src/types/{EntityName}.ts → interface {EntityName} + tipos literales (ej. {EntityName}Status, {EntityName}Category)
- Añade export en src/types/index.ts
- src/data/mock{EntityName}s.ts → exporta INITIAL_{ENTITY_NAME}S con datos mock, y arrays de lookup
- src/context/{EntityName}Context.tsx → Provider + use{EntityName} hook con create/update/delete, siguiendo UserContext pattern
- src/components/modals/{EntityName}FormModal.tsx → modal de formulario

## Vista (src/views/admin/{EntityName}s/{EntityName}sView.tsx)
Clona UsersView.tsx y modifica:

### Datos y columnas de tabla
- Columna 1 (identidad): avatar/icono según tu respuesta + nombre principal + fila secundaria (ID, email, etc.)
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

## ¿Qué hacer después de completar la vista?
1. Ejecuta `pnpm build` para verificar que no hay errores de compilación ni tipos.
2. Si todo compila correctamente, **pregúntame**: "¿Quieres que cree también un Dashboard en src/views/dashboard/ para esta entidad? (clonando el patrón de DashboardEmployeesView.tsx)"
```

---

# Prompt 2 — Clonar vista + detalle estilo EmployeesView

```
Crea un CRUD completo con vista de detalle en src/views/admin/{EntityName}/ clonando la estructura de src/views/admin/employees/ (EmployeesView.tsx + EmployeesDetailView.tsx).

## Antes de empezar, pregúntame:
1. **Avatar/Icono**: ¿Qué tipo de avatar quieres usar en la columna identidad?
   - **gradient initials**: círculo/cuadrado con gradiente + iniciales del nombre (como EmployeesView)
   - **custom icon**: ícono de lucide-react genérico (especifica cuál, ej. Truck, Package, Building2, Wrench)

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
- Columna identidad: avatar según tu respuesta + nombre + apellidos + ID/email
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
- Header gradient (indigo) con avatar según tu respuesta + nombre principal + StatusBadge
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

**Integración con Header.tsx (modificar)**:
- Añadir cases en getViewInfo() para '{ENTITY_NAME}S_CRUD' y '{ENTITY_NAME}_DETAIL' con title y subtitle

**Integración con Sidebar.tsx**:
- Icono de lucide-react (a elegir)
- label: 'Gestión {EntityName}s'
- description: 'CRUD de {entityName}s'

## ¿Qué hacer después de completar la vista?
1. Ejecuta `pnpm build` para verificar que no hay errores de compilación ni tipos.
2. Si todo compila correctamente, **pregúntame**: "¿Quieres que cree también un Dashboard en src/views/dashboard/ para esta entidad? (clonando el patrón de DashboardEmployeesView.tsx)"
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

## ¿Qué hacer después de completar el tab?
1. Ejecuta `pnpm build` para verificar que no hay errores de compilación ni tipos.
2. Si todo compila correctamente, **pregúntame**: "¿Quieres que cree también un Dashboard para esta entidad? Como el tab está dentro de {VistaDestino}, comprobaré si esa vista ya tiene un dashboard asociado. Si lo tiene, añadiré la nueva entidad como un tab dentro de ese dashboard. Si no, crearé un dashboard independiente clonando DashboardEmployeesView.tsx."
```

---

# Dashboard — Crear dashboard para nueva entidad

```
(Esto NO es un prompt independiente. Se ejecuta solo cuando respondes "sí" a la pregunta
"¿Quieres que cree también un Dashboard?" al final de los Prompts 1, 2 o 3.)

Se elige automáticamente entre dos caminos según el contexto:

**Camino A — Dashboard standalone** (Prompts 1, 2 o cuando el Prompt 3 no encuentra dashboard asociado):
Crea un archivo nuevo src/views/dashboard/Dashboard{EntityName}sView.tsx clonando DashboardEmployeesView.tsx.

**Camino B — Tab dentro de dashboard existente** (Prompt 3 cuando la vista destino tiene dashboard asociado):
Modifica el dashboard existente añadiendo un tab con los datos de la nueva entidad.

---

### Camino A: Dashboard standalone
Crea el dashboard en src/views/dashboard/Dashboard{EntityName}sView.tsx clonando DashboardEmployeesView.tsx.

## Dashboard (src/views/dashboard/Dashboard{EntityName}sView.tsx)

### Stats cards (grid 2x2 lg:grid-cols-4)
Siempre 4 cards con icono + label + valor:
1. Total {entityName}s
2. Activos (según el campo booleano o de estado que corresponda)
3. Inactivos / No activos
4. Tasa de Actividad (porcentaje calculado)

### Distribución por categoría/tipo (lg:col-span-2)
- Barras de progreso horizontales con porcentajes
- Colores por categoría mapeados manualmente

### Por {segundo filtro} (ej. Centro de Trabajo, Ubicación)
- Lista compacta con counts

### Estado actual
- Grid de cards con conteo por status

### {EntityName}s Recientes
- Tabla con las últimas 5 entradas ordenadas por fecha de creación
- Columnas: identidad, categoría, ubicación, estado, fecha de alta

## Integración con App.tsx (modificar)
- Importar Dashboard{EntityName}sView
- DashboardViewType: '{ENTITY_NAME}_DASHBOARD'
- Añadir ruta en VIEW_ROUTES
- Añadir roles en VIEW_ROLES (ej. ['ROOT', 'ADMIN', 'MANAGER'])
- Añadir case en switch renderContent()

### Si viene del Prompt 3 (tab dentro de vista existente)
No se crea un archivo nuevo. En lugar de eso:

1. Identifica la vista dashboard asociada a la vista destino del tab:
   - Si la vista destino ES un dashboard (ej. `DashboardUsersView.tsx`), esa es la vista a modificar
   - Si la vista destino es un CRUD (ej. `EmployeesView.tsx`), busca `Dashboard{ViewName}View.tsx` (ej. `DashboardEmployeesView.tsx`)
   - Si no existe dashboard asociado, cae en el caso standalone de arriba

2. En el dashboard existente, añade un sistema de tabs (misma técnica que Prompt 3):
   - Estado `activeTab` con useState
   - Tabs navigation: el contenido original del dashboard en `activeTab === 'overview'`, y la nueva entidad en `activeTab === '{entityName}'`
   - El contenido del nuevo tab replica la estructura del dashboard (stats cards, distribuciones, tabla de recientes) pero filtrado a los datos de la nueva entidad

3. Integración:
   - No modificar App.tsx (el dashboard ya está registrado)
   - No modificar Sidebar
   - No modificar Header.tsx
   - Si la entidad necesita un Provider nuevo, envolver en App.tsx

## Integración con Header.tsx (modificar)
- Añadir case en getViewInfo() para '{ENTITY_NAME}_DASHBOARD' con title y subtitle

## Integración con Sidebar.tsx
- Añadir en sección DASHBOARD:
  - icon: uno de lucide-react
  - label: '{EntityName}s'
  - description: 'Panel de {entityName}s'

## ¿Qué hacer después?
1. Ejecuta `pnpm build` y confirma que no hay errores.
2. Verifica que la navegación desde sidebar funciona y los datos se renderizan correctamente.
```
