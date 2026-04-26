import { useMemo, useState } from 'react';
import { Stack } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { AppScreen } from '@/components/AppScreen';
import { AgendaDayChip } from '@/components/instructor/AgendaDayChip';
import { AgendaFilterChip } from '@/components/instructor/AgendaFilterChip';
import { AgendaTimelineItem } from '@/components/instructor/AgendaTimelineItem';
import { useThemeStore } from '@/store/store';
import { brandTypography, getBrandColors, getHeroGradient, getShadow, layout } from '@/theme/tokens';

type AgendaStatus = 'Confirmada' | 'Aberta' | 'Quase lotada';

interface ClassEvent {
  id: string;
  dayOffset: number;
  time: string;
  title: string;
  location: string;
  duration: string;
  status: AgendaStatus;
  price: string;
  maxStudents: string;
  notes?: string;
}

const DAY_LABELS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

const WEEK_EVENTS: ClassEvent[] = [
  {
    id: '1',
    dayOffset: 1,
    time: '07:00',
    title: 'Funcional em circuito',
    location: 'Parque Bosque Maia',
    duration: '60 min',
    status: 'Confirmada',
    price: 'R$ 15',
    maxStudents: '15',
  },
  {
    id: '2',
    dayOffset: 1,
    time: '10:30',
    title: 'Treino individual',
    location: 'Praca Oito de Dezembro',
    duration: '50 min',
    status: 'Aberta',
    price: 'R$ 90',
    maxStudents: '1',
  },
  {
    id: '3',
    dayOffset: 2,
    time: '18:00',
    title: 'Condicionamento coletivo',
    location: 'Parque Fracalanza',
    duration: '60 min',
    status: 'Quase lotada',
    price: 'R$ 18',
    maxStudents: '20',
  },
  {
    id: '4',
    dayOffset: 4,
    time: '06:30',
    title: 'Treino ao ar livre',
    location: 'Parque Julio Fracalanza',
    duration: '45 min',
    status: 'Confirmada',
    price: 'R$ 12',
    maxStudents: '12',
  },
  {
    id: '5',
    dayOffset: 5,
    time: '19:00',
    title: 'Grupo de resistencia',
    location: 'Praca Getulio Vargas',
    duration: '70 min',
    status: 'Aberta',
    price: 'R$ 20',
    maxStudents: '16',
  },
];

function getStartOfWeek(date: Date) {
  const start = new Date(date);
  const day = start.getDay();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - day);
  return start;
}

function formatMonthRange(weekStart: Date, weekEnd: Date) {
  const monthFormat = new Intl.DateTimeFormat('pt-BR', { month: 'long' });
  const firstMonth = monthFormat.format(weekStart);
  const secondMonth = monthFormat.format(weekEnd);
  if (firstMonth === secondMonth) return firstMonth;
  return `${firstMonth} / ${secondMonth}`;
}

export default function InstrutorAgendaScreen() {
  const mode = useThemeStore((state) => state.mode);
  const colors = getBrandColors(mode);

  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState(1);
  const [filter, setFilter] = useState<'Todas' | AgendaStatus>('Todas');
  const [events, setEvents] = useState<ClassEvent[]>(WEEK_EVENTS);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    dayOffset: 1,
    time: '',
    title: '',
    location: '',
    duration: '',
    status: 'Aberta' as AgendaStatus,
    price: '',
    maxStudents: '',
    notes: '',
  });

  const weekDays = useMemo(() => {
    const now = new Date();
    const weekStart = getStartOfWeek(now);
    weekStart.setDate(weekStart.getDate() + weekOffset * 7);

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);
      return {
        index,
        date,
        dayLabel: DAY_LABELS[date.getDay()],
        dateLabel: String(date.getDate()),
      };
    });
  }, [weekOffset]);

  const selectedDay = weekDays[selectedDayIndex];
  const weekStart = weekDays[0]?.date ?? new Date();
  const weekEnd = weekDays[6]?.date ?? new Date();
  const weekTitle = formatMonthRange(weekStart, weekEnd);

  const selectedEvents = useMemo(() => {
    const base = events.filter((event) => event.dayOffset === selectedDayIndex);
    if (filter === 'Todas') return base;
    return base.filter((event) => event.status === filter);
  }, [events, selectedDayIndex, filter]);

  const canSubmit =
    form.time.trim() &&
    form.title.trim() &&
    form.location.trim() &&
    form.duration.trim() &&
    form.price.trim() &&
    form.maxStudents.trim();

  const resetForm = () => {
    setForm({
      dayOffset: selectedDayIndex,
      time: '',
      title: '',
      location: '',
      duration: '',
      status: 'Aberta',
      price: '',
      maxStudents: '',
      notes: '',
    });
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsCreateOpen(true);
  };

  const handleSaveClass = async () => {
    if (!canSubmit || isSaving) return;
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const event: ClassEvent = {
      id: `${Date.now()}`,
      dayOffset: form.dayOffset,
      time: form.time.trim(),
      title: form.title.trim(),
      location: form.location.trim(),
      duration: form.duration.trim(),
      status: form.status,
      price: form.price.trim(),
      maxStudents: form.maxStudents.trim(),
      notes: form.notes.trim() || undefined,
    };

    setEvents((current) =>
      [...current, event].sort((a, b) => a.dayOffset - b.dayOffset || a.time.localeCompare(b.time))
    );
    setSelectedDayIndex(form.dayOffset);
    setFilter('Todas');
    setIsSaving(false);
    setIsCreateOpen(false);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Agenda' }} />
      <AppScreen>
        <ScrollView
          style={{ backgroundColor: 'transparent' }}
          contentContainerStyle={styles.content}
          stickyHeaderIndices={[1]}
          showsVerticalScrollIndicator={false}>
          <LinearGradient
            colors={getHeroGradient(mode)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.headerCard,
              { borderColor: colors.borderSubtle, borderWidth: 1 },
            ]}>
            <View style={styles.headerTopRow}>
              <View>
                <Text
                  style={[
                    styles.headerTitle,
                    { color: colors.text, fontFamily: brandTypography.display },
                  ]}>
                  Agenda
                </Text>
                <Text
                  style={[styles.headerSubtitle, { color: colors.textMuted, fontFamily: brandTypography.body }]}>
                  Semana de {weekTitle}
                </Text>
              </View>
              <View
                style={[
                  styles.headerIconWrap,
                  { backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.borderSubtle },
                ]}>
                <FontAwesome name="calendar" size={16} color={colors.primary} />
              </View>
            </View>

            <View style={styles.weekNavRow}>
              <Pressable
                style={[styles.weekNavButton, { backgroundColor: colors.surfaceMuted }]}
                onPress={() => setWeekOffset((current) => current - 1)}>
                <FontAwesome name="chevron-left" size={12} color={colors.text} />
              </Pressable>
              <Text
                style={[
                  styles.weekRangeText,
                  { color: colors.text, fontFamily: brandTypography.displaySemibold },
                ]}>
                {weekDays[0]?.dateLabel} — {weekDays[6]?.dateLabel}
              </Text>
              <Pressable
                style={[styles.weekNavButton, { backgroundColor: colors.surfaceMuted }]}
                onPress={() => setWeekOffset((current) => current + 1)}>
                <FontAwesome name="chevron-right" size={12} color={colors.text} />
              </Pressable>
            </View>
          </LinearGradient>

          <View
            style={[
              styles.stickyWeekWrap,
              { backgroundColor: 'transparent', borderBottomColor: colors.borderSubtle },
            ]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayRow}>
              {weekDays.map((day) => (
                <AgendaDayChip
                  key={day.index}
                  dayLabel={day.dayLabel}
                  dateLabel={day.dateLabel}
                  selected={selectedDayIndex === day.index}
                  onPress={() => setSelectedDayIndex(day.index)}
                />
              ))}
            </ScrollView>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            <AgendaFilterChip
              label="Todas"
              active={filter === 'Todas'}
              onPress={() => setFilter('Todas')}
            />
            <AgendaFilterChip
              label="Confirmadas"
              active={filter === 'Confirmada'}
              onPress={() => setFilter('Confirmada')}
            />
            <AgendaFilterChip
              label="Abertas"
              active={filter === 'Aberta'}
              onPress={() => setFilter('Aberta')}
            />
            <AgendaFilterChip
              label="Quase lotadas"
              active={filter === 'Quase lotada'}
              onPress={() => setFilter('Quase lotada')}
            />
          </ScrollView>

          <View style={styles.timelineHeaderRow}>
            <Text
              style={[
                styles.timelineTitle,
                { color: colors.text, fontFamily: brandTypography.displaySemibold },
              ]}>
              Dia {selectedDay?.dateLabel} — {selectedDay?.dayLabel}
            </Text>
            <Text style={[styles.timelineCount, { color: colors.textMuted, fontFamily: brandTypography.body }]}>
              {selectedEvents.length} aula(s)
            </Text>
          </View>

          {selectedEvents.length ? (
            <View style={styles.timelineList}>
              {selectedEvents.map((event, eventIndex) => (
                <AgendaTimelineItem
                  key={event.id}
                  time={event.time}
                  title={event.title}
                  location={event.location}
                  duration={event.duration}
                  status={event.status}
                  price={event.price}
                  maxStudents={event.maxStudents}
                  isLast={eventIndex === selectedEvents.length - 1}
                />
              ))}
            </View>
          ) : (
            <View
              style={[
                styles.emptyState,
                { backgroundColor: colors.surface, borderColor: colors.borderSubtle },
              ]}>
              <View style={[styles.emptyIconWrap, { backgroundColor: colors.surfaceMuted }]}>
                <FontAwesome name="calendar-o" size={16} color={colors.textMuted} />
              </View>
              <Text
                style={[
                  styles.emptyTitle,
                  { color: colors.text, fontFamily: brandTypography.displaySemibold },
                ]}>
                Sem aulas neste filtro
              </Text>
              <Text style={[styles.emptyText, { color: colors.textMuted, fontFamily: brandTypography.body }]}>
                Ajuste o dia ou filtro para visualizar compromissos.
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.floatingCreateWrap} pointerEvents="box-none">
          <Pressable onPress={handleOpenCreate}>
            {({ pressed }) => (
              <LinearGradient
                colors={[colors.accentButton, colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.floatingCreateButton,
                  getShadow(mode, 'floating'),
                  {
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}>
                <FontAwesome name="plus" size={14} color={colors.textOnPrimary} />
                <Text
                  style={[
                    styles.floatingCreateText,
                    { color: colors.textOnPrimary, fontFamily: brandTypography.label },
                  ]}>
                  Nova aula
                </Text>
              </LinearGradient>
            )}
          </Pressable>
        </View>

        <Modal visible={isCreateOpen} transparent animationType="slide" onRequestClose={() => setIsCreateOpen(false)}>
          <View style={styles.modalOverlay}>
            <Pressable
              style={[styles.modalBackdrop, { backgroundColor: colors.overlay }]}
              onPress={() => !isSaving && setIsCreateOpen(false)}
            />
            <View
              style={[
                styles.modalCard,
                { backgroundColor: colors.surface, borderColor: colors.borderSubtle },
              ]}>
              <View style={styles.modalHeader}>
                <Text
                  style={[
                    styles.modalTitle,
                    { color: colors.text, fontFamily: brandTypography.display },
                  ]}>
                  Nova aula
                </Text>
                <Pressable
                  disabled={isSaving}
                  style={[styles.modalClose, { backgroundColor: colors.surfaceMuted }]}
                  onPress={() => setIsCreateOpen(false)}>
                  <FontAwesome name="close" size={12} color={colors.text} />
                </Pressable>
              </View>

              <ScrollView contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
                <Text style={[styles.fieldLabel, { color: colors.textMuted, fontFamily: brandTypography.body }]}>
                  Dia
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayRow}>
                  {weekDays.map((day) => (
                    <AgendaDayChip
                      key={`form-${day.index}`}
                      dayLabel={day.dayLabel}
                      dateLabel={day.dateLabel}
                      selected={form.dayOffset === day.index}
                      onPress={() => setForm((current) => ({ ...current, dayOffset: day.index }))}
                    />
                  ))}
                </ScrollView>

                <View style={styles.row}>
                  <View style={styles.fieldHalf}>
                    <Text
                      style={[styles.fieldLabel, { color: colors.textMuted, fontFamily: brandTypography.body }]}>
                      Horário
                    </Text>
                    <TextInput
                      value={form.time}
                      onChangeText={(value) => setForm((current) => ({ ...current, time: value }))}
                      placeholder="Ex.: 18:30"
                      placeholderTextColor={colors.textMuted}
                      style={[
                        styles.input,
                        {
                          color: colors.text,
                          borderColor: colors.borderSubtle,
                          backgroundColor: colors.backgroundElevated,
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.fieldHalf}>
                    <Text
                      style={[styles.fieldLabel, { color: colors.textMuted, fontFamily: brandTypography.body }]}>
                      Duração
                    </Text>
                    <TextInput
                      value={form.duration}
                      onChangeText={(value) => setForm((current) => ({ ...current, duration: value }))}
                      placeholder="Ex.: 60 min"
                      placeholderTextColor={colors.textMuted}
                      style={[
                        styles.input,
                        {
                          color: colors.text,
                          borderColor: colors.borderSubtle,
                          backgroundColor: colors.backgroundElevated,
                        },
                      ]}
                    />
                  </View>
                </View>

                <Text style={[styles.fieldLabel, { color: colors.textMuted, fontFamily: brandTypography.body }]}>
                  Nome da aula
                </Text>
                <TextInput
                  value={form.title}
                  onChangeText={(value) => setForm((current) => ({ ...current, title: value }))}
                  placeholder="Ex.: Funcional em circuito"
                  placeholderTextColor={colors.textMuted}
                  style={[
                    styles.input,
                    {
                      color: colors.text,
                      borderColor: colors.borderSubtle,
                      backgroundColor: colors.backgroundElevated,
                    },
                  ]}
                />

                <Text style={[styles.fieldLabel, { color: colors.textMuted, fontFamily: brandTypography.body }]}>
                  Local
                </Text>
                <TextInput
                  value={form.location}
                  onChangeText={(value) => setForm((current) => ({ ...current, location: value }))}
                  placeholder="Ex.: Parque Bosque Maia"
                  placeholderTextColor={colors.textMuted}
                  style={[
                    styles.input,
                    {
                      color: colors.text,
                      borderColor: colors.borderSubtle,
                      backgroundColor: colors.backgroundElevated,
                    },
                  ]}
                />

                <View style={styles.row}>
                  <View style={styles.fieldHalf}>
                    <Text
                      style={[styles.fieldLabel, { color: colors.textMuted, fontFamily: brandTypography.body }]}>
                      Valor
                    </Text>
                    <TextInput
                      value={form.price}
                      onChangeText={(value) => setForm((current) => ({ ...current, price: value }))}
                      placeholder="Ex.: R$ 25"
                      placeholderTextColor={colors.textMuted}
                      style={[
                        styles.input,
                        {
                          color: colors.text,
                          borderColor: colors.borderSubtle,
                          backgroundColor: colors.backgroundElevated,
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.fieldHalf}>
                    <Text
                      style={[styles.fieldLabel, { color: colors.textMuted, fontFamily: brandTypography.body }]}>
                      Vagas
                    </Text>
                    <TextInput
                      value={form.maxStudents}
                      onChangeText={(value) => setForm((current) => ({ ...current, maxStudents: value }))}
                      placeholder="Ex.: 20"
                      placeholderTextColor={colors.textMuted}
                      style={[
                        styles.input,
                        {
                          color: colors.text,
                          borderColor: colors.borderSubtle,
                          backgroundColor: colors.backgroundElevated,
                        },
                      ]}
                    />
                  </View>
                </View>

                <Text style={[styles.fieldLabel, { color: colors.textMuted, fontFamily: brandTypography.body }]}>
                  Status inicial
                </Text>
                <View style={styles.statusRow}>
                  <AgendaFilterChip
                    label="Aberta"
                    active={form.status === 'Aberta'}
                    onPress={() => setForm((current) => ({ ...current, status: 'Aberta' }))}
                  />
                  <AgendaFilterChip
                    label="Confirmada"
                    active={form.status === 'Confirmada'}
                    onPress={() => setForm((current) => ({ ...current, status: 'Confirmada' }))}
                  />
                  <AgendaFilterChip
                    label="Quase lotada"
                    active={form.status === 'Quase lotada'}
                    onPress={() => setForm((current) => ({ ...current, status: 'Quase lotada' }))}
                  />
                </View>

                <Text style={[styles.fieldLabel, { color: colors.textMuted, fontFamily: brandTypography.body }]}>
                  Observações
                </Text>
                <TextInput
                  value={form.notes}
                  onChangeText={(value) => setForm((current) => ({ ...current, notes: value }))}
                  placeholder="Observações opcionais"
                  placeholderTextColor={colors.textMuted}
                  multiline
                  style={[
                    styles.input,
                    styles.textArea,
                    {
                      color: colors.text,
                      borderColor: colors.borderSubtle,
                      backgroundColor: colors.backgroundElevated,
                    },
                  ]}
                />
              </ScrollView>

              <Pressable
                disabled={!canSubmit || isSaving}
                onPress={handleSaveClass}
                style={({ pressed }) => [
                  styles.saveButton,
                  { opacity: !canSubmit || isSaving ? 0.55 : pressed ? 0.92 : 1 },
                ]}>
                {canSubmit && !isSaving ? (
                  <LinearGradient
                    colors={[colors.accentButton, colors.primary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      minHeight: 50,
                      borderRadius: 14,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={[
                        styles.saveButtonText,
                        { color: colors.textOnPrimary, fontFamily: brandTypography.label },
                      ]}>
                      Salvar aula
                    </Text>
                  </LinearGradient>
                ) : isSaving ? (
                  <LinearGradient
                    colors={[colors.accentButton, colors.primary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      minHeight: 50,
                      borderRadius: 14,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <View style={styles.loadingWrap}>
                      <ActivityIndicator size="small" color={colors.textOnPrimary} />
                      <Text
                        style={[
                          styles.saveButtonText,
                          { color: colors.textOnPrimary, fontFamily: brandTypography.label },
                        ]}>
                        Salvando...
                      </Text>
                    </View>
                  </LinearGradient>
                ) : (
                  <View
                    style={{
                      minHeight: 50,
                      borderRadius: 14,
                      backgroundColor: colors.borderSubtle,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={[
                        styles.saveButtonText,
                        { color: colors.textMuted, fontFamily: brandTypography.label },
                      ]}>
                      Salvar aula
                    </Text>
                  </View>
                )}
              </Pressable>
            </View>
          </View>
        </Modal>
      </AppScreen>
    </>
  );
}

const styles = {
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 96,
    gap: 14,
  },
  headerCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    gap: 12,
  },
  headerTopRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  headerTitle: {
    fontSize: 22,
    lineHeight: 26,
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 17,
  },
  headerIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  weekNavRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  weekNavButton: {
    width: 30,
    height: 30,
    borderRadius: 999,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  floatingCreateWrap: {
    position: 'absolute' as const,
    left: 16,
    right: 16,
    bottom: 16,
  },
  floatingCreateButton: {
    minHeight: 50,
    borderRadius: 14,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
  },
  floatingCreateText: {
    fontSize: 15,
    lineHeight: 18,
  },
  weekRangeText: {
    fontSize: 13,
    lineHeight: 16,
  },
  dayRow: {
    gap: 8,
    paddingRight: 8,
  },
  stickyWeekWrap: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 10,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  filterRow: {
    gap: 8,
    paddingRight: 8,
  },
  timelineHeaderRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  timelineTitle: {
    fontSize: 17,
    lineHeight: 21,
  },
  timelineCount: {
    fontSize: 12,
    lineHeight: 15,
  },
  timelineList: {
    gap: 10,
  },
  emptyState: {
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 16,
    alignItems: 'center' as const,
    gap: 8,
  },
  emptyIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  emptyTitle: {
    fontSize: 15,
    lineHeight: 19,
  },
  emptyText: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center' as const,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end' as const,
  },
  modalBackdrop: {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  modalCard: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: 1,
    borderBottomWidth: 0,
    maxHeight: '86%' as const,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 22,
    gap: 12,
  },
  modalHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  modalTitle: {
    fontSize: 19,
    lineHeight: 23,
  },
  modalClose: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  formContent: {
    gap: 8,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row' as const,
    gap: 10,
  },
  fieldHalf: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    lineHeight: 15,
    marginBottom: 6,
  },
  input: {
    minHeight: 42,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    fontFamily: brandTypography.body,
  },
  textArea: {
    minHeight: 76,
    textAlignVertical: 'top' as const,
    paddingTop: 10,
  },
  statusRow: {
    flexDirection: 'row' as const,
    gap: 8,
    flexWrap: 'wrap' as const,
    marginBottom: 2,
  },
  saveButton: {
    minHeight: 48,
    borderRadius: 14,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginTop: 2,
  },
  saveButtonText: {
    fontSize: 15,
    lineHeight: 18,
  },
  loadingWrap: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
};
