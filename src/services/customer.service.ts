import { apiService } from './api.service';
import type { Customer, ApiResponse, PaginatedResponse, PaginationParams } from '@/types';

export class CustomerService {
  private endpoint = '/customers';

  async getAll(params?: PaginationParams): Promise<PaginatedResponse<Customer>> {
    const queryParams = params ? {
      page: String(params.page),
      limit: String(params.limit),
    } : undefined;
    
    return apiService.get<PaginatedResponse<Customer>>(this.endpoint, queryParams);
  }

  async getById(id: string): Promise<ApiResponse<Customer>> {
    return apiService.get<ApiResponse<Customer>>(`${this.endpoint}/${id}`);
  }

  async create(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Customer>> {
    return apiService.post<ApiResponse<Customer>>(this.endpoint, customer);
  }

  async update(id: string, customer: Partial<Customer>): Promise<ApiResponse<Customer>> {
    return apiService.put<ApiResponse<Customer>>(`${this.endpoint}/${id}`, customer);
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<ApiResponse<void>>(`${this.endpoint}/${id}`);
  }

  async search(query: string): Promise<ApiResponse<Customer[]>> {
    return apiService.get<ApiResponse<Customer[]>>(`${this.endpoint}/search`, { q: query });
  }
}

export const customerService = new CustomerService();
