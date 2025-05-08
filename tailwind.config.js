/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
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
          50: '#FFEBEE', // Lightest red
          100: '#FFCDD2',
          200: '#EF9A9A',
          300: '#E57373',
          400: '#EF5350',
          500: '#D32F2F', // Main primary red
          600: '#C62828', 
          700: '#B71C1C',
          800: '#8B0000',
          900: '#700000',
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
        'light-bg': '#F8F9FA', // Very light gray
        'light-bg-alt': '#F1F3F5', // Slightly darker light gray
        'light-border': '#E9ECEF', // Light border color
        'light-text': '#495057', // Main text color for light theme
        'light-text-secondary': '#6C757D', // Secondary text color
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
  plugins: [],
}; 