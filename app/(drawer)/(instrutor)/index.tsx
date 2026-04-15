import { Stack } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Container } from '@/components/Container';
import { UpcomingClassItem } from '@/components/instructor/UpcomingClassItem';
import { useThemeStore } from '@/store/store';
import { brandTypography, getBrandColors } from '@/theme/tokens';

export default function InstrutorHomeScreen() {
  const mode = useThemeStore((state) => state.mode);
  const colors = getBrandColors(mode);

  return (
    <>
      <Stack.Screen options={{ title: 'Instrutor' }} />
      <Container>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: colors.background }}>
          <View style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.heroHeader}>
              <View>
                <Text style={[styles.heroTitle, { color: colors.text, fontFamily: brandTypography.title }]}>
                  Painel do Instrutor
                </Text>
                <Text
                  style={[styles.heroSubtitle, { color: colors.textMuted, fontFamily: brandTypography.body }]}>
                  Visao geral do dia com foco no essencial
                </Text>
              </View>
              <View style={[styles.heroIconWrap, { backgroundColor: colors.primary }]}>
                <FontAwesome name="line-chart" size={18} color={colors.secondary} />
              </View>
            </View>

            <View style={styles.kpiRow}>
              <View style={styles.kpiItem}>
                <Text style={[styles.kpiValue, { color: colors.text, fontFamily: brandTypography.title }]}>8</Text>
                <Text style={[styles.kpiLabel, { color: colors.textMuted, fontFamily: brandTypography.body }]}>
                  aulas hoje
                </Text>
              </View>
              <View style={[styles.kpiDivider, { backgroundColor: colors.border }]} />
              <View style={styles.kpiItem}>
                <Text style={[styles.kpiValue, { color: colors.text, fontFamily: brandTypography.title }]}>46</Text>
                <Text style={[styles.kpiLabel, { color: colors.textMuted, fontFamily: brandTypography.body }]}>
                  alunos confirmados
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.topActionsRow}>
            <Pressable style={[styles.quickActionButton, { backgroundColor: colors.primary }]}>
              <FontAwesome name="plus" size={13} color={colors.textOnPrimary} />
              <Text
                style={[
                  styles.quickActionText,
                  { color: colors.textOnPrimary, fontFamily: brandTypography.title },
                ]}>
                Nova aula
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.quickActionButton,
                { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 },
              ]}>
              <FontAwesome name="calendar" size={14} color={colors.text} />
              <Text style={[styles.quickActionText, { color: colors.text, fontFamily: brandTypography.title }]}>
                Agenda
              </Text>
            </Pressable>
          </View>

          <View style={styles.sectionTitleRow}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: brandTypography.title }]}>
              Proximas aulas
            </Text>
            <Text style={[styles.sectionLink, { color: colors.primary, fontFamily: brandTypography.body }]}>
              Ver todas
            </Text>
          </View>
          <View style={styles.classList}>
            <UpcomingClassItem
              time="07:00"
              title="Funcional em circuito"
              location="Parque Bosque Maia"
              status="Confirmada"
            />
            <UpcomingClassItem
              time="10:30"
              title="Treino individual"
              location="Praca Oito de Dezembro"
              status="Aberta"
            />
          </View>
        </ScrollView>
      </Container>
    </>
  );
}

const styles = {
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
    gap: 16,
  },
  heroCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    gap: 14,
  },
  heroHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  heroTitle: {
    fontSize: 22,
    lineHeight: 28,
  },
  heroSubtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
  },
  heroIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  kpiRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    gap: 12,
  },
  kpiItem: {
    flex: 1,
    gap: 2,
  },
  kpiDivider: {
    width: 1,
    height: 34,
  },
  kpiValue: {
    fontSize: 22,
    lineHeight: 26,
  },
  kpiLabel: {
    fontSize: 12,
    lineHeight: 16,
  },
  topActionsRow: {
    flexDirection: 'row' as const,
    gap: 10,
  },
  classList: {
    gap: 10,
  },
  sectionTitleRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 22,
  },
  sectionLink: {
    fontSize: 13,
    lineHeight: 18,
  },
  quickActionButton: {
    flex: 1,
    borderRadius: 14,
    minHeight: 42,
    paddingHorizontal: 12,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 6,
  },
  quickActionText: {
    fontSize: 13,
    lineHeight: 16,
  },
};
