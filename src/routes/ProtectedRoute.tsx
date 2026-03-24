import type { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { APP_ROUTES } from '@/constants/appRoutes';
import { useAuth } from '@/hooks/useAuth';
import LoadingState from '@/components/ui/LoadingState';

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="p-6">
        <LoadingState label="Checking session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.login} replace />;
  }

  return children;
};

export default ProtectedRoute;
