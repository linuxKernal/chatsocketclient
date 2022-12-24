/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.js"],
  theme: {
    extend: {
      fontFamily:{
          poppins:  "'Poppins', sans-serif"
      },
      screens: {
        '2xl': {'max': '2000px'},
        'xl': {'max': '1279px'},
        'lg': {'max': '800px'},
        'md': {'max': '767px'},
        'sm': {'max': '639px'},
      },
    },
  },
  plugins: [],
}
