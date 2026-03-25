import api from './axios';
import { API_ROUTES } from '@/constants/apiRoutes';
import type { ApiResponse } from '@/types/api.types';
import type { Project } from '@/types/project.types';

const ADMIN_LIST_LIMIT = 1000;

export const getProjects = async () => {
  const response = await api.get<ApiResponse<Project[]>>(API_ROUTES.projects.admin, {
    params: { limit: ADMIN_LIST_LIMIT },
  });
  return response.data;
};

export const createProject = async (payload: Partial<Project>) => {
  const response = await api.post<ApiResponse<Project>>(API_ROUTES.projects.base, payload);
  return response.data;
};

export const updateProject = async (id: string, payload: Partial<Project>) => {
  const response = await api.put<ApiResponse<Project>>(API_ROUTES.projects.byId(id), payload);
  return response.data;
};

export const deleteProject = async (id: string) => {
  const response = await api.delete<ApiResponse<{ id: string }>>(API_ROUTES.projects.byId(id));
  return response.data;
};
