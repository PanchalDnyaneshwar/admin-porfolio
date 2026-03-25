import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
      extend: {
        colors: {
          background: '#08161d',
          surface: '#0e212a',
          card: '#112833',
          border: '#24424d',
          muted: '#9db2bb',
          primary: '#5ed6c0',
          secondary: '#f4b860',
          success: '#33c38b',
          danger: '#ef6a6a',
          warning: '#f4a261',
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
            'radial-gradient(circle at top left, rgba(94,214,192,0.20), transparent 30%), radial-gradient(circle at top right, rgba(244,184,96,0.16), transparent 25%), radial-gradient(circle at bottom right, rgba(89,170,255,0.12), transparent 28%)',
        },
      backgroundSize: {
        grid: '40px 40px',
      },
    },
  },
  plugins: [typography],
} satisfies Config;
