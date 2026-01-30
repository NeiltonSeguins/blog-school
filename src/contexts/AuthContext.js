import { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  async function signIn(email, password) {
    try {
      const response = await api.post('/login', { email, password });
      const { user, token } = response.data;

      setUser(user);

      api.defaults.headers.Authorization = `Bearer ${token}`;

      await AsyncStorage.setItem('@BlogSchool:user', JSON.stringify(user));
      await AsyncStorage.setItem('@BlogSchool:token', token);
      
      return null; // No error
    } catch (error) {
      console.error(error);
      return error.response?.data?.message || 'Erro ao realizar login';
    }
  }

  async function signOut() {
    await AsyncStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
