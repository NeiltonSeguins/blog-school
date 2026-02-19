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
  },

  getAll: async (): Promise<Category[]> => {
    try {
      const response = await api.get<any[]>('/categories');
      // Map API response (label) to internal model (name)
      // API returns: [{"id":1,"label":"Matemática","order":1,"isActive":1}, ...]
      const data = Array.isArray(response.data) ? response.data : [];

      return data.map((item: any) => ({
        id: item.id,
        name: item.label, // Mapping label to name
      }));
    } catch (error) {
      console.error("CategoriesService GetAll Error:", error);
      throw error;
    }
  }
};
