import api from './axios';
import { API_ROUTES } from '@/constants/apiRoutes';
import type { ApiResponse } from '@/types/api.types';
import type { Media, MediaServiceStatus, MediaUploadPayload } from '@/types/media.types';

const ADMIN_LIST_LIMIT = 1000;

export const getMedia = async () => {
  const response = await api.get<ApiResponse<Media[]>>(API_ROUTES.media.admin, {
    params: { limit: ADMIN_LIST_LIMIT },
  });
  return response.data;
};

export const createMedia = async (payload: Partial<Media>) => {
  const response = await api.post<ApiResponse<Media>>(API_ROUTES.media.base, payload);
  return response.data;
};

export const uploadMedia = async (payload: MediaUploadPayload) => {
  const formData = new FormData();
  formData.append('file', payload.file);

  if (payload.alt) {
    formData.append('alt', payload.alt);
  }

  if (payload.type) {
    formData.append('type', payload.type);
  }

  const response = await api.post<ApiResponse<Media>>(API_ROUTES.media.upload, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const getMediaStatus = async () => {
  const response = await api.get<ApiResponse<MediaServiceStatus>>(API_ROUTES.media.status);
  return response.data;
};

export const deleteMedia = async (id: string) => {
  const response = await api.delete<ApiResponse<{ id: string }>>(API_ROUTES.media.byId(id));
  return response.data;
};
