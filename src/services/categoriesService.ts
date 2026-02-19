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
      // Mapeia a resposta da API (label) para o modelo interno (name)
      // API retorna: [{"id":1,"label":"Matemática","order":1,"isActive":1}, ...]
      const data = Array.isArray(response.data) ? response.data : [];

      return data.map((item: any) => ({
        id: item.id,
        name: item.label,
      }));
    } catch (error) {
      console.error("CategoriesService GetAll Error:", error);
      throw error;
    }
  }
};
