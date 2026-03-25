import { useLocation } from 'react-router-dom';
import { LogOut, Menu, PanelLeftClose } from 'lucide-react';
import { routeConfig } from '@/routes/routeConfig';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';

interface TopbarProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

const Topbar = ({ onMenuToggle, isMenuOpen }: TopbarProps) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const activeRoute = routeConfig.find((route) => route.path === location.pathname);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/70 bg-slate-950/70 px-4 py-4 backdrop-blur xl:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onMenuToggle && (
            <button
              type="button"
              className="rounded-xl border border-slate-800 bg-slate-900/70 p-2 text-slate-200 hover:bg-slate-800 lg:hidden"
              onClick={onMenuToggle}
            >
              {isMenuOpen ? <PanelLeftClose className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          )}
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Workspace</p>
            <h2 className="text-xl font-semibold text-slate-50">{activeRoute?.label ?? 'Overview'}</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-2 text-right">
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
