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
        'bg-base': '#FBF8F3',      // 温かみのあるオフホワイト
        'bg-card': '#FFFCF5',      // クリーム系
        'text-main': '#3D2C29',    // 濃いブラウン
        'text-sub': '#8B7355',     // ミディアムブラウン
        'accent': '#E07A5F',       // コーラル
        'accent-light': '#FEF3F0', // コーラル薄め
        'border': '#E8DFD3',       // ライトベージュ
        'success': '#6A9A78',      // モスグリーン
        'warning': '#E09F3E',      // マスタード
      },
      borderRadius: {
        'soft': '16px',
        'softer': '20px',
      },
      boxShadow: {
        'warm': '0 4px 20px rgba(139, 115, 85, 0.08)',
        'warm-lg': '0 8px 30px rgba(139, 115, 85, 0.12)',
      },
      fontFamily: {
        sans: ['Noto Sans JP', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
