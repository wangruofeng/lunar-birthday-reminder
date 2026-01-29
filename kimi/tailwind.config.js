/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        '4xl': '2.5rem',
        '5xl': '3rem',
      },
      boxShadow: {
        'cute': '0 4px 20px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
