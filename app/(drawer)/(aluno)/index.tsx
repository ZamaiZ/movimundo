import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { AppScreen } from '@/components/AppScreen';
import { useThemeStore } from '@/store/store';
import { brandTypography, getBrandColors, getHeroGradient, layout } from '@/theme/tokens';

const BENEFITS = [
  {
    key: '1',
    title: 'Conexão com propósito',
    body: 'Encontre profissionais alinhados aos seus objetivos de saúde e performance.',
    icon: 'link-outline' as const,
  },
  {
    key: '2',
    title: 'Aulas e rotinas',
    body: 'Organize reservas e acompanhe o que vem a seguir, sem complicação.',
    icon: 'calendar-outline' as const,
  },
  {
    key: '3',
    title: 'Jornada contínua',
    body: 'Uma ponte clara entre você e quem pode te orientar com segurança.',
    icon: 'trending-up-outline' as const,
  },
];

export default function AlunoHomeScreen() {
  const mode = useThemeStore((state) => state.mode);
  const colors = getBrandColors(mode);
  const hero = getHeroGradient(mode);

  return (
    <>
      <Stack.Screen options={{ title: 'Aluno' }} />
      <AppScreen>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 32,
            gap: layout.space.lg,
            paddingHorizontal: layout.space.page,
          }}
          style={{ backgroundColor: 'transparent' }}
          showsVerticalScrollIndicator={false}>
          <LinearGradient
            colors={hero}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: layout.radius.lg,
              padding: layout.space.lg,
              borderWidth: 1,
              borderColor: colors.borderSubtle,
              overflow: 'hidden',
            }}>
            <View
              style={{
                position: 'absolute',
                right: -24,
                bottom: -16,
                width: 90,
                height: 90,
                borderRadius: 45,
                backgroundColor: colors.secondary,
                opacity: 0.12,
              }}
            />
            <Text
              style={{
                color: colors.primary,
                fontFamily: brandTypography.label,
                fontSize: 11,
                letterSpacing: 1.1,
                textTransform: 'uppercase',
              }}>
              Movimundo
            </Text>
            <Text
              style={{
                marginTop: 8,
                color: colors.text,
                fontFamily: brandTypography.display,
                fontSize: 28,
                lineHeight: 32,
                letterSpacing: -0.5,
              }}>
              Encontre quem te move
            </Text>
            <Text
              style={{
                marginTop: 8,
                color: colors.textMuted,
                fontFamily: brandTypography.body,
                fontSize: 15,
                lineHeight: 22,
                maxWidth: 300,
              }}>
              Profissionais de saúde e esporte ao seu alcance. Uma experiência feita para conectar pessoas e
              propósito.
            </Text>
            <View style={{ marginTop: layout.space.lg, gap: 10, flexDirection: 'row' }}>
              <Pressable
                style={{
                  flex: 1,
                  minHeight: 48,
                  borderRadius: layout.radius.md,
                  backgroundColor: colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 12,
                }}>
                <Text
                  style={{ color: colors.textOnPrimary, fontFamily: brandTypography.label, fontSize: 14 }}>
                  Explorar profissionais
                </Text>
              </Pressable>
              <Pressable
                style={{
                  minHeight: 48,
                  borderRadius: layout.radius.md,
                  backgroundColor: colors.surface,
                  borderWidth: 1.5,
                  borderColor: colors.borderStrong,
                  paddingHorizontal: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{ color: colors.text, fontFamily: brandTypography.label, fontSize: 14 }}>
                  Minha jornada
                </Text>
              </Pressable>
            </View>
          </LinearGradient>

          <View style={{ gap: 12 }}>
            {BENEFITS.map((item) => (
              <View
                key={item.key}
                style={{
                  flexDirection: 'row',
                  gap: 14,
                  backgroundColor: colors.surface,
                  borderRadius: layout.radius.lg,
                  borderWidth: 1,
                  borderColor: colors.borderSubtle,
                  padding: layout.space.md,
                }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: layout.radius.md,
                    backgroundColor: colors.accentSoft,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Ionicons name={item.icon} size={24} color={colors.primary} />
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text
                    style={{
                      color: colors.text,
                      fontFamily: brandTypography.displaySemibold,
                      fontSize: 16,
                    }}>
                    {item.title}
                  </Text>
                  <Text style={{ color: colors.textMuted, fontFamily: brandTypography.body, fontSize: 14, lineHeight: 20 }}>
                    {item.body}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </AppScreen>
    </>
  );
}
