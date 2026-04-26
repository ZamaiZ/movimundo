/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#ED1847',
          'primary-muted': '#FFD7E2',
          secondary: '#5B2EFF',
          background: '#F8F7FF',
          surface: '#FFFFFF',
          'surface-muted': '#F2EEFF',
          text: '#0F172A',
          'text-muted': '#64748B',
          border: '#E2E8F0',
          success: '#16A34A',
          warning: '#EA580C',
        },
      },
      fontFamily: {
        inter: ['Inter_400Regular'],
        'inter-bold': ['Inter_700Bold'],
        'inter-semibold': ['Inter_600SemiBold'],
        outfit: ['Outfit_600SemiBold'],
        'outfit-bold': ['Outfit_700Bold'],
      },
    },
  },
  plugins: [],
};
