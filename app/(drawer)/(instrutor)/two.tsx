import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import { Stack } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ActivityIndicator,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  ScrollView as GHScrollView,
} from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  clamp,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppScreen } from '@/components/AppScreen';
import { HeroSurface } from '@/components/HeroSurface';
import { AgendaDayChip } from '@/components/instructor/AgendaDayChip';
import { FormDayMonthDivider } from '@/components/instructor/FormDayMonthDivider';
import { AgendaFilterChip } from '@/components/instructor/AgendaFilterChip';
import { AgendaTimelineItem } from '@/components/instructor/AgendaTimelineItem';
import { useThemeStore } from '@/store/store';
import { brandTypography, getBrandColors, getShadow, layout } from '@/theme/tokens';

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

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toDateKey(date: Date) {
  const d = startOfDay(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseDateKey(key: string) {
  const [y, mon, day] = key.split('-').map(Number);
  return startOfDay(new Date(y, mon - 1, day));
}

const OPEN_SPRING = { damping: 22, stiffness: 210, mass: 0.85 };
const SNAP_SPRING = { damping: 24, stiffness: 300, mass: 0.72 };
const CLOSE_SPRING = { damping: 23, stiffness: 280, mass: 0.88 };
const SNAP_DRAG_RESET = { damping: 28, stiffness: 360, mass: 0.75 };

export default function InstrutorAgendaScreen() {
  const mode = useThemeStore((state) => state.mode);
  const colors = getBrandColors(mode);
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState(1);
  const [filter, setFilter] = useState<'Todas' | AgendaStatus>('Todas');
  const [events, setEvents] = useState<ClassEvent[]>(WEEK_EVENTS);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [createSheetSnap, setCreateSheetSnap] = useState<'peek' | 'full'>('peek');
  const [dayStripLoading, setDayStripLoading] = useState(false);
  const [formDayChunkCount, setFormDayChunkCount] = useState(1);
  const stripEndLoadLockRef = useRef(false);
  const [form, setForm] = useState({
    selectedDateKey: '',
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

  const formDayStrip = useMemo(() => {
    const anchor = weekDays[0]?.date;
    if (!anchor) return [];
    const start = startOfDay(new Date(anchor));
    const totalDays = 7 * formDayChunkCount;
    return Array.from({ length: totalDays }, (_, i) => {
      const date = addDays(start, i);
      return {
        date,
        dateKey: toDateKey(date),
        dayLabel: DAY_LABELS[date.getDay()],
        dateLabel: String(date.getDate()),
      };
    });
  }, [weekDays, formDayChunkCount]);

  const sheetPeekHeight = useMemo(() => Math.round(windowHeight * 0.86), [windowHeight]);
  const sheetFullHeight = useMemo(() => windowHeight, [windowHeight]);
  const sheetMidHeight = useMemo(() => sheetPeekHeight + (sheetFullHeight - sheetPeekHeight) / 2, [sheetPeekHeight, sheetFullHeight]);

  const sheetHeightSv = useSharedValue(sheetPeekHeight);
  const dismissTranslateSv = useSharedValue(0);
  const backdropOpacitySv = useSharedValue(0);
  const entryTranslateSv = useSharedValue(0);
  /** Captured pan start baseline (peek/full drag). */
  const panStartSheetH = useSharedValue(sheetPeekHeight);
  const panStartDismiss = useSharedValue(0);

  const snapRef = useRef<'peek' | 'full'>('peek');
  snapRef.current = createSheetSnap;

  const finalizeClosed = useCallback(() => {
    setIsCreateOpen(false);
    setCreateSheetSnap('peek');
  }, []);

  const requestDismissSheetAnimated = useCallback(() => {
    backdropOpacitySv.value = withTiming(0, { duration: 260 });
    dismissTranslateSv.value = withSpring(windowHeight + 40, CLOSE_SPRING, (finished) => {
      if (finished) runOnJS(finalizeClosed)();
    });
  }, [backdropOpacitySv, dismissTranslateSv, finalizeClosed, windowHeight]);

  const togglePeekFullAnimated = useCallback(() => {
    if (!isCreateOpen || isSaving) return;
    const next = snapRef.current === 'full' ? 'peek' : 'full';
    const target = next === 'full' ? sheetFullHeight : sheetPeekHeight;
    snapRef.current = next;
    setCreateSheetSnap(next);
    sheetHeightSv.value = withSpring(target, SNAP_SPRING);
  }, [isCreateOpen, isSaving, sheetFullHeight, sheetPeekHeight, sheetHeightSv]);

  const gestureAllowed = Boolean(isCreateOpen && !isSaving);

  const panGesture = Gesture.Pan()
    .enabled(gestureAllowed)
    .activeOffsetY([-8, 8])
    .failOffsetX([-26, 26])
    .onStart(() => {
      panStartSheetH.value = sheetHeightSv.value;
      panStartDismiss.value = dismissTranslateSv.value;
    })
    .onUpdate((e) => {
      const dy = e.translationY;
      const raw = panStartSheetH.value - dy;
      if (raw < sheetPeekHeight) {
        sheetHeightSv.value = sheetPeekHeight;
        dismissTranslateSv.value = panStartDismiss.value + (sheetPeekHeight - raw);
        return;
      }
      if (raw > sheetFullHeight) {
        sheetHeightSv.value = sheetFullHeight;
        dismissTranslateSv.value = panStartDismiss.value;
        return;
      }
      sheetHeightSv.value = raw;
      dismissTranslateSv.value = panStartDismiss.value;
    })
    .onEnd((e) => {
      'worklet';
      const vy = e.velocityY;
      const dh = dismissTranslateSv.value;
      const DISMISS_THRESHOLD = Math.min(windowHeight * 0.09, 100);
      const HARD_DISMISS_Y = Math.min(windowHeight * 0.04, 40);

      if (dh >= DISMISS_THRESHOLD || (dh > HARD_DISMISS_Y && vy > 760)) {
        backdropOpacitySv.value = withTiming(0, { duration: 260 });
        dismissTranslateSv.value = withSpring(windowHeight + 40, CLOSE_SPRING, (finished) => {
          if (finished) runOnJS(finalizeClosed)();
        });
        return;
      }

      dismissTranslateSv.value = withSpring(0, SNAP_DRAG_RESET);

      const currentH = sheetHeightSv.value;
      let targetH = currentH >= sheetMidHeight ? sheetFullHeight : sheetPeekHeight;
      if (vy < -420) targetH = sheetFullHeight;
      else if (vy > 420) targetH = sheetPeekHeight;
      sheetHeightSv.value = withSpring(targetH, SNAP_SPRING, (finished) => {
        if (!finished) return;
        const label: 'peek' | 'full' = targetH >= sheetMidHeight ? 'full' : 'peek';
        runOnJS(setCreateSheetSnap)(label);
      });
    });

  const toggleTapGesture = Gesture.Tap()
    .enabled(gestureAllowed)
    .maxDuration(320)
    .maxDistance(14)
    .onEnd(() => {
      runOnJS(togglePeekFullAnimated)();
    });

  const grabGestures = Gesture.Exclusive(panGesture, toggleTapGesture);

  const backdropOverlayStyle = useAnimatedStyle(() => {
    const dim = interpolate(
      dismissTranslateSv.value,
      [0, windowHeight * 0.45],
      [1, 0],
      Extrapolation.CLAMP,
    );
    return {
      opacity: backdropOpacitySv.value * dim,
      backgroundColor: colors.overlay as unknown as string,
    };
  }, [colors.overlay]);

  const sheetWrapperStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: entryTranslateSv.value + dismissTranslateSv.value }],
  }));

  const sheetCardStyle = useAnimatedStyle(() => {
    const h = clamp(sheetHeightSv.value, sheetPeekHeight * 0.96, sheetFullHeight + 2);
    const padTop = interpolate(
      h,
      [sheetPeekHeight, sheetFullHeight],
      [6, insets.top + 10],
      Extrapolation.CLAMP,
    );
    const padBottom = interpolate(
      h,
      [sheetPeekHeight, sheetFullHeight],
      [22, insets.bottom + 22],
      Extrapolation.CLAMP,
    );
    return {
      height: h,
      maxHeight: sheetFullHeight + 6,
      paddingTop: padTop,
      paddingBottom: padBottom,
      overflow: 'hidden' as const,
    };
  });

  /** Abre entrada suave sempre que abre modal (FAB). */
  const runOpenPresentation = useCallback(() => {
    sheetHeightSv.value = sheetPeekHeight;
    dismissTranslateSv.value = 0;
    entryTranslateSv.value = 72;
    backdropOpacitySv.value = 0;
    backdropOpacitySv.value = withTiming(1, { duration: 300 });
    entryTranslateSv.value = withSpring(0, OPEN_SPRING);
  }, [backdropOpacitySv, dismissTranslateSv, entryTranslateSv, sheetPeekHeight, sheetHeightSv]);

  const handleFormDayStripScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;
    const w = layoutMeasurement.width;
    if (w <= 0) return;
    const threshold = 72;
    if (contentOffset.x + w < contentSize.width - threshold) {
      stripEndLoadLockRef.current = false;
      return;
    }
    if (stripEndLoadLockRef.current) return;
    stripEndLoadLockRef.current = true;
    setDayStripLoading(true);
    setFormDayChunkCount((c) => c + 1);
    setTimeout(() => {
      stripEndLoadLockRef.current = false;
    }, 450);
  }, []);

  useEffect(() => {
    if (!dayStripLoading) return;
    const t = setTimeout(() => setDayStripLoading(false), 400);
    return () => clearTimeout(t);
  }, [formDayChunkCount, dayStripLoading]);

  const closeCreateModal = useCallback(() => {
    if (isSaving) return;
    requestDismissSheetAnimated();
  }, [isSaving, requestDismissSheetAnimated]);

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
    Boolean(form.selectedDateKey) &&
    form.time.trim() &&
    form.title.trim() &&
    form.location.trim() &&
    form.duration.trim() &&
    form.price.trim() &&
    form.maxStudents.trim();

  const resetForm = () => {
    const d = weekDays[selectedDayIndex]?.date;
    setForm({
      selectedDateKey: d ? toDateKey(d) : '',
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
    snapRef.current = 'peek';
    setCreateSheetSnap('peek');
    setDayStripLoading(false);
    setFormDayChunkCount(1);
    stripEndLoadLockRef.current = false;
    resetForm();
    setIsCreateOpen(true);
    runOpenPresentation();
  };

  const handleSaveClass = async () => {
    if (!canSubmit || isSaving) return;
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const picked = parseDateKey(form.selectedDateKey);
    const visibleWeekStart = getStartOfWeek(new Date(weekDays[0].date));
    const pickedWeekStart = getStartOfWeek(picked);
    const deltaDays = (pickedWeekStart.getTime() - visibleWeekStart.getTime()) / 86400000;
    const deltaWeeks = Math.round(deltaDays / 7);

    const dayOffset = picked.getDay();

    const event: ClassEvent = {
      id: `${Date.now()}`,
      dayOffset,
      time: form.time.trim(),
      title: form.title.trim(),
      location: form.location.trim(),
      duration: form.duration.trim(),
      status: form.status,
      price: form.price.trim(),
      maxStudents: form.maxStudents.trim(),
      notes: form.notes.trim() || undefined,
    };

    setWeekOffset((w) => w + deltaWeeks);
    setEvents((current) =>
      [...current, event].sort((a, b) => a.dayOffset - b.dayOffset || a.time.localeCompare(b.time))
    );
    setSelectedDayIndex(dayOffset);
    setFilter('Todas');
    setIsSaving(false);
    requestDismissSheetAnimated();
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
          <HeroSurface padding={layout.space.md}>
            <View style={styles.weekSelectorStack}>
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
                  style={[
                    styles.weekNavButton,
                    mode === 'light'
                      ? {
                          backgroundColor: colors.surface,
                          borderWidth: 1,
                          borderColor: colors.borderSubtle,
                        }
                      : { backgroundColor: colors.surfaceMuted },
                  ]}
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
                  style={[
                    styles.weekNavButton,
                    mode === 'light'
                      ? {
                          backgroundColor: colors.surface,
                          borderWidth: 1,
                          borderColor: colors.borderSubtle,
                        }
                      : { backgroundColor: colors.surfaceMuted },
                  ]}
                  onPress={() => setWeekOffset((current) => current + 1)}>
                  <FontAwesome name="chevron-right" size={12} color={colors.text} />
                </Pressable>
              </View>
            </View>
          </HeroSurface>

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

        <Modal visible={isCreateOpen} transparent animationType="none" onRequestClose={closeCreateModal}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.modalOverlay}>
              <Animated.View style={[styles.modalBackdrop, backdropOverlayStyle]} pointerEvents="box-none">
                <Pressable
                  style={[StyleSheet.absoluteFillObject]}
                  accessibilityRole="button"
                  accessibilityLabel="Fechar painel"
                  onPress={() => !isSaving && closeCreateModal()}
                />
              </Animated.View>

              <Animated.View style={[sheetWrapperStyle]} pointerEvents="box-none">
                <Animated.View
                  style={[
                    styles.modalCard,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.borderSubtle,
                    },
                    sheetCardStyle,
                  ]}>
                  <GestureDetector gesture={grabGestures}>
                    <View
                      accessibilityRole="button"
                      accessibilityLabel={
                        createSheetSnap === 'full'
                          ? 'Reduzir painel (arrastar para baixo)'
                          : 'Expandir para ecrã cheio (arrastar para cima)'
                      }
                      hitSlop={12}
                      style={[styles.modalGrabberHit, { opacity: isSaving ? 0.45 : 1 }]}>
                      <View style={[styles.modalGrabberBar, { backgroundColor: colors.borderSubtle }]} />
                      <FontAwesome
                        name={createSheetSnap === 'full' ? 'chevron-down' : 'chevron-up'}
                        size={10}
                        color={colors.textMuted}
                        style={{ marginTop: 6 }}
                      />
                    </View>
                  </GestureDetector>
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
                  onPress={closeCreateModal}>
                  <FontAwesome name="close" size={12} color={colors.text} />
                </Pressable>
              </View>

              <GHScrollView
                style={createSheetSnap === 'full' ? styles.modalFormScrollExpanded : undefined}
                contentContainerStyle={styles.formContent}
                showsVerticalScrollIndicator={false}>
                <Text style={[styles.fieldLabel, { color: colors.textMuted, fontFamily: brandTypography.body }]}>
                  Dia
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={[styles.dayRow, styles.dayRowWithLoader]}
                  scrollEventThrottle={100}
                  onScroll={handleFormDayStripScroll}>
                  {formDayStrip.flatMap((item, i) => {
                    const out: ReactElement[] = [];
                    if (i > 0) {
                      const prev = formDayStrip[i - 1]!;
                      const monthChange =
                         prev.date.getMonth() !== item.date.getMonth() ||
                        prev.date.getFullYear() !== item.date.getFullYear();
                      if (monthChange) {
                        out.push(
                          <FormDayMonthDivider
                            key={`month-${item.dateKey}`}
                            date={item.date}
                            showYear={prev.date.getFullYear() !== item.date.getFullYear()}
                          />
                        );
                      }
                    }
                    out.push(
                      <AgendaDayChip
                        key={item.dateKey}
                        dayLabel={item.dayLabel}
                        dateLabel={item.dateLabel}
                        selected={form.selectedDateKey === item.dateKey}
                        onPress={() =>
                          setForm((current) => ({ ...current, selectedDateKey: item.dateKey }))
                        }
                      />
                    );
                    return out;
                  })}
                  {dayStripLoading ? (
                    <View
                      style={[
                        styles.dayStripLoaderPill,
                        {
                          borderColor: colors.borderSubtle,
                          backgroundColor: colors.surfaceMuted,
                        },
                      ]}>
                      <ActivityIndicator size="small" color={colors.primary} />
                    </View>
                  ) : null}
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
              </GHScrollView>

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
                </Animated.View>
              </Animated.View>
            </View>
          </GestureHandlerRootView>
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
  weekSelectorStack: {
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
  dayRowWithLoader: {
    alignItems: 'center' as const,
  },
  dayStripLoaderPill: {
    minWidth: 48,
    height: 86,
    borderRadius: layout.radius.md,
    borderWidth: 1,
    marginLeft: 4,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
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
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 22,
    gap: 12,
  },
  modalGrabberHit: {
    alignItems: 'center' as const,
    paddingBottom: 10,
    paddingTop: 2,
  },
  modalGrabberBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  modalFormScrollExpanded: {
    flex: 1,
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
