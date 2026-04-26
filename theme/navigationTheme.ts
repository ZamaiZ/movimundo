import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

import type { ThemeMode } from '@/store/store';
import { getBrandColors } from '@/theme/tokens';

/**
 * Tema de navegação alinhado à paleta Movimundo.
 * Necessário para a barra de tabs (e qualquer UI nativa do RNav) acompanhar
 * o modo claro/escuro do `useThemeStore` — evita barra branca com tint azul
 * padrão quando o conteúdo já está em dark.
 */
export function getNavigationTheme(mode: ThemeMode): Theme {
  const c = getBrandColors(mode);
  const base = mode === 'dark' ? DarkTheme : DefaultTheme;
  return {
    ...base,
    dark: mode === 'dark',
    colors: {
      ...base.colors,
      primary: c.primary,
      background: c.background,
      card: c.surface,
      text: c.text,
      border: c.border,
      notification: c.primary,
    },
  };
}
