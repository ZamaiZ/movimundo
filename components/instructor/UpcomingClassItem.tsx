import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text, View } from 'react-native';

import { useThemeStore } from '@/store/store';
import { brandTypography, getBrandColors } from '@/theme/tokens';

interface UpcomingClassItemProps {
  time: string;
  title: string;
  location: string;
  status: 'Confirmada' | 'Aberta' | 'Quase lotada';
}

export function UpcomingClassItem({ time, title, location, status }: UpcomingClassItemProps) {
  const mode = useThemeStore((state) => state.mode);
  const colors = getBrandColors(mode);

  const statusColor =
    status === 'Confirmada' ? colors.success : status === 'Quase lotada' ? colors.warning : colors.secondary;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.row}>
        <Text style={[styles.time, { color: colors.primary, fontFamily: brandTypography.title }]}>{time}</Text>
        <Text style={[styles.status, { color: statusColor, fontFamily: brandTypography.title }]}>{status}</Text>
      </View>

      <Text style={[styles.title, { color: colors.text, fontFamily: brandTypography.title }]}>{title}</Text>

      <View style={styles.locationRow}>
        <FontAwesome name="map-marker" size={14} color={colors.textMuted} />
        <Text style={[styles.location, { color: colors.textMuted, fontFamily: brandTypography.body }]}>
          {location}
        </Text>
      </View>
    </View>
  );
}

const styles = {
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 8,
  },
  row: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  time: {
    fontSize: 14,
  },
  status: {
    fontSize: 12,
  },
  title: {
    fontSize: 16,
  },
  locationRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
  },
  location: {
    fontSize: 13,
  },
};
