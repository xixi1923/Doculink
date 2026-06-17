/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Plus Jakarta Sans"', 'serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#4db5b9', // Teal color from the image
          dark: '#3a8d91',
          light: '#72ccd0',
        },
        secondary: '#f59e0b',
      },
    },
  },
  plugins: [],
}
