import {
  LayoutDashboard,
  User,
  Settings,
  Layers,
  Briefcase,
  FolderKanban,
  BookOpen,
  Image,
  Mail,
  Users,
  Send,
  FileText,
  History,
} from 'lucide-react';
import { APP_ROUTES } from '@/constants/appRoutes';

export const routeConfig = [
  { path: APP_ROUTES.dashboard, label: 'Dashboard', icon: LayoutDashboard },
  { path: APP_ROUTES.profile, label: 'Profile', icon: User },
  { path: APP_ROUTES.settings, label: 'Settings', icon: Settings },
  { path: APP_ROUTES.skills, label: 'Skills', icon: Layers },
  { path: APP_ROUTES.experience, label: 'Experience', icon: Briefcase },
  { path: APP_ROUTES.projects, label: 'Projects', icon: FolderKanban },
  { path: APP_ROUTES.blogs, label: 'Blogs', icon: BookOpen },
  { path: APP_ROUTES.media, label: 'Media', icon: Image },
  { path: APP_ROUTES.messages, label: 'Messages', icon: Mail },
  { path: APP_ROUTES.email, label: 'Email', icon: Send },
  { path: APP_ROUTES.emailTemplates, label: 'Email Templates', icon: FileText },
  { path: APP_ROUTES.emailHistory, label: 'Email History', icon: History },
  { path: APP_ROUTES.subscribers, label: 'Subscribers', icon: Users },
];
