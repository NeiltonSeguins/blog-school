import api from './api';
import { User } from '../types';

export const usersService = {
  getTeachers: async (): Promise<User[]> => {
    try {
      const response = await api.get<User[]>('/teachers');
      return response.data;
    } catch (error) {
      console.error("UsersService GetTeachers Error:", error);
      throw error;
    }
  },

  getStudents: async (): Promise<User[]> => {
    try {
      const response = await api.get<User[]>('/students');
      return response.data;
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
  }
};
