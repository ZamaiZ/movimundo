import { DrawerToggleButton } from '@react-navigation/drawer';
import { type ComponentProps, useMemo } from 'react';
import { Image, Text, View } from 'react-native';
import { useSegments } from 'expo-router';

import { useThemeStore } from '@/store/store';
import { brandTypography, getBrandColors } from '@/theme/tokens';

const logo = require('../assets/logo.png');

type DrawerToggleProps = ComponentProps<typeof DrawerToggleButton>;

function roleFromSegments(segments: readonly string[]): '' | 'Instrutor' | 'Aluno' {
  if (segments.some((s) => s === 'instrutor' || s === '(instrutor)')) return 'Instrutor';
  if (segments.some((s) => s === 'aluno' || s === '(aluno)')) return 'Aluno';
  return '';
}

export function DrawerHeaderBrand(props: DrawerToggleProps) {
  const mode = useThemeStore((state) => state.mode);
  const colors = getBrandColors(mode);
  const moviColor = colors.text;
  const segments = useSegments();

  const roleLabel = useMemo(() => roleFromSegments(segments), [segments]);

  return (
    <View style={styles.row}>
      <DrawerToggleButton {...props} />
      <View style={styles.brandBlock}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <View style={styles.wordmarkRow}>
          <Text
            numberOfLines={1}
            style={[
              styles.wordmarkPart,
              { fontFamily: brandTypography.wordmark, color: moviColor },
            ]}>
            movi
          </Text>
          <Text
            numberOfLines={1}
            style={[
              styles.wordmarkPart,
              { fontFamily: brandTypography.wordmark, color: colors.primary },
            ]}>
            mundo
          </Text>
        </View>
      </View>
      {roleLabel ? (
        <View style={styles.roleBlock}>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text
            numberOfLines={1}
            style={[
              styles.roleLabel,
              { color: colors.textSecondary, fontFamily: brandTypography.label },
            ]}>
            {roleLabel}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = {
  row: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginLeft: -4,
    minWidth: 0,
  },
  brandBlock: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flexShrink: 0,
    marginLeft: 4,
    gap: 6,
  },
  logo: {
    width: 30,
    height: 30,
  },
  wordmarkRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flexShrink: 0,
  },
  wordmarkPart: {
    fontSize: 18,
    lineHeight: 22,
    letterSpacing: -0.3,
    flexShrink: 0,
    includeFontPadding: false,
  },
  roleBlock: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    minWidth: 0,
    marginLeft: 4,
  },
  divider: {
    width: 1,
    height: 18,
    marginRight: 10,
    borderRadius: 1,
    opacity: 0.9,
    flexShrink: 0,
  },
  roleLabel: {
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.2,
    minWidth: 0,
  },
};
