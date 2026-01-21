import type { TableEventsProps } from '@/pages/events/types';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types';
import type { useStateDefinition } from '@/types/Definitions';


class TableEvents<T> {

    loading: boolean;
    error: string | null;
    pagination: { page: number; limit: number; total: number; totalPages: number; };
    data: T[];
    setLoading: useStateDefinition<boolean>;
    setError: useStateDefinition<string | null>;
    setPagination: useStateDefinition<{ page: number; limit: number; total: number; totalPages: number; }>;
    setData: useStateDefinition<T[]>;
    request_data?: (params?: PaginationParams) => Promise<PaginatedResponse<T>>;


    /**
     * Construsctor de la clase TableEvents
     * @param props 
     */
    constructor(props: TableEventsProps) {
        this.loading = props.loading;
        this.setLoading = props.setLoading;
        this.error = props.error;
        this.setError = props.setError;
        this.pagination = props.pagination;
        this.setPagination = props.setPagination;
        this.data = props.data;
        this.setData = props.setData;
        this.request_data = props.request_data;
    }

    /**
     * Establecer datos de paginación
     * @param page numero
     * @param limit numero
     * @param total numero
     * @param totalPages numero
     */
    setPaginationData = (page: number, limit: number, total: number, totalPages: number) => {
        this.setPagination({
            page,
            limit,
            total,
            totalPages,
        });
    };

    /**
     * Cargar datos con paginación
     * @param page numero
     * @param limit numero
     * @param request_data Funcion de getAll de los servicios
     * @returns Datos cargados
     */
    async loadData(
        page: number = 1,
        limit: number = 10,
    ): Promise<T[] | undefined> {
        //Estados de carga y error
        this.setLoading(true);
        this.setError(null);
        try {
            //1. Realizar la consulta
            const fetcher = this.request_data;
            if (!fetcher) {
                this.setError('No request_data configured');
                return [];
            }
            const response = await fetcher({ page, limit });

            //2. Establecer paginación
            this.setPagination({
                page: response.page || page,
                limit: limit,
                total: response.total || 0,
                totalPages: response.totalPages || 0,
            });
            //3. Establecer datos
            this.setData(response.data || []);
            return response.data || [];
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar datos';
            this.setError(errorMessage);
            console.error('Error loading informes:', err);
        } finally {
            this.setLoading(false);
        }
    };

    /**
     * Busqueda
     * @param query Parametro a buscar
     * @param request_data Funcion de getAll de los servicios
     * @param request_search Funcion de search de los servicios
     * @returns datos buscados
     */
    async handleSearch(
        query: string,
        request_search: (query: string) => Promise<ApiResponse<T[]>>,
        request_data?: (params?: PaginationParams) => Promise<PaginatedResponse<T>>,
    ): Promise<T[] | undefined> {
        // Reiniciar datos si la consulta está vacía
        if (!query.trim()) {
            const rd = request_data ?? this.request_data;
            if (rd) await this.loadData(1, this.pagination.limit);
            return;
        }
        this.setLoading(true);
        this.setError(null);
        try {
            const resp = await request_search(query);
            const results = resp.data || [];
            this.setPagination({
                page: 1,
                limit: results.length || this.pagination.limit,
                total: results.length,
                totalPages: 1,
            });
            this.setData(results);
            return results;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error en la búsqueda';
            this.setError(errorMessage);
            console.error('Error searching informes:', err);
            return [];
        } finally {
            this.setLoading(false);
        }
    };

    /**
     * Cambio de página
     * @param page numero  
     * @param request_data Funcion de getAll de los servicios
     */
    async handlePageChange(
        page: number,
    ): Promise<T[] | undefined> {
        return this.loadData(page, this.pagination.limit);
    };

    /**
     * Cambio de límite
     * @param limit numero 
     * @param request_data Funcion de getAll de los servicios
     */
    async handleLimitChange(
        limit: number,
    ): Promise<T[] | undefined> {
        return this.loadData(1, limit);
    };

    /**
     * Eliminar filas seleccionadas usando la función deleteFn
     * @param selectedRows filas a eliminar
     * @param deleteFn función que recibe id y elimina el recurso
     */
    async deleteSelected(
        selectedRows: T[],
        deleteFn: (id: string | number) => Promise<any>
    ): Promise<void> {
        if (!selectedRows || selectedRows.length === 0) return;
        this.setLoading(true);
        this.setError(null);
        try {
            await Promise.all(selectedRows.map((r) => deleteFn((r as any).id)));
            // recargar datos
            if (this.request_data) {
                await this.loadData(this.pagination.page, this.pagination.limit);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al eliminar filas';
            this.setError(errorMessage);
            console.error('Error deleting rows:', err);
        } finally {
            this.setLoading(false);
        }
    };

    /**
     * Duplicar una fila usando createFn
     * @param row fila a duplicar
     * @param createFn función que crea el nuevo recurso
     */
    async duplicateRow(
        row: T,
        createFn: (payload: any) => Promise<any>
    ): Promise<void> {
        this.setLoading(true);
        this.setError(null);
        try {
            const { id, createdAt, updatedAt, createdByUser, createdByUserId, ...payload } = row as any;
            await createFn(payload);
            if (this.request_data) {
                await this.loadData(this.pagination.page, this.pagination.limit);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al duplicar fila';
            this.setError(errorMessage);
            console.error('Error duplicating row:', err);
        } finally {
            this.setLoading(false);
        }
    };

    /**
     * Generar CSV a partir de filas y un mapeador opcional
     * @param rows filas
     * @param headers cabeceras opcionales
     * @param mapper opcional: (row) => array de campos en orden
     */
    exportCSV(rows: T[], headers?: string[], mapper?: (row: T) => any[]): string {
        const escape = (v: any) => `"${String(v ?? '').replace(/"/g, '""').replace(/\n/g, ' ')}"`;
        const usedHeaders = headers || (rows.length > 0 ? Object.keys(rows[0] as any) : []);
        const mapped = rows.map((r) => (mapper ? mapper(r) : Object.values(r as any)));
        const content = [usedHeaders.map(escape).join(','), ...mapped.map((m) => m.map(escape).join(','))].join('\n');
        return content;
    };

}

export default TableEvents;