/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", 
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        custom: "0px 7px 29px 0px rgba(100, 100, 111, 0.2)",
      },
    },
  },
  plugins: [],
}