import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text, View } from 'react-native';

import { useThemeStore } from '@/store/store';
import { brandTypography, getBrandColors } from '@/theme/tokens';

interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ComponentProps<typeof FontAwesome>['name'];
}

export function MetricCard({ label, value, icon }: MetricCardProps) {
  const mode = useThemeStore((state) => state.mode);
  const colors = getBrandColors(mode);

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.iconWrap, { backgroundColor: colors.surfaceMuted }]}>
        <FontAwesome name={icon} size={16} color={colors.primary} />
      </View>
      <Text style={[styles.value, { color: colors.text, fontFamily: brandTypography.title }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.textMuted, fontFamily: brandTypography.body }]}>{label}</Text>
    </View>
  );
}

const styles = {
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 8,
    minHeight: 112,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  value: {
    fontSize: 20,
    lineHeight: 24,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
  },
};
