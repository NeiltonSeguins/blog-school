import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { setLogoutAction } from '../services/api';
import { authService } from '../services/authService';
import { User, AuthContextData } from '../types';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Integração para logout automático via interceptor
    setLogoutAction(() => {
      signOut();
    });

    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const storedUser = await AsyncStorage.getItem('@BlogSchool:user');
      const storedToken = await AsyncStorage.getItem('@BlogSchool:token');

      if (storedUser && storedToken) {
        api.defaults.headers.Authorization = `Bearer ${storedToken}`;
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to load user data', error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string, role: 'student' | 'teacher'): Promise<string | null> {
    try {
      const data = await authService.login(email, password, role);

      // API returns token and user data at the root level of the response object
      // derived from AuthResponse interface in authService
      const { token } = data;

      const userToStore: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      };

      setUser(userToStore);

      api.defaults.headers.Authorization = `Bearer ${token}`;

      await AsyncStorage.setItem('@BlogSchool:user', JSON.stringify(userToStore));
      await AsyncStorage.setItem('@BlogSchool:token', token);

      return null; // No error
    } catch (error: any) {
      console.error(error);
      return error.response?.data?.message || 'Erro ao realizar login. Verifique suas credenciais.';
    }
  }

  async function signOut() {
    await AsyncStorage.clear();
    setUser(null);
    // Limpar o header de autorização
    delete api.defaults.headers.Authorization;
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
