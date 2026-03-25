function resolveApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL;
  const trimmed = typeof raw === 'string' ? raw.trim() : '';

  if (trimmed) {
    return trimmed.replace(/\/$/, '');
  }

  if (import.meta.env.PROD) {
    throw new Error(
      'VITE_API_BASE_URL is required for production builds. Set it in Vercel project settings.',
    );
  }

  console.warn(
    '[api] VITE_API_BASE_URL is not set; using http://localhost:5000 for development.',
  );
  return 'http://localhost:5000';
}

export const API_BASE_URL = resolveApiBaseUrl();
