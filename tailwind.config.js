import { theme } from './lib/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ...theme.colors,
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: theme.colors.primary,
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: theme.colors.secondary,
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: theme.colors.error,
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: theme.colors.muted,
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: theme.colors.accent,
          foreground: '#ffffff',
        },
      },
      backgroundImage: {
        'gradient-primary': theme.gradients.primary,
        'gradient-secondary': theme.gradients.secondary,
        'gradient-accent': theme.gradients.accent,
        'gradient-success': theme.gradients.success,
        'gradient-warning': theme.gradients.warning,
      },
      boxShadow: theme.shadows,
    },
  },
  plugins: [require('tailwindcss-animate')],
} 