import { Text, View } from 'react-native';

import { useThemeStore } from '@/store/store';
import { brandTypography, getBrandColors } from '@/theme/tokens';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  const mode = useThemeStore((state) => state.mode);
  const colors = getBrandColors(mode);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text, fontFamily: brandTypography.title }]}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.textMuted, fontFamily: brandTypography.body }]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = {
  container: {
    gap: 4,
  },
  title: {
    fontSize: 18,
    lineHeight: 22,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
};
