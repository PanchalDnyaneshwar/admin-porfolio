import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#081120',
        surface: '#0F172A',
        card: '#111827',
        border: '#1E293B',
        muted: '#94A3B8',
        primary: '#38BDF8',
        secondary: '#818CF8',
        success: '#22C55E',
        danger: '#EF4444',
        warning: '#F59E0B',
      },
      maxWidth: {
        container: '1200px',
      },
      boxShadow: {
        soft: '0 16px 40px rgba(0, 0, 0, 0.25)',
      },
      backgroundImage: {
        'hero-grid':
          'linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)',
        'hero-glow':
          'radial-gradient(circle at top left, rgba(56,189,248,0.20), transparent 30%), radial-gradient(circle at top right, rgba(129,140,248,0.18), transparent 25%)',
      },
      backgroundSize: {
        grid: '40px 40px',
      },
    },
  },
  plugins: [typography],
} satisfies Config;
