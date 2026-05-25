import { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  Pressable,
  Animated,
  PanResponder,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, fonts, fontSize, spacing, tracking } from '../../theme/theme';
import type { WorkoutDay, Exercise } from '../../data/workouts';
import { loadProgram, saveProgram, loadWeek, saveWeek, loadHistory, saveExerciseWeek } from '../../data/storage';
import type { ExerciseHistory, WeekEntry } from '../../data/storage';
import ProgressLine from './ProgressLine';

type Status = 'completed' | 'skipped';

interface FlatExercise {
  exercise: Exercise;
  sectionTitle: string;
  sectionIndex: number;
  exerciseIndex: number;
}

export default function WorkoutView() {
  const { width } = useWindowDimensions();
  const [program, setProgram] = useState<WorkoutDay[]>([]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [week, setWeek] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [notification, setNotification] = useState<string | null>(null);
  const [history, setHistory] = useState<ExerciseHistory>({});

  const pan = useRef(new Animated.Value(0)).current;
  const notifyOpacity = useRef(new Animated.Value(0)).current;
  const enterAnim = useRef(new Animated.Value(0)).current;

  const day = program[selectedDay];

  useEffect(() => {
    (async () => {
      const [p, w, h] = await Promise.all([loadProgram(), loadWeek(), loadHistory()]);
      setProgram(p);
      setWeek(w);
      setHistory(h);
    })();
  }, []);

  const exercises = useMemo<FlatExercise[]>(() => {
    if (!day) return [];
    const items: FlatExercise[] = [];
    day.sections.forEach((section, sIdx) => {
      section.exercises.forEach((ex, eIdx) => {
        items.push({
          exercise: ex,
          sectionTitle: section.title,
          sectionIndex: sIdx,
          exerciseIndex: eIdx,
        });
      });
    });
    return items;
  }, [day]);

  const allResolved = exercises.length > 0 && exercises.every((e) => statuses[e.exercise.id]);
  const showSummary = allResolved || currentIndex >= exercises.length;

  // Use ref so PanResponder always sees latest state
  const resolveRef = useRef<(status: Status) => void>(() => {});
  resolveRef.current = (status: Status) => {
    const ex = exercises[currentIndex];
    if (!ex) return;

    Haptics.impactAsync(
      status === 'completed'
        ? Haptics.ImpactFeedbackStyle.Medium
        : Haptics.ImpactFeedbackStyle.Light,
    );

    setStatuses((prev) => ({ ...prev, [ex.exercise.id]: status }));

    if (status === 'completed') {
      saveExerciseWeek(
        ex.exercise.id,
        { week, load: ex.exercise.load, reps: ex.exercise.reps, sets: ex.exercise.sets },
        history,
      ).then(setHistory);
    }

    // Notification
    const label = status === 'completed' ? 'Completed' : 'Skipped';
    setNotification(label);
    notifyOpacity.setValue(1);
    Animated.timing(notifyOpacity, {
      toValue: 0,
      duration: 600,
      delay: 500,
      useNativeDriver: false,
    }).start(() => setNotification(null));

    // Slide card off
    const dir = status === 'completed' ? width : -width;
    Animated.timing(pan, {
      toValue: dir,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      // Slide next card in from opposite side
      pan.setValue(-dir * 0.3);
      Animated.spring(pan, {
        toValue: 0,
        useNativeDriver: false,
        tension: 80,
        friction: 12,
      }).start();
    });
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) =>
          Math.abs(g.dx) > 15 && Math.abs(g.dx) > Math.abs(g.dy) * 2,
        onPanResponderMove: (_, g) => pan.setValue(g.dx),
        onPanResponderRelease: (_, g) => {
          const threshold = width * 0.25;
          if (g.dx > threshold || (g.dx > 40 && g.vx > 0.5)) {
            resolveRef.current('completed');
          } else if (g.dx < -threshold || (g.dx < -40 && g.vx < -0.5)) {
            resolveRef.current('skipped');
          } else {
            Animated.spring(pan, {
              toValue: 0,
              useNativeDriver: false,
            }).start();
          }
        },
      }),
    [width],
  );

  function updateCell(sIdx: number, eIdx: number, field: keyof Exercise, value: string) {
    const next = structuredClone(program);
    const ex = next[selectedDay].sections[sIdx].exercises[eIdx];
    if (field === 'sets') {
      ex.sets = parseInt(value, 10) || 0;
    } else {
      (ex as any)[field] = value;
    }
    setProgram(next);
    saveProgram(next);
  }

  function selectDay(i: number) {
    Haptics.selectionAsync();
    setSelectedDay(i);
    setCurrentIndex(0);
    setStatuses({});
    pan.setValue(0);
  }

  async function adjustWeek(delta: number) {
    Haptics.selectionAsync();
    const n = Math.max(1, week + delta);
    setWeek(n);
    await saveWeek(n);
  }

  function resetWorkout() {
    Haptics.selectionAsync();
    setCurrentIndex(0);
    setStatuses({});
    pan.setValue(0);
  }

  if (!day) return null;

  const hasExercises = exercises.length > 0;

  // Swipe direction indicators
  const completeOpacity = pan.interpolate({
    inputRange: [0, width * 0.25],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const skipOpacity = pan.interpolate({
    inputRange: [-width * 0.25, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const cardRotate = pan.interpolate({
    inputRange: [-width, 0, width],
    outputRange: ['-4deg', '0deg', '4deg'],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.flex}>
      {!hasExercises ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No Exercises</Text>
          <Text style={styles.emptyHint}>Add exercises to Day {day.label}</Text>
        </View>
      ) : showSummary ? (
        <SummaryView
          day={day}
          week={week}
          exercises={exercises}
          statuses={statuses}
          onReset={resetWorkout}
        />
      ) : (
        <View style={styles.flex}>
          {/* Notification banner */}
          {notification && (
            <Animated.View style={[styles.notifyBanner, { opacity: notifyOpacity }]}>
              <Text
                style={[
                  styles.notifyText,
                  notification === 'Skipped' && styles.notifyTextSkipped,
                ]}
              >
                {notification}
              </Text>
            </Animated.View>
          )}

          {/* Swipe direction indicators (behind card) */}
          <View style={styles.directionHints}>
            <Animated.View style={[styles.dirHint, { opacity: skipOpacity }]}>
              <Text style={styles.dirHintSkip}>Skip</Text>
            </Animated.View>
            <Animated.View style={[styles.dirHint, { opacity: completeOpacity }]}>
              <Text style={styles.dirHintComplete}>Complete</Text>
            </Animated.View>
          </View>

          {/* Swipeable card */}
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.flex,
              {
                transform: [{ translateX: pan }, { rotate: cardRotate }],
              },
            ]}
          >
            <ExerciseCardView
              item={exercises[currentIndex]}
              position={currentIndex + 1}
              total={exercises.length}
              entries={history[exercises[currentIndex].exercise.id] || []}
              currentWeek={week}
              onUpdate={(field, value) =>
                updateCell(
                  exercises[currentIndex].sectionIndex,
                  exercises[currentIndex].exerciseIndex,
                  field,
                  value,
                )
              }
            />
          </Animated.View>

          {/* Bottom hints */}
          <View style={styles.swipeHints}>
            <Text style={styles.swipeHintText}>← Skip</Text>
            <Text style={styles.swipeHintText}>Complete →</Text>
          </View>
        </View>
      )}
    </View>
  );
}

function ExerciseCardView({
  item,
  position,
  total,
  entries,
  currentWeek,
  onUpdate,
}: {
  item: FlatExercise;
  position: number;
  total: number;
  entries: WeekEntry[];
  currentWeek: number;
  onUpdate: (field: keyof Exercise, value: string) => void;
}) {
  const { exercise, sectionTitle } = item;

  return (
    <ScrollView
      contentContainerStyle={styles.cardContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Exercise image */}
      <View style={styles.imageContainer}>
        {exercise.image ? (
          <Image
            source={{ uri: exercise.image }}
            style={styles.exerciseImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
      </View>

      {/* Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.sectionLabel}>{sectionTitle}</Text>
        <Text style={styles.positionText}>
          {position} / {total}
        </Text>
      </View>

      {/* Exercise name */}
      <Text style={styles.exerciseName}>{exercise.name}</Text>

      {/* Notes */}
      <TextInput
        style={styles.notesInput}
        value={exercise.notes}
        onChangeText={(v) => onUpdate('notes', v)}
        placeholder="Add notes..."
        placeholderTextColor={colors.grayMid}
        multiline
      />

      {/* Data grid */}
      <View style={styles.dataGrid}>
        <DataCell
          label="Sets"
          value={exercise.sets ? String(exercise.sets) : ''}
          onChange={(v) => onUpdate('sets', v)}
          numeric
        />
        <DataCell
          label="Reps"
          value={exercise.reps}
          onChange={(v) => onUpdate('reps', v)}
        />
        <DataCell
          label="Load"
          value={exercise.load}
          onChange={(v) => onUpdate('load', v)}
        />
        <DataCell
          label="Rest"
          value={exercise.rest}
          onChange={(v) => onUpdate('rest', v)}
        />
      </View>

      <ProgressLine entries={entries} currentWeek={currentWeek} />
    </ScrollView>
  );
}

function DataCell({
  label,
  value,
  onChange,
  numeric,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  numeric?: boolean;
}) {
  return (
    <View style={styles.dataCell}>
      <Text style={styles.dataCellLabel}>{label}</Text>
      <TextInput
        style={styles.dataCellValue}
        value={value}
        onChangeText={onChange}
        placeholder="-"
        placeholderTextColor={colors.grayMid}
        keyboardType={numeric ? 'numeric' : 'default'}
        textAlign="center"
        selectTextOnFocus
      />
    </View>
  );
}

function SummaryView({
  day,
  week,
  exercises,
  statuses,
  onReset,
}: {
  day: WorkoutDay;
  week: number;
  exercises: FlatExercise[];
  statuses: Record<string, Status>;
  onReset: () => void;
}) {
  const completed = exercises.filter((e) => statuses[e.exercise.id] === 'completed').length;
  const skipped = exercises.filter((e) => statuses[e.exercise.id] === 'skipped').length;
  const totalSets = exercises
    .filter((e) => statuses[e.exercise.id] === 'completed')
    .reduce((sum, e) => sum + e.exercise.sets, 0);

  const today = new Date();
  const dateStr = today
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <ScrollView
      contentContainerStyle={styles.summaryContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.summaryTitle}>Workout{'\n'}Complete</Text>

      <View style={styles.summaryMeta}>
        <Text style={styles.summaryMetaText}>
          Day {day.label} — Wk {week}
        </Text>
        <Text style={styles.summaryDate}>{dateStr}</Text>
      </View>

      <View style={styles.summaryDivider} />

      <View style={styles.summaryStats}>
        <View style={styles.statBlock}>
          <Text style={styles.statValue}>{completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statBlock}>
          <Text style={styles.statValue}>{totalSets}</Text>
          <Text style={styles.statLabel}>Total Sets</Text>
        </View>
        <View style={styles.statBlock}>
          <Text style={[styles.statValue, skipped > 0 && styles.statValueDim]}>
            {skipped}
          </Text>
          <Text style={styles.statLabel}>Skipped</Text>
        </View>
      </View>

      <View style={styles.summaryDivider} />

      {exercises.map((e) => {
        const status = statuses[e.exercise.id];
        const isSkipped = status === 'skipped';
        return (
          <View
            key={e.exercise.id}
            style={[styles.summaryRow, isSkipped && styles.summaryRowSkipped]}
          >
            <View style={styles.summaryExLeft}>
              <Text
                style={[styles.summaryExName, isSkipped && styles.summaryExNameSkipped]}
                numberOfLines={1}
              >
                {e.exercise.name}
              </Text>
              {isSkipped && <Text style={styles.skippedBadge}>Skipped</Text>}
            </View>
            <Text
              style={[
                styles.summaryExDetail,
                isSkipped && styles.summaryExDetailSkipped,
              ]}
            >
              {e.exercise.sets} x {e.exercise.reps}
              {e.exercise.load ? `  ${e.exercise.load}` : ''}
            </Text>
          </View>
        );
      })}

      <Pressable onPress={onReset} style={styles.resetButton}>
        <Text style={styles.resetText}>Restart</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },

  // Empty
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  emptyText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.caption,
    color: colors.grayMid,
    letterSpacing: tracking.wide,
  },
  emptyHint: {
    fontFamily: fonts.regular,
    fontSize: fontSize.micro,
    color: colors.grayMid,
  },

  // Notification
  notifyBanner: {
    position: 'absolute',
    top: spacing.lg,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
  },
  notifyText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.caption,
    color: colors.white,
    letterSpacing: tracking.wide,
    backgroundColor: colors.grayDim,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 4,
    overflow: 'hidden',
  },
  notifyTextSkipped: {
    color: colors.grayMid,
  },

  // Direction indicators
  directionHints: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    zIndex: 0,
  },
  dirHint: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  dirHintSkip: {
    fontFamily: fonts.medium,
    fontSize: fontSize.display,
    color: colors.grayMid,
    letterSpacing: tracking.tight,
  },
  dirHintComplete: {
    fontFamily: fonts.medium,
    fontSize: fontSize.display,
    color: colors.white,
    letterSpacing: tracking.tight,
  },

  // Swipe hints (bottom)
  swipeHints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.grayBorder,
  },
  swipeHintText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.micro,
    color: colors.grayMid,
    letterSpacing: tracking.wide,
  },

  // Exercise card
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.grayDim,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.grayBorder,
    borderRadius: 4,
  },
  cardContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl * 2,
    backgroundColor: colors.black,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  sectionLabel: {
    fontFamily: fonts.medium,
    fontSize: fontSize.micro,
    color: colors.grayMid,
    letterSpacing: tracking.wide,
  },
  positionText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.micro,
    color: colors.grayMid,
    letterSpacing: tracking.loose,
  },
  exerciseName: {
    fontFamily: fonts.medium,
    fontSize: fontSize.display,
    color: colors.white,
    letterSpacing: tracking.tight,
    marginBottom: spacing.lg,
  },
  notesInput: {
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.grayLight,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.grayBorder,
    paddingVertical: spacing.sm,
    marginBottom: spacing.xxl,
  },

  // Data grid
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  dataCell: {
    width: '47%',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.grayBorder,
    borderRadius: 4,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  dataCellLabel: {
    fontFamily: fonts.medium,
    fontSize: fontSize.micro,
    color: colors.grayMid,
    letterSpacing: tracking.wide,
  },
  dataCellValue: {
    fontFamily: fonts.medium,
    fontSize: fontSize.heading,
    color: colors.white,
  },

  // Summary
  summaryContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl * 2,
    paddingBottom: spacing.xxl * 3,
    alignItems: 'center',
  },
  summaryTitle: {
    fontFamily: fonts.medium,
    fontSize: 36,
    color: colors.white,
    letterSpacing: tracking.tight,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  summaryMeta: {
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.xl,
  },
  summaryMetaText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.caption,
    color: colors.grayLight,
    letterSpacing: tracking.wide,
  },
  summaryDate: {
    fontFamily: fonts.regular,
    fontSize: fontSize.micro,
    color: colors.grayMid,
    letterSpacing: tracking.loose,
  },
  summaryDivider: {
    width: 40,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.grayBorder,
    marginVertical: spacing.xl,
  },
  summaryStats: {
    flexDirection: 'row',
    gap: spacing.xxl,
  },
  statBlock: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    fontFamily: fonts.medium,
    fontSize: fontSize.display,
    color: colors.white,
  },
  statValueDim: {
    color: colors.grayMid,
  },
  statLabel: {
    fontFamily: fonts.medium,
    fontSize: fontSize.micro,
    color: colors.grayMid,
    letterSpacing: tracking.wide,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.grayBorder,
  },
  summaryRowSkipped: {
    opacity: 0.4,
  },
  summaryExLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  summaryExName: {
    fontFamily: fonts.medium,
    fontSize: fontSize.body,
    color: colors.white,
    flexShrink: 1,
  },
  summaryExNameSkipped: {
    color: colors.grayMid,
  },
  skippedBadge: {
    fontFamily: fonts.medium,
    fontSize: fontSize.micro,
    color: colors.grayMid,
    letterSpacing: tracking.loose,
  },
  summaryExDetail: {
    fontFamily: fonts.regular,
    fontSize: fontSize.caption,
    color: colors.grayLight,
    letterSpacing: tracking.loose,
  },
  summaryExDetailSkipped: {
    color: colors.grayMid,
  },
  resetButton: {
    marginTop: spacing.xxl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.grayBorder,
    borderRadius: 4,
  },
  resetText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.caption,
    color: colors.grayLight,
    letterSpacing: tracking.wide,
  },
});
