import { apiService } from './api.service';
import type { InformeModel, ApiResponse, PaginatedResponse, PaginationParams, ResponseWrapper } from '@/types';

class InformeService {

    private endpoint = '/informes';

    /**
     * Obtener todos los informes con paginación
     * @param params 
     * @returns 
     */
    async getAll(params?: PaginationParams): Promise<PaginatedResponse<InformeModel>> {
        const queryParams = params
            ? {
                page: String(params.page),
                limit: String(params.limit),
            }
            : undefined;

        const response: ResponseWrapper<PaginatedResponse<InformeModel>> =
            await apiService.get<ResponseWrapper<PaginatedResponse<InformeModel>>>(this.endpoint, queryParams);

        return response.data;
    }

    /**
     * Obtener informe por ID
     * @param id 
     * @returns 
     */
    async getById(id: number | string): Promise<ApiResponse<InformeModel>> {
        return apiService.get<ApiResponse<InformeModel>>(`${this.endpoint}/${id}`);
    }

    /**
     * Crear nuevo informe
     * @param informe 
     * @returns 
     */
    async create(informe: Omit<InformeModel, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<InformeModel>> {
        return apiService.post<ApiResponse<InformeModel>>(this.endpoint, informe);
    }

    /**
     * Actualizar un informe existente
     * @param id 
     * @param informe 
     * @returns 
     */
    async update(id: number | string, informe: Partial<InformeModel>): Promise<ApiResponse<InformeModel>> {
        return apiService.put<ApiResponse<InformeModel>>(`${this.endpoint}/${id}`, informe);
    }

    /**
     * Eliminar un informe
     */
    async delete(id: number | string): Promise<ApiResponse<void>> {
        return apiService.delete<ApiResponse<void>>(`${this.endpoint}/${id}`);
    }

    /**
     * Buscar informes por consulta
     * @param query 
     * @returns 
     */
    async search(query: string): Promise<ApiResponse<InformeModel[]>> {
        return apiService.get<ApiResponse<InformeModel[]>>(`${this.endpoint}/search`, { q: query });
    }

    /**
     * Buscar en los informes del usuario actual (solo sus propios informes)
     * GET /informes/my-informes/search?q=texto
     */
    async searchMyInformes(query: string): Promise<ApiResponse<InformeModel[]>> {
        return apiService.get<ApiResponse<InformeModel[]>>(`${this.endpoint}/my-informes/search`, { q: query });
    }

    /**
     * Obtener informes del usuario actual con paginación
     * GET /informes/my-informes?page=1&limit=10
     * @param params 
     * @returns 
     */
    async getMyInformes(params?: PaginationParams): Promise<PaginatedResponse<InformeModel>> {
        const queryParams = params
            ? {
                page: String(params.page),
                limit: String(params.limit),
            }
            : undefined;

        return apiService.get<PaginatedResponse<InformeModel>>(`${this.endpoint}/my-informes`, queryParams);
    }

}

export default new InformeService();