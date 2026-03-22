import { Route, Routes } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import ProtectedRoute from '@/routes/ProtectedRoute';
import { APP_ROUTES } from '@/constants/appRoutes';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import ProfilePage from '@/pages/ProfilePage';
import SettingsPage from '@/pages/SettingsPage';
import SkillsPage from '@/pages/SkillsPage';
import ExperiencePage from '@/pages/ExperiencePage';
import ProjectsPage from '@/pages/ProjectsPage';
import BlogsPage from '@/pages/BlogsPage';
import MediaPage from '@/pages/MediaPage';
import MessagesPage from '@/pages/MessagesPage';
import SubscribersPage from '@/pages/SubscribersPage';
import NotFoundPage from '@/pages/NotFoundPage';

function AppRoutes() {
  return (
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
        <Route path={APP_ROUTES.subscribers} element={<SubscribersPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
