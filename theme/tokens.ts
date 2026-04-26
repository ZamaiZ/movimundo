import type { ViewStyle } from 'react-native';

import type { ThemeMode } from '@/store/store';

/** Paleta semântica unificada (light) — saúde + performance */
export const lightColors = {
  primary: '#ED1847',
  primaryMuted: '#FFD7E2',
  secondary: '#5B2EFF',
  background: '#F8F7FF',
  backgroundElevated: '#FCFBFF',
  surface: '#FFFFFF',
  surfaceMuted: '#F2EEFF',
  surfaceHighlight: '#FFF1F5',
  text: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#64748B',
  textOnPrimary: '#FFFFFF',
  border: '#E2E8F0',
  borderSubtle: '#EEE9FA',
  borderStrong: '#D2C8EE',
  success: '#16A34A',
  warning: '#EA580C',
  error: '#DC2626',
  accentSoft: '#F4EEFF',
  accentButton: '#C9123B',
  glow: 'rgba(237, 24, 71, 0.34)',
  overlay: 'rgba(15, 23, 42, 0.5)',
};

export const darkColors = {
  primary: '#ED1847',
  primaryMuted: '#4B1220',
  secondary: '#8B6CFF',
  background: '#09090B',
  backgroundElevated: '#111116',
  surface: '#16161C',
  surfaceMuted: '#201B30',
  surfaceHighlight: '#2E1420',
  text: '#F4F4F5',
  textSecondary: '#A1A1AA',
  textMuted: '#A1A1AA',
  textOnPrimary: '#FFFFFF',
  border: '#2A2A32',
  borderSubtle: '#2A2338',
  borderStrong: '#3E3455',
  success: '#22C55E',
  warning: '#FB923C',
  error: '#F87171',
  accentSoft: '#2B1E43',
  accentButton: '#D11640',
  glow: 'rgba(237, 24, 71, 0.28)',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

export type BrandColors = typeof lightColors;

export const getBrandColors = (mode: ThemeMode): BrandColors =>
  mode === 'dark' ? darkColors : lightColors;

/** Raios e espaçamento reutilizáveis */
export const layout = {
  radius: { sm: 10, md: 14, lg: 20, xl: 28, full: 9999 },
  space: { xs: 6, sm: 10, md: 14, lg: 20, page: 16 },
} as const;

type ShadowName = 'card' | 'floating' | 'glow' | 'barTop';

/**
 * Sombra leve para barras (tab dock / separadores): menos pesada que `card`.
 * No Android a elevação projeta para baixo; combina com borderTop na barra.
 */
export function getShadow(mode: ThemeMode, name: ShadowName): ViewStyle {
  const base = mode === 'dark';
  if (name === 'barTop') {
    return {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: base ? 0.25 : 0.12,
      shadowRadius: 6,
      elevation: base ? 8 : 6,
    };
  }
  if (name === 'card') {
    return {
      shadowColor: base ? '#000000' : '#0F172A',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: base ? 0.45 : 0.09,
      shadowRadius: 14,
      elevation: base ? 6 : 4,
    };
  }
  if (name === 'floating') {
    return {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: base ? 0.5 : 0.18,
      shadowRadius: 18,
      elevation: base ? 10 : 8,
    };
  }
  return {
    shadowColor: '#ED1847',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: base ? 0.35 : 0.22,
    shadowRadius: 12,
    elevation: 5,
  };
}

/** Fundo de tela (gradiente sutil) */
export function getScreenGradient(mode: ThemeMode): [string, string, ...string[]] {
  if (mode === 'dark') {
    return ['#09090B', '#14111C', '#1A1023'];
  }
  return ['#F8F7FF', '#FFF3F7', '#F2EEFF'];
}

export function getHeroGradient(mode: ThemeMode): [string, string] {
  if (mode === 'dark') {
    return ['#2B1120', '#1A1330'];
  }
  return ['#FFE5EC', '#F2EEFF'];
}

export const brandTypography = {
  display: 'Outfit_700Bold',
  displaySemibold: 'Outfit_600SemiBold',
  title: 'Inter_700Bold',
  label: 'Inter_600SemiBold',
  body: 'Inter_400Regular',
  wordmark: 'Inter_700Bold_Italic',
  mono: 'Inter_400Regular',
} as const;

export type BrandTypography = typeof brandTypography;
