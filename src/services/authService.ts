
import { apiService } from './api';

interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Login failed');
    }
    
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiService.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      data
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Registration failed');
    }
    
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('network-toolkit-token');
    localStorage.removeItem('network-toolkit-user');
  }
};
