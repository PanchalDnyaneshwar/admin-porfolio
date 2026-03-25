import api from './axios';
import { API_ROUTES } from '@/constants/apiRoutes';
import type { ApiResponse } from '@/types/api.types';
import type {
  EmailLog,
  EmailTemplate,
  MailServiceStatus,
  SendMailPayload,
} from '@/types/mail.types';

const ADMIN_LIST_LIMIT = 1000;

export const sendMail = async (payload: SendMailPayload) => {
  const response = await api.post<ApiResponse<{ to: string }>>(API_ROUTES.mail.send, payload);
  return response.data;
};

export const getMailStatus = async () => {
  const response = await api.get<ApiResponse<MailServiceStatus>>(API_ROUTES.mail.status);
  return response.data;
};

export const getEmailTemplates = async () => {
  const response = await api.get<ApiResponse<EmailTemplate[]>>(API_ROUTES.mail.templates, {
    params: { limit: ADMIN_LIST_LIMIT },
  });
  return response.data;
};

export const createEmailTemplate = async (payload: Partial<EmailTemplate>) => {
  const response = await api.post<ApiResponse<EmailTemplate>>(API_ROUTES.mail.templates, payload);
  return response.data;
};

export const updateEmailTemplate = async (id: string, payload: Partial<EmailTemplate>) => {
  const response = await api.put<ApiResponse<EmailTemplate>>(API_ROUTES.mail.templateById(id), payload);
  return response.data;
};

export const deleteEmailTemplate = async (id: string) => {
  const response = await api.delete<ApiResponse<{ id: string }>>(API_ROUTES.mail.templateById(id));
  return response.data;
};

export const getEmailLogs = async () => {
  const response = await api.get<ApiResponse<EmailLog[]>>(API_ROUTES.mail.logs, {
    params: { limit: ADMIN_LIST_LIMIT },
  });
  return response.data;
};
