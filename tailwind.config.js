/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#ED1847',
          secondary: '#5B2EFF',
          background: '#F8F7FF',
          surface: '#FFFFFF',
          text: '#18181B',
          textMuted: '#64748B',
        },
      },
      fontFamily: {
        inter: ['Inter_400Regular'],
        'inter-bold': ['Inter_700Bold'],
      },
    },
  },
  plugins: [],
};
