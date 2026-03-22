import api from './axios';
import { API_ROUTES } from '@/constants/apiRoutes';
import type { ApiResponse } from '@/types/api.types';
import type { Skill } from '@/types/skill.types';

export const getSkills = async () => {
  const response = await api.get<ApiResponse<Skill[]>>(API_ROUTES.skills.admin);
  return response.data;
};

export const createSkill = async (payload: Partial<Skill>) => {
  const response = await api.post<ApiResponse<Skill>>(API_ROUTES.skills.base, payload);
  return response.data;
};

export const updateSkill = async (id: string, payload: Partial<Skill>) => {
  const response = await api.put<ApiResponse<Skill>>(API_ROUTES.skills.byId(id), payload);
  return response.data;
};

export const deleteSkill = async (id: string) => {
  const response = await api.delete<ApiResponse<{ id: string }>>(API_ROUTES.skills.byId(id));
  return response.data;
};
