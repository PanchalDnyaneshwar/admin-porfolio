import { useLocation } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';
import { routeConfig } from '@/routes/routeConfig';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';

interface TopbarProps {
  onMenuToggle?: () => void;
}

const Topbar = ({ onMenuToggle }: TopbarProps) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const activeRoute = routeConfig.find((route) => route.path === location.pathname);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/70 bg-slate-950/70 px-6 py-4 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onMenuToggle && (
            <button
              type="button"
              className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 lg:hidden"
              onClick={onMenuToggle}
            >
              <Menu className="h-4 w-4" />
            </button>
          )}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Admin</p>
            <h2 className="text-lg font-semibold text-slate-100">
              {activeRoute?.label ?? 'Overview'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-100">{user?.name ?? 'Admin'}</p>
            <p className="text-xs text-slate-400">{user?.email ?? ''}</p>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
