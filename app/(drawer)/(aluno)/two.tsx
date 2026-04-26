import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';

import { AppScreen } from '@/components/AppScreen';
import { useThemeStore } from '@/store/store';
import { brandTypography, getBrandColors, getShadow, layout } from '@/theme/tokens';

const UPCOMING = [
  { id: '1', time: '09:00', title: 'Yoga ao ar livre', place: 'Parque do Ibirapuera', with: 'Prof. Marina L.' },
  { id: '2', time: '18:30', title: 'Funcional em grupo', place: 'Academia Central', with: 'Prof. Ricardo S.' },
];

const RECOMMENDED = [
  { id: '1', name: 'Nutrição esportiva', pro: 'Dra. Paula M.', focus: 'Plano alimentar' },
  { id: '2', name: 'Fisioterapia', pro: 'Dr. André C.', focus: 'Prevenção e recuperação' },
];

export default function AlunoAulasScreen() {
  const mode = useThemeStore((state) => state.mode);
  const colors = getBrandColors(mode);

  return (
    <>
      <Stack.Screen options={{ title: 'Aulas' }} />
      <AppScreen>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 32,
            gap: layout.space.lg,
            paddingHorizontal: layout.space.page,
          }}
          style={{ backgroundColor: 'transparent' }}
          showsVerticalScrollIndicator={false}>
          <View style={{ gap: 6, marginBottom: 4 }}>
            <Text
              style={{
                color: colors.textSecondary,
                fontFamily: brandTypography.label,
                fontSize: 11,
                letterSpacing: 0.8,
                textTransform: 'uppercase',
              }}>
              Sua semana
            </Text>
            <Text
              style={{
                color: colors.text,
                fontFamily: brandTypography.display,
                fontSize: 24,
                lineHeight: 30,
                letterSpacing: -0.4,
              }}>
              Próximas reservas
            </Text>
            <Text style={{ color: colors.textMuted, fontFamily: brandTypography.body, fontSize: 14, lineHeight: 20 }}>
              Demonstração do fluxo do aluno — conexão e agenda em um só lugar.
            </Text>
          </View>

          {UPCOMING.map((item) => (
            <View
              key={item.id}
              style={[
                {
                  backgroundColor: colors.surface,
                  borderRadius: layout.radius.lg,
                  borderWidth: 1,
                  borderColor: colors.borderSubtle,
                  borderLeftWidth: 4,
                  borderLeftColor: colors.primary,
                  padding: layout.space.md,
                  gap: 8,
                },
                getShadow(mode, 'card'),
              ]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View
                  style={{
                    backgroundColor: colors.accentSoft,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: layout.radius.sm,
                  }}>
                  <Text style={{ color: colors.primary, fontFamily: brandTypography.label, fontSize: 13 }}>
                    {item.time}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </View>
              <Text
                style={{
                  color: colors.text,
                  fontFamily: brandTypography.displaySemibold,
                  fontSize: 17,
                }}>
                {item.title}
              </Text>
              <Text style={{ color: colors.textMuted, fontFamily: brandTypography.body, fontSize: 13 }}>
                {item.place} · {item.with}
              </Text>
            </View>
          ))}

          <View
            style={{
              height: 1,
              backgroundColor: colors.borderSubtle,
              marginVertical: 4,
            }}
          />

          <Text
            style={{
              color: colors.text,
              fontFamily: brandTypography.displaySemibold,
              fontSize: 18,
              marginBottom: 2,
            }}>
            Recomendados para você
          </Text>
          <Text style={{ color: colors.textMuted, fontFamily: brandTypography.body, fontSize: 13, marginBottom: 8 }}>
            Perfis em destaque (mock para apresentação)
          </Text>

          {RECOMMENDED.map((r) => (
            <View
              key={r.id}
              style={[
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  backgroundColor: colors.surface,
                  borderRadius: layout.radius.lg,
                  borderWidth: 1,
                  borderColor: colors.borderSubtle,
                  padding: layout.space.md,
                },
                getShadow(mode, 'card'),
              ]}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: colors.accentSoft,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Ionicons name="person" size={24} color={colors.secondary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontFamily: brandTypography.label, fontSize: 15 }}>{r.name}</Text>
                <Text style={{ color: colors.textMuted, fontFamily: brandTypography.body, fontSize: 13, marginTop: 2 }}>
                  {r.pro} · {r.focus}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </AppScreen>
    </>
  );
}
