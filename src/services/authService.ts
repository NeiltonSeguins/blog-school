import api from './api';

interface AuthResponse {
  token: string;
  role: 'student' | 'teacher';
  id: number;
  name: string;
  email: string;
}

export const authService = {
  login: async (email: string, password: string, role: 'student' | 'teacher'): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', { email, password, role });
      return response.data;
    } catch (error) {
      console.error("AuthService Login Error:", error);
      throw error;
    }
  }
};
