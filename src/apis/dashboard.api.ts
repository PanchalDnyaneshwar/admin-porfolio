import api from './axios';
import { API_ROUTES } from '@/constants/apiRoutes';
import type { ApiResponse } from '@/types/api.types';
import type { DashboardStats } from '@/types/dashboard.types';

export const getDashboardStats = async () => {
  const response = await api.get<ApiResponse<DashboardStats>>(API_ROUTES.dashboard.stats);
  return response.data;
};
