import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeStore } from '@/store/store';
import { getBrandColors } from '@/theme/tokens';

interface ContainerProps {
  children: React.ReactNode;
  /** fundo sólido (ex.: 404) — padrão usa cor de base do tema */
  backgroundColor?: string;
}

/** Conteúdo sob header do Stack: sem padding-top extra (evita faixa); respeita laterais e home indicator. */
export const Container: React.FC<ContainerProps> = ({ children, backgroundColor: bgOverride }) => {
  const mode = useThemeStore((state) => state.mode);
  const colors = getBrandColors(mode);
  const backgroundColor = bgOverride ?? colors.background;
  const statusStyle =
    mode === 'dark' ? 'light' : Platform.OS === 'ios' ? 'dark' : 'auto';
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor,
        paddingTop: 0,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}>
      <StatusBar style={statusStyle} backgroundColor={backgroundColor} />
      {children}
    </View>
  );
};
