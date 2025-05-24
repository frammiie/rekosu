/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fade-in 200ms ease-in-out',
        tap: 'tap 175ms ease-in alternate infinite',
        'expand-width': 'expand-width 390ms ease-out',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        tap: {
          '0%': { opacity: 1, transform: 'scale(1.0)' },
          '100%': { opacity: 0.5, transform: 'scale(0.8)' },
        },
        'expand-width': {
          '0%': { transform: 'scaleX(0.0)' },
          '100%': { transform: 'scaleX(1.0)' },
        },
      },
    },
  },
  plugins: [],
};
