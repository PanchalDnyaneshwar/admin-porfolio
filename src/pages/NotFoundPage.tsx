import { Link } from 'react-router-dom';
import { APP_ROUTES } from '@/constants/appRoutes';
import Button from '@/components/ui/Button';

const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-hero-glow bg-grid px-4 text-center">
    <div className="max-w-md space-y-4">
      <p className="text-6xl font-bold text-slate-100">404</p>
      <p className="text-lg text-slate-300">Page not found</p>
      <p className="text-sm text-slate-500">The page you are looking for does not exist.</p>
      <Link to={APP_ROUTES.dashboard}>
        <Button>Back to dashboard</Button>
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
