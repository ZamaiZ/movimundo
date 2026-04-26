import { Pressable, Text } from 'react-native';

import { useThemeStore } from '@/store/store';
import { brandTypography, getBrandColors, layout } from '@/theme/tokens';

interface AgendaFilterChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export function AgendaFilterChip({ label, active = false, onPress }: AgendaFilterChipProps) {
  const mode = useThemeStore((state) => state.mode);
  const colors = getBrandColors(mode);

  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          borderWidth: 1.5,
          borderRadius: layout.radius.full,
          minHeight: 36,
          paddingHorizontal: 16,
          alignItems: 'center' as const,
          justifyContent: 'center' as const,
        },
        {
          backgroundColor: active ? colors.accentSoft : colors.surface,
          borderColor: active ? colors.primary : colors.borderSubtle,
        },
      ]}>
      <Text
        style={{
          color: active ? colors.primary : colors.textMuted,
          fontFamily: active ? brandTypography.label : brandTypography.body,
          fontSize: 12,
          lineHeight: 15,
        }}>
        {label}
      </Text>
    </Pressable>
  );
}
