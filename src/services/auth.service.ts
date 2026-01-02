import { apiService } from './api.service';
import { LOCAL_STORAGE_KEYS, API_BASE_URL } from '@/config/constants';
import type { User, ApiResponse } from '@/types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  roles: string[];
}

interface LogoutResponse {
  message: string;
}

interface LogoutBody {
  RefreshToken?: string;
}


export class AuthService {

  /**
   * Login user
   * @param credentials 
   * @returns 
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
    const response = await apiService.post<ApiResponse<LoginResponse>>('/api/auth/login', credentials);

    if (response.status && response.data) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, response.data.accessToken);
      localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken); // Example storage
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
    }

    return response;
  }

  async logout(params: LogoutBody = {}): Promise<ApiResponse<LogoutResponse>> {
    console.log('🔄 Starting logout process with params:', params);
    console.log('🔑 Current token:', localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN) ? 'EXISTS' : 'MISSING');

    try {
      console.log('📤 Making logout API call to /api/auth/logout');
      console.log('🌐 Full URL would be:', `${API_BASE_URL}/api/auth/logout`);

      params.RefreshToken = localStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN) || undefined;
      const response = await apiService.post<ApiResponse<LogoutResponse>>('/api/auth/logout', params);

      console.log('✅ Logout API response received:', response);
      console.log('📊 Response status:', response.status);
      console.log('📝 Response data:', response.data);

      // Solo limpiar localStorage si el backend respondió correctamente
      if (response.status) {
        console.log('🧹 Cleaning localStorage after successful logout');
        localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
      } else {
        console.warn('⚠️ Backend responded but status was false');
      }

      return response;

    } catch (error) {
      console.error('❌ Logout API error caught:', error);
      console.error('🔍 Error type:', typeof error);
      console.error('🔍 Error constructor:', error?.constructor?.name);
      console.error('🔍 Error message:', error instanceof Error ? error.message : String(error));

      // Limpiar localStorage aún si la API falla (logout forzado local)
      console.log('🧹 Force cleaning localStorage due to API error');
      localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);

      // Retornar respuesta consistente aunque falle la API
      return {
        status: false,
        message: `Error during logout: ${error instanceof Error ? error.message : 'Unknown error'}`,
        data: { message: error instanceof Error ? error.message : 'Unknown error' }
      } as ApiResponse<LogoutResponse>;
    }
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
