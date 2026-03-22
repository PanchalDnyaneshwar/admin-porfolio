const TOKEN_KEY = 'portfolio_admin_token';
const USER_KEY = 'portfolio_admin_user';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getStoredUser = <T,>() => {
  const value = localStorage.getItem(USER_KEY);
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

export const setStoredUser = (user: unknown) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearStoredUser = () => {
  localStorage.removeItem(USER_KEY);
};
