import { Text, View } from 'react-native';

import { useThemeStore } from '@/store/store';
import { brandTypography, getBrandColors } from '@/theme/tokens';

type FormDayMonthDividerProps = {
  date: Date;
  showYear: boolean;
};

export function FormDayMonthDivider({ date, showYear }: FormDayMonthDividerProps) {
  const mode = useThemeStore((state) => state.mode);
  const colors = getBrandColors(mode);
  const monthShort = new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date).replace(/\./g, '');

  return (
    <View
      pointerEvents="none"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 4,
        marginRight: 2,
      }}>
      <View style={{ width: 1, height: 30, backgroundColor: colors.borderSubtle, borderRadius: 1 }} />
      <View style={{ gap: 1 }}>
        <Text
          style={{
            color: colors.textSecondary,
            fontFamily: brandTypography.label,
            fontSize: 10,
            lineHeight: 13,
            letterSpacing: 0.85,
            textTransform: 'uppercase' as const,
          }}>
          {monthShort}
        </Text>
        {showYear ? (
          <Text
            style={{
              color: colors.textMuted,
              fontFamily: brandTypography.body,
              fontSize: 9,
              lineHeight: 11,
              letterSpacing: 0.3,
            }}>
            {date.getFullYear()}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
