import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import ProtectedRoute from '@/routes/ProtectedRoute';
import { APP_ROUTES } from '@/constants/appRoutes';

const LoginPage = lazy(() => import('@/pages/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const SkillsPage = lazy(() => import('@/pages/SkillsPage'));
const ExperiencePage = lazy(() => import('@/pages/ExperiencePage'));
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage'));
const BlogsPage = lazy(() => import('@/pages/BlogsPage'));
const MediaPage = lazy(() => import('@/pages/MediaPage'));
const MessagesPage = lazy(() => import('@/pages/MessagesPage'));
const SubscribersPage = lazy(() => import('@/pages/SubscribersPage'));
const EmailPage = lazy(() => import('@/pages/EmailPage'));
const EmailTemplatesPage = lazy(() => import('@/pages/EmailTemplatesPage'));
const EmailHistoryPage = lazy(() => import('@/pages/EmailHistoryPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-slate-400">
      Loading…
    </div>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path={APP_ROUTES.login} element={<LoginPage />} />

        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path={APP_ROUTES.dashboard} element={<DashboardPage />} />
          <Route path={APP_ROUTES.profile} element={<ProfilePage />} />
          <Route path={APP_ROUTES.settings} element={<SettingsPage />} />
          <Route path={APP_ROUTES.skills} element={<SkillsPage />} />
          <Route path={APP_ROUTES.experience} element={<ExperiencePage />} />
          <Route path={APP_ROUTES.projects} element={<ProjectsPage />} />
          <Route path={APP_ROUTES.blogs} element={<BlogsPage />} />
          <Route path={APP_ROUTES.media} element={<MediaPage />} />
          <Route path={APP_ROUTES.messages} element={<MessagesPage />} />
          <Route path={APP_ROUTES.email} element={<EmailPage />} />
          <Route
            path={APP_ROUTES.emailTemplates}
            element={<EmailTemplatesPage />}
          />
          <Route
            path={APP_ROUTES.emailHistory}
            element={<EmailHistoryPage />}
          />
          <Route path={APP_ROUTES.subscribers} element={<SubscribersPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
