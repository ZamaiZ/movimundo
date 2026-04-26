import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text, View } from 'react-native';

import { useThemeStore } from '@/store/store';
import { brandTypography, getBrandColors, getShadow, layout } from '@/theme/tokens';

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
    <View
      style={[
        {
          borderWidth: 1,
          borderColor: colors.borderSubtle,
          borderRadius: layout.radius.lg,
          borderLeftWidth: 4,
          borderLeftColor: statusColor,
          backgroundColor: colors.surface,
          padding: layout.space.md,
          gap: 10,
        },
        getShadow(mode, 'card'),
      ]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              backgroundColor: colors.accentSoft,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: layout.radius.sm,
            }}>
            <Text style={{ color: colors.primary, fontFamily: brandTypography.label, fontSize: 13 }}>
              {time}
            </Text>
          </View>
          <Text
            style={{
              color: statusColor,
              fontFamily: brandTypography.label,
              fontSize: 11,
              textTransform: 'uppercase' as const,
              letterSpacing: 0.5,
            }}>
            {status}
          </Text>
        </View>
      </View>

      <Text style={{ color: colors.text, fontFamily: brandTypography.displaySemibold, fontSize: 17, lineHeight: 22 }}>
        {title}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <FontAwesome name="map-marker" size={14} color={colors.textMuted} />
        <Text style={{ color: colors.textMuted, fontFamily: brandTypography.body, fontSize: 13, flex: 1 }}>
          {location}
        </Text>
      </View>
    </View>
  );
}
