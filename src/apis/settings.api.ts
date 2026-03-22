import api from './axios';
import { API_ROUTES } from '@/constants/apiRoutes';
import type { ApiResponse } from '@/types/api.types';
import type { Settings } from '@/types/settings.types';

export const getAdminSettings = async () => {
  const response = await api.get<ApiResponse<Settings>>(API_ROUTES.settings.admin);
  return response.data;
};

export const createSettings = async (payload: Settings) => {
  const response = await api.post<ApiResponse<Settings>>(API_ROUTES.settings.create, payload);
  return response.data;
};

export const updateSettings = async (payload: Settings) => {
  const response = await api.put<ApiResponse<Settings>>(API_ROUTES.settings.update, payload);
  return response.data;
};
