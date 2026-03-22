import api from './axios';
import { API_ROUTES } from '@/constants/apiRoutes';
import type { ApiResponse } from '@/types/api.types';
import type { Profile } from '@/types/profile.types';

export const getAdminProfile = async () => {
  const response = await api.get<ApiResponse<Profile>>(API_ROUTES.profile.admin);
  return response.data;
};

export const createProfile = async (payload: Profile) => {
  const response = await api.post<ApiResponse<Profile>>(API_ROUTES.profile.create, payload);
  return response.data;
};

export const updateProfile = async (payload: Profile) => {
  const response = await api.put<ApiResponse<Profile>>(API_ROUTES.profile.update, payload);
  return response.data;
};
