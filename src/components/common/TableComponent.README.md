# TableComponent

Componente de tabla genérico y reutilizable con soporte completo para paginación, búsqueda, ordenamiento, selección y acciones en lote.

## Características

- ✅ **Columnas dinámicas**: Basadas en las propiedades de los objetos de datos
- ✅ **Filtrado local**: Filtrar filas por cualquier columna
- ✅ **Ordenamiento**: Click en encabezados para ordenar ascendente/descendentemente
- ✅ **Paginación**: Compatible con paginación de servidor (API) o local
- ✅ **Búsqueda**: Barra de búsqueda global con integración API
- ✅ **Selección**: Selección múltiple con checkbox
- ✅ **Acciones en lote**: Ejecutar acciones sobre elementos seleccionados
- ✅ **Responsive**: Adaptable a diferentes tamaños de pantalla
- ✅ **Temas**: Soporte para temas claro/oscuro
- ✅ **Personalizable**: Estilos y comportamientos configurables
- ✅ **Shadcn UI**: Utiliza componentes de Shadcn UI
- ✅ **TypeScript**: Completamente tipado con genéricos

## Instalación

El componente ya está disponible en `@/components/common/TableComponent`.

```tsx
import { TableComponent, type ColumnDef, type TableAction } from '@/components/common';
```

## Uso Básico

### Con datos estáticos

```tsx
import { TableComponent, type ColumnDef } from '@/components/common';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  activo: boolean;
}

const usuarios: Usuario[] = [
  { id: 1, nombre: 'Juan Pérez', email: 'juan@example.com', activo: true },
  { id: 2, nombre: 'María García', email: 'maria@example.com', activo: false },
];

const columnas: ColumnDef<Usuario>[] = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'nombre', label: 'Nombre', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  {
    key: 'activo',
    label: 'Estado',
    render: (value) => (
      <span className={value ? 'text-green-600' : 'text-red-600'}>
        {value ? 'Activo' : 'Inactivo'}
      </span>
    ),
  },
];

export function ListaUsuarios() {
  return (
    <TableComponent
      data={usuarios}
      columns={columnas}
      title="Usuarios"
      enableLocalSort={true}
      searchable={true}
    />
  );
}
```

### Con paginación de servidor (InformeService)

```tsx
import { useState, useEffect } from 'react';
import { TableComponent, type ColumnDef, type PaginationInfo } from '@/components/common';
import { informeService } from '@/services/informe.service';
import type { InformeModel } from '@/types';

export function ListaInformes() {
  const [data, setData] = useState<InformeModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const columns: ColumnDef<InformeModel>[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'asegurado', label: 'Asegurado', sortable: true },
    { key: 'cc', label: 'CC', sortable: true },
    {
      key: 'prima',
      label: 'Prima',
      render: (value) => value ? `$${Number(value).toLocaleString()}` : '-',
    },
  ];

  const loadData = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const response = await informeService.getAll({ page, limit });
      setData(response.data);
      setPagination({
        page: response.page,
        limit: limit,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      loadData(1, pagination.limit);
      return;
    }

    setLoading(true);
    try {
      const response = await informeService.search(query);
      setData(response.data);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(1, 10);
  }, []);

  return (
    <TableComponent
      data={data}
      columns={columns}
      pagination={pagination}
      onPageChange={(page) => loadData(page, pagination.limit)}
      onLimitChange={(limit) => loadData(1, limit)}
      onSearch={handleSearch}
      loading={loading}
      title="Informes"
      searchPlaceholder="Buscar por asegurado o CC..."
    />
  );
}
```

### Con selección y acciones en lote

```tsx
import { TableComponent, type TableAction } from '@/components/common';
import { Trash2, Download, Plus } from 'lucide-react';

const actions: TableAction<InformeModel>[] = [
  {
    label: 'Nuevo',
    icon: <Plus className="h-4 w-4" />,
    onClick: () => console.log('Crear nuevo'),
    variant: 'default',
  },
  {
    label: 'Eliminar',
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (selectedRows) => console.log('Eliminar:', selectedRows),
    variant: 'destructive',
    requiresSelection: true, // Se desactiva si no hay elementos seleccionados
  },
  {
    label: 'Exportar',
    icon: <Download className="h-4 w-4" />,
    onClick: (selectedRows) => console.log('Exportar:', selectedRows),
    variant: 'outline',
  },
];

<TableComponent
  data={data}
  columns={columns}
  selectable={true}
  actions={actions}
  onSelectionChange={(rows) => console.log('Seleccionados:', rows)}
/>
```

## Props

### Principales

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `data` | `T[]` | `[]` | Array de datos a mostrar |
| `columns` | `ColumnDef<T>[]` | - | Definición de columnas (requerido) |
| `title` | `string` | - | Título de la tabla |
| `subtitle` | `string` | - | Subtítulo |
| `loading` | `boolean` | `false` | Estado de carga |
| `error` | `string` | - | Mensaje de error |
| `className` | `string` | - | Clase CSS adicional |

### Paginación

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `pagination` | `PaginationInfo` | - | Info de paginación (page, limit, total, totalPages) |
| `onPageChange` | `(page: number) => void` | - | Callback al cambiar de página |
| `onLimitChange` | `(limit: number) => void` | - | Callback al cambiar límite por página |
| `itemsPerPageOptions` | `number[]` | `[5, 10, 20, 50]` | Opciones de elementos por página |

### Búsqueda

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `searchable` | `boolean` | `true` | Habilitar búsqueda |
| `searchPlaceholder` | `string` | `'Buscar...'` | Placeholder del input de búsqueda |
| `onSearch` | `(query: string) => void \| Promise<void>` | - | Callback de búsqueda (para API) |
| `searchValue` | `string` | - | Valor de búsqueda controlado |

### Selección

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `selectable` | `boolean` | `false` | Habilitar selección múltiple |
| `onSelectionChange` | `(rows: T[]) => void` | - | Callback al cambiar selección |
| `getRowId` | `(row: T) => string \| number` | `(row) => row.id` | Función para obtener ID único de fila |

### Acciones

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `actions` | `TableAction<T>[]` | `[]` | Acciones globales (botones en header) |
| `rowActions` | `(row: T) => TableAction<T>[]` | - | Acciones por fila (menú contextual) |

### Ordenamiento

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `enableLocalSort` | `boolean` | `false` | Habilitar ordenamiento local (client-side) |

### Estados vacíos

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `emptyMessage` | `string` | `'No se encontraron resultados'` | Mensaje cuando no hay datos |
| `emptyIcon` | `React.ReactNode` | - | Ícono personalizado para estado vacío |

## Tipos

### ColumnDef

```typescript
interface ColumnDef<T> {
  key: keyof T | string;           // Clave de la propiedad
  label: string;                   // Etiqueta del encabezado
  sortable?: boolean;              // Permitir ordenamiento
  filterable?: boolean;            // Permitir filtrado
  render?: (value: any, row: T) => React.ReactNode;  // Renderizado personalizado
  className?: string;              // Clase CSS para celdas
  headerClassName?: string;        // Clase CSS para encabezado
}
```

### TableAction

```typescript
interface TableAction<T = any> {
  label: string;                          // Texto del botón
  icon?: React.ReactNode;                 // Ícono
  onClick: (selectedRows: T[]) => void | Promise<void>;  // Callback
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  requiresSelection?: boolean;            // Requiere elementos seleccionados
  className?: string;                     // Clase CSS adicional
}
```

### PaginationInfo

```typescript
interface PaginationInfo {
  page: number;        // Página actual
  limit: number;       // Elementos por página
  total: number;       // Total de elementos
  totalPages?: number; // Total de páginas
}
```

## Ejemplos Avanzados

Ver archivo `TableComponent.example.tsx` para ejemplos completos incluyendo:

- Integración con InformeService.getAll()
- Integración con InformeService.search()
- Uso de getMyInformes para datos filtrados por usuario
- Renderizado personalizado de celdas
- Acciones en lote con confirmación
- Exportación de datos
- Formateo de fechas y monedas

## Estilos

El componente utiliza Tailwind CSS y las variables de tema de Shadcn UI, por lo que se adapta automáticamente al tema claro/oscuro del sistema.

## Notas

- Para ordenamiento en servidor, use `enableLocalSort={false}` e implemente la lógica en su backend
- Para búsqueda en servidor, proporcione `onSearch` callback
- El componente es completamente genérico y funciona con cualquier tipo de dato
- Soporta renderizado personalizado de celdas mediante la función `render`
