import api from './axios';
import { API_ROUTES } from '@/constants/apiRoutes';
import type { ApiResponse } from '@/types/api.types';
import type { Blog } from '@/types/blog.types';

export const getBlogs = async () => {
  const response = await api.get<ApiResponse<Blog[]>>(API_ROUTES.blogs.admin);
  return response.data;
};

export const createBlog = async (payload: Partial<Blog>) => {
  const response = await api.post<ApiResponse<Blog>>(API_ROUTES.blogs.base, payload);
  return response.data;
};

export const updateBlog = async (id: string, payload: Partial<Blog>) => {
  const response = await api.put<ApiResponse<Blog>>(API_ROUTES.blogs.byId(id), payload);
  return response.data;
};

export const deleteBlog = async (id: string) => {
  const response = await api.delete<ApiResponse<{ id: string }>>(API_ROUTES.blogs.byId(id));
  return response.data;
};
