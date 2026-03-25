import api from './axios';
import { API_ROUTES } from '@/constants/apiRoutes';
import type { ApiResponse } from '@/types/api.types';
import type { ContactMessage } from '@/types/message.types';

const ADMIN_LIST_LIMIT = 1000;

export const getMessages = async () => {
  const response = await api.get<ApiResponse<ContactMessage[]>>(API_ROUTES.contact.admin, {
    params: { limit: ADMIN_LIST_LIMIT },
  });
  return response.data;
};

export const updateMessage = async (id: string, payload: Partial<ContactMessage>) => {
  const response = await api.patch<ApiResponse<ContactMessage>>(API_ROUTES.contact.byId(id), payload);
  return response.data;
};

export const deleteMessage = async (id: string) => {
  const response = await api.delete<ApiResponse<{ id: string }>>(API_ROUTES.contact.byId(id));
  return response.data;
};
