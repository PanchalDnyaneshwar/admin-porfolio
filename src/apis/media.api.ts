import api from './axios';
import { API_ROUTES } from '@/constants/apiRoutes';
import type { ApiResponse } from '@/types/api.types';
import type { Media } from '@/types/media.types';

export const getMedia = async () => {
  const response = await api.get<ApiResponse<Media[]>>(API_ROUTES.media.admin);
  return response.data;
};

export const createMedia = async (payload: Partial<Media>) => {
  const response = await api.post<ApiResponse<Media>>(API_ROUTES.media.base, payload);
  return response.data;
};

export const deleteMedia = async (id: string) => {
  const response = await api.delete<ApiResponse<{ id: string }>>(API_ROUTES.media.byId(id));
  return response.data;
};
