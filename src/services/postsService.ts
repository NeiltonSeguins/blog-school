import api from './api';
import { Post } from '../types';

interface GetPostsParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

interface GetPostsResponse {
  total: number;
  items: Post[];
}

export const postsService = {
  getPosts: async (params?: GetPostsParams): Promise<GetPostsResponse> => {
    try {
      const response = await api.get<GetPostsResponse>('/posts', { params });
      return response.data;
    } catch (error) {
      console.error("PostsService GetPosts Error:", error);
      throw error;
    }
  },

  getPostById: async (id: number): Promise<Post> => {
    try {
      const response = await api.get<Post>(`/posts/${id}`);
      return response.data;
    } catch (error) {
       console.error(`PostsService GetPostById (${id}) Error:`, error);
      throw error;
    }
  },

  searchPosts: async (query: string): Promise<Post[]> => {
    try {
      const response = await api.get(`/posts/search`, { params: { q: query } });
      return response.data; 
    } catch (error) {
      console.error("PostsService SearchPosts Error:", error);
      throw error;
    }
  }
};
