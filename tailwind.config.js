/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        black: {
          DEFAULT: '#19171a',
          50: '#f7f7f8',
          100: '#f0eef0',
          200: '#dcd9de',
          300: '#bdb8c1',
          400: '#99919f',
          500: '#7d7384',
          600: '#665d6c',
          700: '#534c58',
          800: '#48414b',
          900: '#3e3941',
          950: '#19171a'
        },
        shark: {
          DEFAULT: '#252a34',
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d4dae3',
          300: '#afbaca',
          400: '#8495ac',
          500: '#657892',
          600: '#506079',
          700: '#414e63',
          800: '#394353',
          900: '#333b47',
          950: '#252a34'
        },
        gray: {
          DEFAULT: '#eaeaea',
          50: '#f8f8f8',
          100: '#eaeaea',
          200: '#dcdcdc',
          300: '#bdbdbd',
          400: '#989898',
          500: '#7c7c7c',
          600: '#656565',
          700: '#525252',
          800: '#464646',
          900: '#3d3d3d',
          950: '#292929'
        },
        red: {
          DEFAULT: '#FF2E63',
          50: '#fff0f2',
          100: '#ffe2e7',
          200: '#ffcad5',
          300: '#ff9fb3',
          400: '#ff698b',
          500: '#ff2e63',
          600: '#ed1153',
          700: '#c80847',
          800: '#a80942',
          900: '#8f0c3f',
          950: '#50011e'
        },
        teal: {
          DEFAULT: '#08D9D6',
          50: '#effefc',
          100: '#c8fff8',
          200: '#92fdf2',
          300: '#53f5ea',
          400: '#20e1db',
          500: '#08d9d6',
          600: '#039c9e',
          700: '#077c7e',
          800: '#0b6264',
          900: '#0e5153',
          950: '#012e32'
        }
      },
      fontFamily: {
        body: '"Roboto", sans-serif',
        heading: '"Josefin Sans", sans-serif'
      }
    }
  },
  plugins: []
}
