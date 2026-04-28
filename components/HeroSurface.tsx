import type { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { useThemeStore } from '@/store/store';
import { getBrandColors, getHeroGradient, getShadow, layout } from '@/theme/tokens';

type HeroSurfaceProps = {
  children: ReactNode;
  padding?: number;
};

export function HeroSurface({ children, padding = layout.space.lg }: HeroSurfaceProps) {
  const mode = useThemeStore((state) => state.mode);
  const colors = getBrandColors(mode);
  const hero = getHeroGradient(mode);
  const glossStrong = mode === 'dark' ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.11)';

  return (
    <View style={[styles.lift, { borderRadius: layout.radius.lg }, getShadow(mode, 'floating')]}>
      <LinearGradient
        colors={hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.inner,
          {
            borderRadius: layout.radius.lg,
            borderWidth: 1,
            borderColor: colors.borderSubtle,
            padding,
          },
        ]}>
        <LinearGradient
          colors={[glossStrong, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          pointerEvents="none"
          style={styles.gloss}
        />
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  lift: {
    backgroundColor: 'transparent',
    marginTop: 20,
  },
  inner: {
    overflow: 'hidden',
    position: 'relative',
  },
  gloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 52,
  },
});
