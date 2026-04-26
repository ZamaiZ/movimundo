import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Platform, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeStore } from '@/store/store';
import { getBrandColors, getScreenGradient, layout } from '@/theme/tokens';

/** Padrão: sem padding superior (telas sob header do Stack/Drawer); laterais e inferior respeitam safe area. */
const defaultSafeEdges = {
  top: false,
  bottom: true,
  left: true,
  right: true,
} as const;

export type AppScreenSafeEdges = {
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
};

interface AppScreenProps extends ViewProps {
  children: React.ReactNode;
  contentHorizontalPadding?: boolean;
  /** Quais bordas aplicam insets; default evita faixa vazia abaixo do header fixo. */
  safeEdges?: AppScreenSafeEdges;
}

/**
 * Tela com fundo em gradiente, StatusBar e safe area seletiva (não duplica padding-top com header nativo).
 */
export function AppScreen({
  children,
  style,
  contentHorizontalPadding = false,
  safeEdges: safeEdgesOverride,
  ...rest
}: AppScreenProps) {
  const mode = useThemeStore((state) => state.mode);
  const colors = getBrandColors(mode);
  const colorsTuple = getScreenGradient(mode);
  const insets = useSafeAreaInsets();
  const statusStyle =
    mode === 'dark' ? 'light' : Platform.OS === 'ios' ? 'dark' : 'auto';

  const e = { ...defaultSafeEdges, ...safeEdgesOverride };
  const paddingLeft = (e.left ? insets.left : 0) + (contentHorizontalPadding ? layout.space.page : 0);
  const paddingRight = (e.right ? insets.right : 0) + (contentHorizontalPadding ? layout.space.page : 0);

  return (
    <LinearGradient
      colors={colorsTuple}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.85, y: 1 }}
      style={[{ flex: 1 }, style]}
      {...rest}>
      <StatusBar style={statusStyle} backgroundColor={colors.background} />
      <View
        style={[
          { flex: 1 },
          {
            paddingTop: e.top ? insets.top : 0,
            paddingBottom: e.bottom ? insets.bottom : 0,
            paddingLeft,
            paddingRight,
          },
        ]}>
        {children}
      </View>
    </LinearGradient>
  );
}
