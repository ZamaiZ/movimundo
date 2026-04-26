import { Platform, StyleSheet, type ViewStyle } from 'react-native';

import type { ThemeMode } from '@/store/store';
import type { BrandColors } from '@/theme/tokens';

/**
 * Estilo do header nativo (Stack/Drawer): hairline inferior + sombra/elevação leve para separar do conteúdo.
 */
export function getAppHeaderStyle(colors: BrandColors, mode: ThemeMode): ViewStyle {
  const isDark = mode === 'dark';
  return {
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSubtle,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.32 : 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
      default: {},
    }),
  };
}
