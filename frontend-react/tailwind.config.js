/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#006495',
          dark: '#8ECAFF',
          'container-light': '#C8E6FF',
          'container-dark': '#004B70',
        },
        secondary: {
          light: '#4F606E',
          dark: '#B7C9D9',
        },
        surface: {
          light: '#FCFCFF',
          dark: '#1A1C1E',
          'variant-light': '#DDE3EA',
          'variant-dark': '#41484D',
        },
        'on-primary-container': {
          light: '#001E30',
          dark: '#C8E6FF',
        },
      },
      animation: {
        'in': 'animateIn 0.5s ease-out',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'tilt': 'tilt 10s infinite linear',
      },
      keyframes: {
        animateIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        tilt: {
            '0%, 100%': { transform: 'rotate(0deg)' },
            '25%': { transform: 'rotate(0.5deg)' },
            '75%': { transform: 'rotate(-0.5deg)' },
        }
      }
    },
  },
  plugins: [],
}
