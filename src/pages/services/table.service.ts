import type { ApiResponse } from "@/types";
import TableEvents from "../events/table.events";
import type { TableEventsProps } from "../events/types";

class TableService<T> extends TableEvents<T> {

    constructor(props: TableEventsProps) {
        super(props);
    }

    /**
     * Cargar datos con paginación
     * @param page 
     * @param limit
     *  */
    async cargarDatos(page: number = 1, limit: number = 10) {
        // Si existe TableEvents, delegar en su método loadData
        return await this.loadData(page, limit);
    };

    /**
     * Búsqueda
     * @param query 
     * @returns 
     */
    async buscar(query: string, request_search: (query: string) => Promise<ApiResponse<T[]>>) {
        return await this.handleSearch(query, request_search);
    };

    /** Cambio de página
     * @param page
     */
    cambiarPagina(page: number) {
        return this.handlePageChange(page);
    };

    /** Cambio de límite
     * @param limit
     */
    cambiarLimite(limit: number) {
        this.handleLimitChange(limit);
        return this.loadData(1, limit);
    };

}

export default TableService;