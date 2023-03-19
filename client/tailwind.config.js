module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/**/*.html',
    './src/components/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 2s linear infinite',
      },
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
        ponce: {
          DEFAULT: '#FCC89B',
          50: '#FFFFFF',
          100: '#FFFFFF',
          200: '#FFFFFF',
          300: '#FEF4EA',
          400: '#FDDEC3',
          500: '#FCC89B',
          600: '#FAAA65',
          700: '#F98C2E',
          800: '#E86F07',
          900: '#B15505',
        },
        error: {
          DEFAULT: '#B11212',
        },
        thrice: {
          DEFAULT: '#860038',
        },
      },
      maxHeight: {
        'lg': '32rem',
        '2xl': '42rem',
      },
      transformOrigin: {
        0: '0%',
      },
      zIndex: {
        '-1': '-1',
        '-10': '-10',
        100: '100',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
