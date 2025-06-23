/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'chakra-dark': '#121212',
        'chakra-dark-light': '#282828',
        'chakra-accent': '#1DB954',
        'chakra-text': '#FFFFFF',
        'chakra-subtext': '#B3B3B3',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        chakra: {
          primary: "#1DB954",
          secondary: "#1ED760",
          accent: "#535353",
          neutral: "#121212",
          "base-100": "#191414",
          "base-200": "#282828",
          "base-300": "#181818",
          info: "#3ABFF8",
          success: "#1DB954",
          warning: "#FBBD23",
          error: "#F87272",
        },
      },
    ],
  },
}
