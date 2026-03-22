import api from './axios';
import { API_ROUTES } from '@/constants/apiRoutes';
import type { ApiResponse } from '@/types/api.types';
import type { Experience } from '@/types/experience.types';

export const getExperience = async () => {
  const response = await api.get<ApiResponse<Experience[]>>(API_ROUTES.experience.admin);
  return response.data;
};

export const createExperience = async (payload: Partial<Experience>) => {
  const response = await api.post<ApiResponse<Experience>>(API_ROUTES.experience.base, payload);
  return response.data;
};

export const updateExperience = async (id: string, payload: Partial<Experience>) => {
  const response = await api.put<ApiResponse<Experience>>(API_ROUTES.experience.byId(id), payload);
  return response.data;
};

export const deleteExperience = async (id: string) => {
  const response = await api.delete<ApiResponse<{ id: string }>>(API_ROUTES.experience.byId(id));
  return response.data;
};
