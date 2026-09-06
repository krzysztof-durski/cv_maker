/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gray: {
          750: '#293241',
          850: '#18212f',
        },
      },
      keyframes: {
        'menu-in': {
          '0%': { opacity: '0', transform: 'translateY(-4px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'menu-in': 'menu-in 0.12s ease-out',
      },
    },
  },
  plugins: [],
}
