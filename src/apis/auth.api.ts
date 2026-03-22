import api from './axios';
import { API_ROUTES } from '@/constants/apiRoutes';
import type { ApiResponse } from '@/types/api.types';
import type { AuthResponse, LoginPayload, AuthUser } from '@/types/auth.types';

export const login = async (payload: LoginPayload) => {
  const response = await api.post<ApiResponse<AuthResponse>>(API_ROUTES.auth.login, payload);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get<ApiResponse<AuthUser>>(API_ROUTES.auth.me);
  return response.data;
};
