import { Pressable, Text, View } from 'react-native';

import { useThemeStore } from '@/store/store';
import { brandTypography, getBrandColors } from '@/theme/tokens';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export function SectionHeader({ title, subtitle, actionLabel, onActionPress }: SectionHeaderProps) {
  const mode = useThemeStore((state) => state.mode);
  const colors = getBrandColors(mode);

  return (
    <View style={styles.row}>
      <View style={styles.titles}>
        <Text
          style={[styles.title, { color: colors.text, fontFamily: brandTypography.displaySemibold }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.textMuted, fontFamily: brandTypography.body }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {actionLabel && onActionPress ? (
        <Pressable onPress={onActionPress} hitSlop={12}>
          <Text
            style={[styles.action, { color: colors.primary, fontFamily: brandTypography.label }]}>
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = {
  row: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    justifyContent: 'space-between' as const,
    gap: 12,
  },
  titles: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  action: {
    fontSize: 13,
    lineHeight: 18,
  },
};
