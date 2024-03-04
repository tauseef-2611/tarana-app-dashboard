/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        // Add more font families as needed
      },
    },
  },
  plugins: [],
  purge: {
    content: [
      // ...
      './src/**/*.jsx',
      './src/**/*.js',
    ],
    // ...
  },
}

