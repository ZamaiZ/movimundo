import { Pressable, Text, View } from 'react-native';

import { useThemeStore } from '@/store/store';
import { brandTypography, getBrandColors, getShadow, layout } from '@/theme/tokens';

interface AgendaDayChipProps {
  dayLabel: string;
  dateLabel: string;
  selected?: boolean;
  onPress?: () => void;
}

export function AgendaDayChip({ dayLabel, dateLabel, selected = false, onPress }: AgendaDayChipProps) {
  const mode = useThemeStore((state) => state.mode);
  const colors = getBrandColors(mode);

  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          minWidth: 68,
          borderWidth: 1.5,
          borderRadius: layout.radius.md,
          paddingVertical: 12,
          paddingHorizontal: 8,
          alignItems: 'center' as const,
          gap: 8,
        },
        {
          backgroundColor: selected ? colors.primary : colors.surface,
          borderColor: selected ? colors.primary : colors.borderSubtle,
        },
        selected ? getShadow(mode, 'glow') : undefined,
      ]}>
      <Text
        style={{
          color: selected ? colors.textOnPrimary : colors.textMuted,
          fontFamily: brandTypography.label,
          fontSize: 11,
          letterSpacing: 0.4,
        }}>
        {dayLabel}
      </Text>
      <View
        style={{
          minWidth: 36,
          height: 32,
          borderRadius: layout.radius.sm,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: selected ? colors.textOnPrimary : colors.surfaceMuted,
          paddingHorizontal: 8,
        }}>
        <Text
          style={{
            color: selected ? colors.primary : colors.text,
            fontFamily: brandTypography.displaySemibold,
            fontSize: 16,
            lineHeight: 20,
          }}>
          {dateLabel}
        </Text>
      </View>
    </Pressable>
  );
}
