/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "split-open": {
          "0%": { top: "50%", height: "1px" },
          "50%": { top: "0", height: "50%" },
          "100%": { top: "0", height: "100%" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0", visibility: "hidden" },
        },
      },
      animation: {
        "split-open": "split-open 2s forwards",
        "fade-in": "fade-in 1s 2s forwards", // Delay to sync with split animation
        bounce: "bounce 1s infinite",
        "fade-out": "fade-out 1s forwards",
      },
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