import api from './api';
import { User } from '../types';

export const usersService = {
  getTeachers: async (): Promise<User[]> => {
    try {
      const response = await api.get<any>('/teachers');
      // Handle both array and { items: ... } response formats
      const data = Array.isArray(response.data) ? response.data : (response.data.items || []);

      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        role: item.role
      }));
    } catch (error) {
      console.error("UsersService GetTeachers Error:", error);
      throw error;
    }
  },

  getStudents: async (): Promise<User[]> => {
    try {
      const response = await api.get<any>('/students');
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return response.data.items || [];
    } catch (error) {
      console.error("UsersService GetStudents Error:", error);
      throw error;
    }
  },

  deleteTeacher: async (id: number): Promise<void> => {
    try {
      await api.delete(`/teachers/${id}`);
    } catch (error) {
      console.error(`UsersService DeleteTeacher (${id}) Error:`, error);
      throw error;
    }
  },

  deleteStudent: async (id: number): Promise<void> => {
    try {
      await api.delete(`/students/${id}`);
    } catch (error) {
      console.error(`UsersService DeleteStudent (${id}) Error:`, error);
      throw error;
    }
  },

  getTeacherById: async (id: number): Promise<User> => {
    const response = await api.get(`/teachers/${id}`);
    return response.data;
  },

  getStudentById: async (id: number): Promise<User> => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  createTeacher: async (data: Partial<User>): Promise<User> => {
    const response = await api.post('/teachers', data);
    return response.data;
  },

  createStudent: async (data: Partial<User>): Promise<User> => {
    const response = await api.post('/students', data);
    return response.data;
  },

  updateTeacher: async (id: number, data: Partial<User>): Promise<User> => {
    const response = await api.put(`/teachers/${id}`, data);
    return response.data;
  },

  updateStudent: async (id: number, data: Partial<User>): Promise<User> => {
    const response = await api.put(`/students/${id}`, data);
    return response.data;
  }
};
