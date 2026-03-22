import { NavLink } from 'react-router-dom';
import { routeConfig } from '@/routes/routeConfig';
import { cn } from '@/utils/cn';

const Sidebar = ({ className }: { className?: string }) => (
  <aside
    className={cn(
      'flex w-64 flex-col border-r border-slate-800/80 bg-slate-950/80 px-5 py-6',
      className,
    )}
  >
    <div className="mb-10">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Portfolio</p>
      <h1 className="text-2xl font-semibold text-slate-100">Admin Panel</h1>
    </div>

    <nav className="flex flex-1 flex-col gap-2">
      {routeConfig.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-900/70',
                isActive && 'bg-slate-900/90 text-slate-100 ring-1 ring-slate-700/50',
              )
            }
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>

    <div className="mt-6 rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-4 text-xs text-slate-400">
      Keep your portfolio fresh with quick updates.
    </div>
  </aside>
);

export default Sidebar;
