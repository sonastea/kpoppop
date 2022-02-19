module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        kpink: '#FF5FA2',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
