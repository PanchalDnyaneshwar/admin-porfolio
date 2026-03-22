import api from './axios';
import { API_ROUTES } from '@/constants/apiRoutes';
import type { ApiResponse } from '@/types/api.types';
import type { Subscriber } from '@/types/subscriber.types';

export const getSubscribers = async () => {
  const response = await api.get<ApiResponse<Subscriber[]>>(API_ROUTES.newsletter.admin);
  return response.data;
};
