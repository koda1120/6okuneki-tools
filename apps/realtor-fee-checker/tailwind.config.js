/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/shared/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': '#F5F7FA',
        'bg-card': '#FFFFFF',
        'text-main': '#1E2A3B',
        'text-sub': '#5A6978',
        'accent': '#2C4A7C',
        'line-green': '#06C755',
        'border': '#D8DEE6',
        'warning': '#E5A73B',
      },
      fontFamily: {
        sans: ['Noto Sans JP', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
