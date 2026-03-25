export const API_ROUTES = {
  auth: {
    login: '/auth/login',
    me: '/auth/me',
  },
  dashboard: {
    stats: '/dashboard',
  },
  profile: {
    admin: '/profile/admin',
    create: '/profile',
    update: '/profile',
  },
  settings: {
    admin: '/settings/admin',
    create: '/settings',
    update: '/settings',
  },
  skills: {
    admin: '/skills/admin',
    base: '/skills',
    byId: (id: string) => `/skills/${id}`,
  },
  experience: {
    admin: '/experience/admin',
    base: '/experience',
    byId: (id: string) => `/experience/${id}`,
  },
  projects: {
    admin: '/projects/admin',
    base: '/projects',
    byId: (id: string) => `/projects/${id}`,
  },
  blogs: {
    admin: '/blogs/admin',
    base: '/blogs',
    byId: (id: string) => `/blogs/${id}`,
  },
  media: {
    admin: '/media/admin',
    base: '/media',
    upload: '/media/upload',
    status: '/media/status',
    byId: (id: string) => `/media/${id}`,
  },
  contact: {
    admin: '/contact/admin',
    base: '/contact',
    byId: (id: string) => `/contact/${id}`,
  },
  newsletter: {
    admin: '/newsletter/admin',
  },
  mail: {
    send: '/mail/send',
    status: '/mail/status',
    templates: '/mail/templates',
    templateById: (id: string) => `/mail/templates/${id}`,
    logs: '/mail/logs',
  },
};
