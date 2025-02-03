/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        title: ['Bebas Neue', 'cursive'],
      },
      colors: {
        black: '#000000',
        white: '#FFFFFF',
        fadedGray: '#A0A0A0',
      },
    },
  },
  plugins: [],
};