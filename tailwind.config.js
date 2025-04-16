/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#4F46E5',
        'secondary': '#10B981',
        'accent': '#F59E0B',
        'danger': '#EF4444',
        'neutral-dark': '#1F2937',
        'neutral-light': '#F3F4F6',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      }
    },
  },
  plugins: [],
}