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
        'bg-base': '#F5F6F8',       // クールグレー
        'bg-card': '#FFFFFF',
        'text-main': '#1A1A2E',     // ほぼ黒
        'text-sub': '#5C6878',
        'accent': '#1E3A5F',        // ダークネイビー
        'line-green': '#06C755',    // LINE CTA用
        'border': '#E2E5EA',
        'warning': '#D97706',
        'gold': '#B8860B',          // ADスコア高い時
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        'card': '8px',
      },
      fontFamily: {
        sans: ['Noto Sans JP', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
