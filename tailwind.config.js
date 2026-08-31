/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 10px 30px rgba(120, 53, 15, 0.10)',
      },
      colors: {
        saffron: {
          50: '#fff9ed',
          100: '#ffefc9',
          500: '#d97706',
          700: '#a94b09',
          900: '#78350f',
        },
      },
    },
  },
  plugins: [],
}
