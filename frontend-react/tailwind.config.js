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
          light: '#006495',
          dark: '#8ECAFF'
        },
        surface: {
          light: '#FCFCFF',
          dark: '#1A1C1E'
        }
      }
    },
  },
  plugins: [],
}

