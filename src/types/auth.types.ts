export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive?: boolean;
  lastLogin?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}
