import api from './api';

export interface Category {
  id: number;
  name: string;
}

export const categoriesService = {
  getCategoryById: async (id: number): Promise<Category> => {
    try {
      const response = await api.get<Category>(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`CategoriesService GetCategoryById (${id}) Error:`, error);
      throw error;
    }
  }
};
