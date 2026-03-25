import { NavLink } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { routeConfig } from '@/routes/routeConfig';
import { cn } from '@/utils/cn';

const Sidebar = ({ className }: { className?: string }) => (
  <aside
    className={cn(
      'flex w-72 flex-col border-r border-slate-800/80 bg-slate-950/85 px-5 py-5 backdrop-blur-xl',
      className,
    )}
  >
    <div className="mb-8 rounded-[1.6rem] border border-slate-800/80 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-5">
      <div className="mb-4 inline-flex rounded-2xl bg-primary/15 p-3 text-primary">
        <Sparkles className="h-5 w-5" />
      </div>
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Portfolio admin</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-50">Control Center</h1>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        Manage content, assets, and communication from one polished workspace.
      </p>
    </div>

    <nav className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
      {routeConfig.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-900/75 hover:text-slate-100',
                isActive && 'bg-gradient-to-r from-primary/20 to-secondary/15 text-slate-50 ring-1 ring-primary/30',
              )
            }
          >
            <span className="rounded-xl bg-slate-900/90 p-2 text-slate-300 transition group-hover:text-slate-50">
              <Icon className="h-4 w-4" />
            </span>
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>

    <div className="mt-6 rounded-[1.4rem] border border-slate-800/80 bg-slate-900/70 p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Workflow tip</p>
      <p className="mt-2 text-sm leading-6 text-slate-300">
        Upload assets first, then reuse them across profile, settings, projects, and blogs.
      </p>
    </div>
  </aside>
);

export default Sidebar;
