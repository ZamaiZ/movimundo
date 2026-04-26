import { Stack } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { AppScreen } from '@/components/AppScreen';
import { MetricCard } from '@/components/instructor/MetricCard';
import { SectionHeader } from '@/components/instructor/SectionHeader';
import { UpcomingClassItem } from '@/components/instructor/UpcomingClassItem';
import { useThemeStore } from '@/store/store';
import { brandTypography, getBrandColors, getHeroGradient, layout } from '@/theme/tokens';

export default function InstrutorHomeScreen() {
  const mode = useThemeStore((state) => state.mode);
  const colors = getBrandColors(mode);
  const hero = getHeroGradient(mode);

  return (
    <>
      <Stack.Screen options={{ title: 'Instrutor' }} />
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
              overflow: 'hidden' as const,
            }}>
            <View
              style={{
                position: 'absolute' as const,
                right: -20,
                top: -20,
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: colors.primary,
                opacity: 0.12,
              }}
            />
            <View
              style={{
                position: 'absolute' as const,
                right: 40,
                bottom: -30,
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: colors.secondary,
                opacity: 0.1,
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 12,
              }}>
              <View style={{ flex: 1, gap: 8 }}>
                <Text
                  style={{
                    color: colors.secondary,
                    fontFamily: brandTypography.label,
                    fontSize: 11,
                    letterSpacing: 1.2,
                    textTransform: 'uppercase' as const,
                  }}>
                  Painel
                </Text>
                <Text
                  style={{
                    color: colors.text,
                    fontFamily: brandTypography.display,
                    fontSize: 28,
                    lineHeight: 32,
                    letterSpacing: -0.6,
                  }}>
                  Seu dia, no ritmo certo
                </Text>
                <Text
                  style={{
                    color: colors.textMuted,
                    fontFamily: brandTypography.body,
                    fontSize: 14,
                    lineHeight: 20,
                    maxWidth: 280,
                  }}>
                  Visão geral e próximas aulas — sem ruído, só o que importa para performar.
                </Text>
              </View>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <FontAwesome name="line-chart" size={22} color={colors.textOnPrimary} />
              </View>
            </View>
          </LinearGradient>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <MetricCard label="Aulas hoje" value="8" icon="clock-o" accent="primary" />
            <MetricCard label="Alunos confirm." value="46" icon="users" accent="secondary" />
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable
              style={{
                flex: 1,
                minHeight: 48,
                borderRadius: layout.radius.md,
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 8,
                paddingHorizontal: 12,
              }}>
              <FontAwesome name="plus" size={14} color={colors.textOnPrimary} />
              <Text
                style={{ color: colors.textOnPrimary, fontFamily: brandTypography.label, fontSize: 14 }}>
                Nova aula
              </Text>
            </Pressable>
            <Pressable
              style={{
                flex: 1,
                minHeight: 48,
                borderRadius: layout.radius.md,
                backgroundColor: colors.surface,
                borderWidth: 1.5,
                borderColor: colors.borderStrong,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 8,
                paddingHorizontal: 12,
              }}>
              <FontAwesome name="calendar" size={14} color={colors.text} />
              <Text style={{ color: colors.text, fontFamily: brandTypography.label, fontSize: 14 }}>Agenda</Text>
            </Pressable>
          </View>

          <SectionHeader
            title="Próximas aulas"
            subtitle="Fila rápida do que vem a seguir"
            actionLabel="Ver todas"
            onActionPress={() => undefined}
          />

          <View style={{ gap: 12 }}>
            <UpcomingClassItem
              time="07:00"
              title="Funcional em circuito"
              location="Parque Bosque Maia"
              status="Confirmada"
            />
            <UpcomingClassItem
              time="10:30"
              title="Treino individual"
              location="Praça Oito de Dezembro"
              status="Aberta"
            />
          </View>
        </ScrollView>
      </AppScreen>
    </>
  );
}
