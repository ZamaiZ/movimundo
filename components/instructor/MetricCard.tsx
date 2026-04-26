import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text, View } from 'react-native';

import { useThemeStore } from '@/store/store';
import { brandTypography, getBrandColors, getShadow, layout, type BrandColors } from '@/theme/tokens';

interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  accent?: keyof Pick<BrandColors, 'primary' | 'secondary'>;
}

export function MetricCard({ label, value, icon, accent = 'primary' }: MetricCardProps) {
  const mode = useThemeStore((state) => state.mode);
  const colors = getBrandColors(mode);
  const accentColor = colors[accent];

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.borderSubtle,
          borderRadius: layout.radius.lg,
          padding: layout.space.md,
          gap: 10,
          minHeight: 120,
        },
        getShadow(mode, 'card'),
      ]}>
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: layout.radius.sm,
          backgroundColor: colors.accentSoft,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <FontAwesome name={icon} size={17} color={accentColor} />
      </View>
      <Text
        style={{
          color: colors.text,
          fontFamily: brandTypography.display,
          fontSize: 32,
          lineHeight: 36,
          letterSpacing: -0.5,
        }}>
        {value}
      </Text>
      <Text
        style={{
          color: colors.textMuted,
          fontFamily: brandTypography.label,
          fontSize: 12,
          lineHeight: 16,
          textTransform: 'uppercase' as const,
          letterSpacing: 0.6,
        }}>
        {label}
      </Text>
    </View>
  );
}
