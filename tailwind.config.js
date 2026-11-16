/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clay: {
          bg: '#f1f3f6',
          blue: '#b8d8e6',
          purple: '#9b91e5',
          mint: '#a0dfd4',
          pink: '#f3a2b7'
        }
      }
    }
  },
  plugins: [],
}