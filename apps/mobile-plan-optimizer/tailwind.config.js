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
        'bg-base': '#FAFAFA',       // 純白に近いグレー
        'bg-card': '#FFFFFF',
        'text-main': '#111827',     // ほぼ黒
        'text-sub': '#6B7280',
        'accent': '#0891B2',        // シアン
        'border': '#E5E7EB',
        'success': '#10B981',       // 節約額の強調用
        'warning': '#F59E0B',
      },
      fontFamily: {
        sans: ['Noto Sans JP', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
