/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f9fd',
          100: '#d1f3fb',
          200: '#a3e7f7',
          300: '#75dbf3',
          400: '#47cfef',
          500: '#19c3eb',
          600: '#149cb2',
          700: '#0f7589',
          800: '#0a4e60',
          900: '#052737',
        },
        secondary: {
          50: '#fff1f0',
          100: '#ffe3e0',
          200: '#ffc7c0',
          300: '#ffab9f',
          400: '#ff8f7f',
          500: '#ff1e00',
          600: '#cc1800',
          700: '#991200',
          800: '#660c00',
          900: '#330600',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#59ce8f',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        error: {
          light: '#502626',
          DEFAULT: '#CF6679',
          dark: '#EDC0C0'
        },
        theme: {
          'bg-dark': '#1a1a1a',
          'bg-light': '#2d2d2d',
          'bg-lighter': '#404040',
          'text-DEFAULT': '#e8f9fd',
          'text-light': '#ffffff',
          'text-muted': '#a3a3a3',
          'border-DEFAULT': '#404040',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

