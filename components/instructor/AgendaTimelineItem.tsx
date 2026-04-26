import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text, View } from 'react-native';

import { useThemeStore } from '@/store/store';
import { brandTypography, getBrandColors, getShadow, layout } from '@/theme/tokens';

type AgendaStatus = 'Confirmada' | 'Aberta' | 'Quase lotada';

interface AgendaTimelineItemProps {
  time: string;
  title: string;
  location: string;
  duration: string;
  status: AgendaStatus;
  price?: string;
  maxStudents?: string;
  isLast?: boolean;
}

export function AgendaTimelineItem({
  time,
  title,
  location,
  duration,
  status,
  price,
  maxStudents,
  isLast = true,
}: AgendaTimelineItemProps) {
  const mode = useThemeStore((state) => state.mode);
  const colors = getBrandColors(mode);

  const statusColor =
    status === 'Confirmada' ? colors.success : status === 'Quase lotada' ? colors.warning : colors.secondary;

  return (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'stretch' }}>
      <View style={{ width: 56, alignItems: 'center' }}>
        <Text
          style={{ color: colors.primary, fontFamily: brandTypography.label, fontSize: 13, marginTop: 2 }}>
          {time}
        </Text>
        <View style={{ alignItems: 'center', width: 16, marginTop: 6, flex: 1, minHeight: 24 }}>
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: statusColor,
              borderWidth: 2,
              borderColor: colors.surface,
            }}
          />
          {!isLast ? (
            <View
              style={{
                width: 2,
                flex: 1,
                minHeight: 20,
                backgroundColor: colors.borderSubtle,
                marginTop: 4,
                borderRadius: 1,
              }}
            />
          ) : null}
        </View>
      </View>

      <View
        style={[
          {
            flex: 1,
            borderWidth: 1,
            borderColor: colors.borderSubtle,
            borderRadius: layout.radius.lg,
            backgroundColor: colors.surface,
            padding: layout.space.md,
            gap: 8,
            marginBottom: isLast ? 0 : 0,
          },
          getShadow(mode, 'card'),
        ]}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <Text
            style={{
              color: colors.text,
              fontFamily: brandTypography.displaySemibold,
              fontSize: 16,
              lineHeight: 20,
              flex: 1,
            }}>
            {title}
          </Text>
          <View style={{ backgroundColor: colors.accentSoft, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
            <Text style={{ color: statusColor, fontFamily: brandTypography.label, fontSize: 10 }}>
              {status}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <FontAwesome name="clock-o" size={13} color={colors.textMuted} />
          <Text style={{ color: colors.textMuted, fontFamily: brandTypography.body, fontSize: 12 }}>{duration}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <FontAwesome name="map-marker" size={13} color={colors.textMuted} />
          <Text style={{ color: colors.textMuted, fontFamily: brandTypography.body, fontSize: 12 }}>{location}</Text>
        </View>
        {(price || maxStudents) && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <FontAwesome name="users" size={13} color={colors.textMuted} />
            <Text style={{ color: colors.textMuted, fontFamily: brandTypography.body, fontSize: 12 }}>
              {maxStudents ? `${maxStudents} vagas` : '—'}
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: 11 }}>•</Text>
            <Text style={{ color: colors.textMuted, fontFamily: brandTypography.body, fontSize: 12 }}>{price ?? '—'}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
