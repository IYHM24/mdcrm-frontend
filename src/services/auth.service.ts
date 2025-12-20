import { apiService } from './api.service';
import { LOCAL_STORAGE_KEYS } from '@/config/constants';
import type { User, ApiResponse } from '@/types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export class AuthService {
  async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
    const response = await apiService.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    
    if (response.success && response.data) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, response.data.token);
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
    }
    
    return response;
  }

  async logout(): Promise<void> {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
  }

  async getCurrentUser(): Promise<User | null> {
    const userData = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return apiService.post<ApiResponse<{ token: string }>>('/auth/refresh');
  }
}

export const authService = new AuthService();
