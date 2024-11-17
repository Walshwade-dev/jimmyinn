/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      backgroundImage: {
        'header-bg': "url('/src/images/bgheader.png')",
      }
    },
  },
  plugins: [],
}