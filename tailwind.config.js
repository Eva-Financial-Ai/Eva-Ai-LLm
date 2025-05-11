/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // Enable dark mode based on class
  theme: {
    extend: {
      fontFamily: {
        sans: ['Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        'risk-red': {
          DEFAULT: '#D32F2F', // A suitable red for risk/alerts
          light: '#EF5350',
          dark: '#B71C1C',
        },
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        secondary: {
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Add silver lining colors and white
        'silver': {
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
        },
        // Keep light background variants
        'light-bg': '#f8f9fa', // Main background for light theme
        'dark-bg': '#121212', // Main background for dark theme
        'light-border': '#E9ECEF', // Light border color
        'light-text': '#495057', // Main text color for light theme
        'dark-text': '#f5f5f5', // Main text color for dark theme
        'light-text-secondary': '#6C757D', // Secondary text color
        'dark-card': '#1e1e1e', // Card background for dark theme
      },
      // Add custom width and height values for the 21% larger sidebar
      width: {
        '18': '4.5rem',  // Original collapsed sidebar width
        '22': '5.5rem',  // 21% larger collapsed sidebar width
        '64': '16rem',   // Original expanded sidebar width
        '76': '19rem',   // 21% larger expanded sidebar width
      },
      height: {
        '14': '3.5rem',  // Original header height
        '17': '4.25rem', // 21% larger header height
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-in-out',
      },
    },
  },
  plugins: [
    // Add plugins if you need them, but they must be installed
  ],
  variants: {
    extend: {
      backgroundColor: ['dark'],
      textColor: ['dark'],
      borderColor: ['dark'],
    },
  },
}; 