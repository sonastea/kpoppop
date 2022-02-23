module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        once: {
          DEFAULT: '#FF5FA2',
          50: '#FFFFFF',
          100: '#FFFFFF',
          200: '#FFD9E9',
          300: '#FFB1D1',
          400: '#FF88BA',
          500: '#FF5FA2',
          600: '#FF2781',
          700: '#EE0064',
          800: '#B6004C',
          900: '#7E0035',
        },
        error: {
          DEFAULT: '#B11212'
        }
      },
      transformOrigin: {
        '0': '0%',
      },
      zIndex: {
        '-1': '-1',
        '-10': '-10',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
