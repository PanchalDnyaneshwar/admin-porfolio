import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import toast from 'react-hot-toast';
import { login as loginApi, getProfile } from '@/apis/auth.api';
import type { AuthUser, LoginPayload } from '@/types/auth.types';
import {
  clearStoredUser,
  clearToken,
  getStoredUser,
  getToken,
  setStoredUser,
  setToken,
} from '@/utils/storage';
import { getErrorMessage } from '@/utils/errors';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_STORAGE_EVENT = 'auth:unauthorized';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser<AuthUser>());
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    clearToken();
    clearStoredUser();
  }, []);

  const refreshProfile = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await getProfile();
      setUser(response.data);
      setStoredUser(response.data);
    } catch (error) {
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  useEffect(() => {
    const handler = () => {
      toast.error('Your session has expired. Please log in again.');
      logout();
    };

    window.addEventListener(AUTH_STORAGE_EVENT, handler);
    return () => window.removeEventListener(AUTH_STORAGE_EVENT, handler);
  }, [logout]);

  const handleLogin = useCallback(async (payload: LoginPayload) => {
    try {
      const response = await loginApi(payload);
      setToken(response.data.accessToken);
      setUser(response.data.user);
      setStoredUser(response.data.user);
      toast.success('Welcome back');
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return false;
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login: handleLogin,
      logout,
    }),
    [user, isLoading, handleLogin, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
