import type { ThemeMode } from '@/store/store';

export const lightColors = {
  primary: '#ED1847',
  secondary: '#5B2EFF',
  background: '#F8F7FF',
  surface: '#FFFFFF',
  text: '#18181B',
  textMuted: '#64748B',
  border: '#E2E8F0',
};

export const darkColors = {
  primary: '#ED1847',
  secondary: '#8B6CFF',
  background: '#09090B',
  surface: '#18181B',
  text: '#F4F4F5',
  textMuted: '#A1A1AA',
  border: '#27272A',
};

export const getBrandColors = (mode: ThemeMode) => (mode === 'dark' ? darkColors : lightColors);

export const brandTypography = {
  title: 'Inter_700Bold',
  body: 'Inter_400Regular',
};
