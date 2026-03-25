export interface SendMailPayload {
  to: string;
  subject: string;
  message: string;
  replyTo?: string;
  html?: string;
}

export interface EmailTemplate {
  _id: string;
  name: string;
  subject: string;
  html: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmailLog {
  _id: string;
  to: string;
  subject: string;
  message: string;
  html?: string;
  status: 'SENT' | 'FAILED';
  error?: string;
  createdAt?: string;
}

export interface MailServiceStatus {
  configured: boolean;
  host: string | null;
  port: number;
  from: string | null;
}
