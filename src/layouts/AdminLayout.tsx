import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { cn } from '@/utils/cn';

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-slate-200">
      <div className="flex">
        <Sidebar className="sticky top-0 hidden h-screen lg:flex" />

        <div className="flex-1">
          <Topbar onMenuToggle={() => setMobileOpen((prev) => !prev)} />

          <main className="relative min-h-[calc(100vh-80px)] bg-hero-glow bg-grid px-6 py-8">
            <Outlet />
          </main>
        </div>
      </div>

      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/60 transition-opacity lg:hidden',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setMobileOpen(false)}
      />
      <div
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-64 transform transition-transform lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <Sidebar className="h-full" />
      </div>
    </div>
  );
};

export default AdminLayout;
