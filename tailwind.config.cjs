/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-main',
    'bg-surface',
    'bg-surface-hover',
    'text-content',
    'text-muted',
    'border-subtle',
    'placeholder-content',
    { pattern: /bg-main\/.*/ },
    { pattern: /bg-surface\/.*/ },
    { pattern: /text-content\/.*/ },
    { pattern: /text-muted\/.*/ },
    { pattern: /border-subtle\/.*/ },
    { pattern: /bg-content\/.*/ },
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FBF9F1',
          100: '#F6F0DC',
          200: '#EADEB5',
          300: '#DEC689',
          400: '#D4AF57',
          500: '#C59B27',
          600: '#A37E1C',
          700: '#826213',
          800: '#644A11',
          900: '#543D11',
          950: '#302105',
        },
        main: 'rgb(var(--bg-main) / <alpha-value>)',
        surface: 'rgb(var(--bg-surface) / <alpha-value>)',
        'surface-hover': 'rgb(var(--bg-surface-hover) / <alpha-value>)',
        content: 'rgb(var(--text-main) / <alpha-value>)',
        muted: 'rgb(var(--text-muted) / <alpha-value>)',
        border: {
          subtle: 'rgb(var(--border-subtle) / <alpha-value>)',
        },
        white: '#ffffff',
        black: '#000000',
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #FDFBF7 0%, #F5F2EA 50%, #FDFBF7 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.01) 100%)',
        'orange-glow': 'radial-gradient(ellipse at center, rgba(197,155,39,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'glow': '0 0 30px rgba(197,155,39,0.2)',
        'glow-lg': '0 0 60px rgba(197,155,39,0.3)',
        'card': '0 8px 32px rgba(0,0,0,0.06)',
        'card-hover': '0 12px 40px rgba(0,0,0,0.1), 0 0 20px rgba(197,155,39,0.15)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: 0 },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
