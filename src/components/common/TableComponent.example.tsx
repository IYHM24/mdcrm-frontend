/**
 * Ejemplo de uso del TableComponent con InformeService
 * 
 * Este archivo muestra cómo integrar TableComponent con los servicios de la API
 */

import { useState, useEffect } from 'react';
import { TableComponent, type ColumnDef, type TableAction, type PaginationInfo } from './TableComponent';
import informeService from '@/services/informe.service';
import type { InformeModel } from '@/types';
import { FileText, Plus, Trash2, Download } from 'lucide-react';

export const InformesTableExample = () => {
    const [data, setData] = useState<InformeModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationInfo>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });

    // Definición de columnas
    const columns: ColumnDef<InformeModel>[] = [
        {
            key: 'id',
            label: 'ID',
            sortable: true,
            className: 'font-mono text-xs',
        },
        {
            key: 'poliza',
            label: 'Póliza',
            sortable: true,
            render: (value) => value || '-',
        },
        {
            key: 'asegurado',
            label: 'Asegurado',
            sortable: true,
            filterable: true,
        },
        {
            key: 'cc',
            label: 'CC',
            sortable: true,
            filterable: true,
        },
        {
            key: 'prima',
            label: 'Prima',
            sortable: true,
            render: (value) => value ? `$${Number(value).toLocaleString()}` : '-',
            className: 'text-right',
        },
        {
            key: 'createdAt',
            label: 'Fecha Creación',
            sortable: true,
            render: (value) => {
                if (!value) return '-';
                const date = new Date(value);
                return date.toLocaleDateString('es-CO', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                });
            },
        },
        {
            key: 'createdByUser',
            label: 'Creado Por',
            render: (value) => {
                if (!value) return '-';
                return `${value.firstName || ''} ${value.lastName || ''}`.trim() || value.email || '-';
            },
        },
    ];

    // Acciones en lote
    const actions: TableAction<InformeModel>[] = [
        {
            label: 'Nuevo Informe',
            icon: <Plus className="h-4 w-4" />,
            onClick: () => {
                console.log('Crear nuevo informe');
            },
            variant: 'default',
        },
        {
            label: 'Eliminar',
            icon: <Trash2 className="h-4 w-4" />,
            onClick: async (selectedRows) => {
                console.log('Eliminar informes:', selectedRows);
                // Implementar lógica de eliminación
            },
            variant: 'destructive',
            requiresSelection: true,
        },
        {
            label: 'Exportar',
            icon: <Download className="h-4 w-4" />,
            onClick: (selectedRows) => {
                console.log('Exportar informes:', selectedRows);
            },
            variant: 'outline',
        },
    ];

    // Cargar datos con paginación
    const loadData = async (page: number = 1, limit: number = 10) => {
        setLoading(true);
        setError(null);
        try {
            const response = await informeService.getAll({ page, limit });
            setData(response.data);
            setPagination({
                page: response.page,
                limit: limit,
                total: response.total,
                totalPages: response.totalPages,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar datos');
        } finally {
            setLoading(false);
        }
    };

    // Búsqueda
    const handleSearch = async (query: string) => {
        if (!query.trim()) {
            loadData(1, pagination.limit);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await informeService.search(query);
            setData(response.data);
            // En modo búsqueda, desactivamos la paginación
            setPagination({
                page: 1,
                limit: response.data.length,
                total: response.data.length,
                totalPages: 1,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error en la búsqueda');
        } finally {
            setLoading(false);
        }
    };

    // Cambio de página
    const handlePageChange = (page: number) => {
        loadData(page, pagination.limit);
    };

    // Cambio de límite
    const handleLimitChange = (limit: number) => {
        loadData(1, limit);
    };

    // Cargar datos iniciales
    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="space-y-6">
            <TableComponent
                data={data}
                columns={columns}
                pagination={pagination}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
                itemsPerPageOptions={[5, 10, 20, 50, 100]}
                searchable={true}
                searchPlaceholder="Buscar por asegurado, CC..."
                onSearch={handleSearch}
                selectable={true}
                actions={actions}
                title="Informes"
                subtitle="Gestión de informes del sistema"
                loading={loading}
                error={error || undefined}
                emptyMessage="No hay informes disponibles"
                emptyIcon={<FileText className="h-12 w-12 text-muted-foreground" />}
                enableLocalSort={false} // Desactivado porque el ordenamiento se hace en el servidor
            />
        </div>
    );
};

/**
 * Ejemplo usando getMyInformes (solo informes del usuario actual)
 */
export const MyInformesTableExample = () => {
    const [data, setData] = useState<InformeModel[]>([]);
    const [loading, setLoading] = useState(false);

    const columns: ColumnDef<InformeModel>[] = [
        {
            key: 'asegurado',
            label: 'Asegurado',
            sortable: true,
        },
        {
            key: 'cc',
            label: 'Cédula',
            sortable: true,
        },
        {
            key: 'poliza',
            label: 'Póliza',
            render: (value) => value || 'Sin póliza',
        },
        {
            key: 'createdAt',
            label: 'Fecha',
            render: (value) => {
                if (!value) return '-';
                return new Date(value).toLocaleDateString();
            },
        },
    ];

    const loadMyInformes = async () => {
        setLoading(true);
        try {
            const response = await informeService.getMyInformes({ page: 1, limit: 10 });
            setData(response.data);
        } catch (err) {
            console.error('Error loading my informes:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (query: string) => {
        if (!query.trim()) {
            loadMyInformes();
            return;
        }

        setLoading(true);
        try {
            const response = await informeService.searchMyInformes(query);
            setData(response.data);
        } catch (err) {
            console.error('Error searching my informes:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMyInformes();
    }, []);

    return (
        <TableComponent
            data={data}
            columns={columns}
            searchable={true}
            searchPlaceholder="Buscar en mis informes..."
            onSearch={handleSearch}
            title="Mis Informes"
            loading={loading}
            enableLocalSort={true}
        />
    );
};

/**
 * Ejemplo con ordenamiento local y datos estáticos
 */
export const LocalSortExample = () => {
    const staticData: InformeModel[] = [
        {
            id: 1,
            asegurado: 'Juan Pérez',
            cc: '12345678',
            poliza: 1001,
            prima: 500000,
            createdAt: '2024-01-15',
        },
        {
            id: 2,
            asegurado: 'María García',
            cc: '87654321',
            poliza: 1002,
            prima: 750000,
            createdAt: '2024-01-20',
        },
        {
            id: 3,
            asegurado: 'Carlos López',
            cc: '11223344',
            poliza: 1003,
            prima: 600000,
            createdAt: '2024-01-25',
        },
    ];

    const columns: ColumnDef<InformeModel>[] = [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'asegurado', label: 'Asegurado', sortable: true },
        { key: 'cc', label: 'CC', sortable: true },
        { key: 'poliza', label: 'Póliza', sortable: true },
        {
            key: 'prima',
            label: 'Prima',
            sortable: true,
            render: (value) => `$${Number(value || 0).toLocaleString()}`,
        },
    ];

    return (
        <TableComponent
            data={staticData}
            columns={columns}
            enableLocalSort={true}
            searchable={true}
            title="Ejemplo con Ordenamiento Local"
        />
    );
};
