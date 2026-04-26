import { LinearGradient } from 'expo-linear-gradient';
import { Image, Text, View } from 'react-native';

import { useThemeStore } from '@/store/store';
import { brandTypography, getBrandColors, getHeroGradient, layout } from '@/theme/tokens';

const logo = require('../assets/logo.png');

export function DrawerBrandHero() {
  const mode = useThemeStore((state) => state.mode);
  const colors = getBrandColors(mode);
  const heroGrad = getHeroGradient(mode);

  return (
    <LinearGradient
      colors={heroGrad}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        marginHorizontal: layout.space.page,
        marginTop: 8,
        marginBottom: 12,
        borderRadius: layout.radius.lg,
        padding: layout.space.md,
        borderWidth: 1,
        borderColor: colors.borderSubtle,
        overflow: 'hidden',
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Image source={logo} style={{ width: 44, height: 44 }} resizeMode="contain" />
        <View style={{ flex: 1, gap: 4 }}>
          <Text
            style={{
              fontFamily: brandTypography.display,
              fontSize: 20,
              color: mode === 'dark' ? colors.text : colors.text,
              letterSpacing: -0.4,
            }}
            numberOfLines={1}>
            movi<Text style={{ color: colors.primary }}>mundo</Text>
          </Text>
          <Text
            style={{
              fontFamily: brandTypography.body,
              fontSize: 12,
              color: colors.textMuted,
              lineHeight: 16,
            }}
            numberOfLines={2}>
            Conecte-se a quem move a sua saúde e o seu desempenho.
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}
