/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Light Mode Colors
        light: {
          background: '#f7fafc',
          primaryEl: '#ffffff',
          accent: '#3182ce',
          text: '#1a202c',
          correct: '#38a169',
          incorrect: '#e53e3e',
        },
        // Dark Mode Colors
        dark: {
          background: '#1a202c',
          primaryEl: '#2d3748',
          accent: '#4299e1',
          text: '#f7fafc',
          correct: '#48bb78',
          incorrect: '#f56565',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
