import type { ThemeMode } from '@/store/store';

export const lightColors = {
  primary: '#ED1847',
  secondary: '#5B2EFF',
  background: '#F8F7FF',
  surface: '#FFFFFF',
  surfaceMuted: '#F1F5F9',
  text: '#18181B',
  textMuted: '#64748B',
  textOnPrimary: '#FFFFFF',
  border: '#E2E8F0',
  success: '#16A34A',
  warning: '#EA580C',
};

export const darkColors = {
  primary: '#ED1847',
  secondary: '#8B6CFF',
  background: '#09090B',
  surface: '#18181B',
  surfaceMuted: '#27272A',
  text: '#F4F4F5',
  textMuted: '#A1A1AA',
  textOnPrimary: '#FFFFFF',
  border: '#27272A',
  success: '#22C55E',
  warning: '#FB923C',
};

export const getBrandColors = (mode: ThemeMode) => (mode === 'dark' ? darkColors : lightColors);

export const brandTypography = {
  title: 'Inter_700Bold',
  body: 'Inter_400Regular',
};
