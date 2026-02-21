/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--primary))',
          foreground: 'rgb(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary))',
          foreground: 'rgb(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent))',
          foreground: 'rgb(var(--accent-foreground))',
        },
        background: 'rgb(var(--background))',
        foreground: 'rgb(var(--foreground))',
        card: {
          DEFAULT: 'rgb(var(--card))',
          foreground: 'rgb(var(--card-foreground))',
        },
        border: 'rgb(var(--border))',
        input: 'rgb(var(--input))',
        'input-background': 'rgb(var(--input-background))',
        ring: 'rgb(var(--ring))',
        muted: {
          DEFAULT: 'rgb(var(--muted))',
          foreground: 'rgb(var(--muted-foreground))',
        },
        destructive: 'rgb(var(--destructive))',
        success: 'rgb(var(--success))',
        warning: 'rgb(var(--warning))',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.75rem',
        xl: '0.875rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.3)',
        glow: '0 0 20px rgba(255, 115, 0, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-in-from-left': 'slideInFromLeft 0.3s ease-out forwards',
        'slide-in-from-right': 'slideInFromRight 0.3s ease-out forwards',
        'slide-in-from-top': 'slideInFromTop 0.3s ease-out forwards',
        'slide-in-from-bottom': 'slideInFromBottom 0.3s ease-out forwards',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInFromLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInFromRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInFromTop: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideInFromBottom: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        shimmer: {
          '0%, 100%': { backgroundPosition: '-200% 0' },
          '50%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
      },
      transitionDuration: {
        200: '200ms',
        300: '300ms',
        500: '500ms',
      },
      animationDelay: {
        75: '75ms',
        100: '100ms',
        150: '150ms',
        200: '200ms',
        300: '300ms',
      },
      animationFillMode: {
        forwards: 'forwards',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'rgb(var(--muted-foreground))',
            '--tw-prose-headings': 'rgb(var(--foreground))',
            '--tw-prose-links': 'rgb(var(--primary))',
            '--tw-prose-bold': 'rgb(var(--foreground))',
            '--tw-prose-counters': 'rgb(var(--muted-foreground))',
            '--tw-prose-bullets': 'rgb(var(--muted-foreground))',
            '--tw-prose-hr': 'rgb(var(--border))',
            '--tw-prose-quotes': 'rgb(var(--foreground))',
            '--tw-prose-quote-borders': 'rgb(var(--primary))',
            '--tw-prose-captions': 'rgb(var(--muted-foreground))',
            '--tw-prose-code': 'rgb(var(--foreground))',
            '--tw-prose-pre-code': 'rgb(var(--foreground))',
            '--tw-prose-pre-bg': 'rgb(var(--muted))',
            '--tw-prose-th-borders': 'rgb(var(--border))',
            '--tw-prose-td-borders': 'rgb(var(--border))',
          },
        },
        invert: {
          css: {
            '--tw-prose-body': 'rgb(var(--muted-foreground))',
            '--tw-prose-headings': 'rgb(var(--foreground))',
            '--tw-prose-links': 'rgb(var(--primary))',
            '--tw-prose-bold': 'rgb(var(--foreground))',
            '--tw-prose-counters': 'rgb(var(--muted-foreground))',
            '--tw-prose-bullets': 'rgb(var(--muted-foreground))',
            '--tw-prose-hr': 'rgb(var(--border))',
            '--tw-prose-quotes': 'rgb(var(--foreground))',
            '--tw-prose-quote-borders': 'rgb(var(--primary))',
            '--tw-prose-captions': 'rgb(var(--muted-foreground))',
            '--tw-prose-code': 'rgb(var(--foreground))',
            '--tw-prose-pre-code': 'rgb(var(--foreground))',
            '--tw-prose-pre-bg': 'rgb(var(--muted))',
            '--tw-prose-th-borders': 'rgb(var(--border))',
            '--tw-prose-td-borders': 'rgb(var(--border))',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
