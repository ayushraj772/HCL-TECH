/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      colors: {
        ink: {
          50: '#f7f7f6',
          100: '#ececea',
          200: '#d6d5d2',
          300: '#b4b2ad',
          400: '#8a8882',
          500: '#6b6965',
          600: '#54524f',
          700: '#403f3c',
          800: '#2a2a28',
          900: '#1a1a19',
        },
        accent: {
          500: '#4a5a4c',
          600: '#3b4a3d',
          700: '#2e3a30',
        },
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(15, 17, 21, 0.08)',
        'glass-lg': '0 20px 60px -15px rgba(15, 17, 21, 0.15)',
        soft: '0 1px 2px rgba(15,17,21,0.04), 0 2px 8px rgba(15,17,21,0.04)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
