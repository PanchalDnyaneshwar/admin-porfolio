import api from './axios';
import { API_ROUTES } from '@/constants/apiRoutes';
import type { ApiResponse } from '@/types/api.types';
import type { Subscriber } from '@/types/subscriber.types';

const ADMIN_LIST_LIMIT = 1000;

export const getSubscribers = async () => {
  const response = await api.get<ApiResponse<Subscriber[]>>(API_ROUTES.newsletter.admin, {
    params: { limit: ADMIN_LIST_LIMIT },
  });
  return response.data;
};
