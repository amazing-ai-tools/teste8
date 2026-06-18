/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        municipal: {
          blue: '#1e3a8a',
          'blue-light': '#3b82f6',
          green: '#166534',
          gray: '#475569',
          'gray-light': '#f1f5f9',
        }
      }
    },
  },
  plugins: [],
}
