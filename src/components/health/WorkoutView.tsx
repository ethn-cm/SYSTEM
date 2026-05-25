import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  ScrollView,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, fonts, fontSize, spacing, tracking } from '../../theme/theme';
import type { WorkoutDay, Exercise } from '../../data/workouts';
import { loadProgram, saveProgram, loadWeek, saveWeek, todayKey } from '../../data/storage';

interface ExerciseCard {
  key: string;
  type: 'exercise';
  exercise: Exercise;
  sectionTitle: string;
  position: number;
  sectionIndex: number;
  exerciseIndex: number;
}

interface SummaryCard {
  key: string;
  type: 'summary';
}

type Card = ExerciseCard | SummaryCard;

export default function WorkoutView() {
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<Card>>(null);
  const [program, setProgram] = useState<WorkoutDay[]>([]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [week, setWeek] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  const day = program[selectedDay];

  useEffect(() => {
    (async () => {
      const [p, w] = await Promise.all([loadProgram(), loadWeek()]);
      setProgram(p);
      setWeek(w);
    })();
  }, []);

  const cards = useMemo<Card[]>(() => {
    if (!day) return [];
    const items: Card[] = [];
    day.sections.forEach((section, sIdx) => {
      section.exercises.forEach((ex, eIdx) => {
        items.push({
          key: ex.id,
          type: 'exercise',
          exercise: ex,
          sectionTitle: section.title,
          position: items.length + 1,
          sectionIndex: sIdx,
          exerciseIndex: eIdx,
        });
      });
    });
    items.push({ key: 'summary', type: 'summary' });
    return items;
  }, [day]);

  const totalExercises = cards.filter((c) => c.type === 'exercise').length;

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
    setTimeout(() => listRef.current?.scrollToIndex({ index: 0, animated: false }), 50);
  }

  async function adjustWeek(delta: number) {
    Haptics.selectionAsync();
    const n = Math.max(1, week + delta);
    setWeek(n);
    await saveWeek(n);
  }

  const onScroll = useCallback(
    (e: any) => {
      const idx = Math.round(e.nativeEvent.contentOffset.x / width);
      if (idx !== currentIndex) {
        setCurrentIndex(idx);
        Haptics.selectionAsync();
      }
    },
    [width, currentIndex],
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({ length: width, offset: width * index, index }),
    [width],
  );

  if (!day) return null;

  const allExercises = day.sections.flatMap((s) => s.exercises);
  const hasExercises = allExercises.length > 0;

  return (
    <View style={styles.flex}>
      {/* Day selector + week */}
      <View style={styles.controls}>
        <View style={styles.dayRow}>
          {program.map((d, i) => (
            <Pressable
              key={d.id}
              onPress={() => selectDay(i)}
              style={[styles.dayTab, selectedDay === i && styles.dayTabActive]}
            >
              <Text style={[styles.dayLabel, selectedDay === i && styles.dayLabelActive]}>
                {d.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.weekRow}>
          <Pressable onPress={() => adjustWeek(-1)} hitSlop={12}>
            <Text style={styles.weekArrow}>-</Text>
          </Pressable>
          <Text style={styles.weekText}>WK {week}</Text>
          <Pressable onPress={() => adjustWeek(1)} hitSlop={12}>
            <Text style={styles.weekArrow}>+</Text>
          </Pressable>
        </View>
      </View>

      {hasExercises ? (
        <FlatList
          ref={listRef}
          data={cards}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(c) => c.key}
          getItemLayout={getItemLayout}
          onScroll={onScroll}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) =>
            item.type === 'exercise' ? (
              <ExerciseCardView
                card={item}
                total={totalExercises}
                width={width}
                onUpdate={(field, value) =>
                  updateCell(item.sectionIndex, item.exerciseIndex, field, value)
                }
              />
            ) : (
              <SummaryView day={day} week={week} width={width} />
            )
          }
        />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>NO EXERCISES</Text>
          <Text style={styles.emptyHint}>Add exercises to Day {day.label}</Text>
        </View>
      )}
    </View>
  );
}

function ExerciseCardView({
  card,
  total,
  width,
  onUpdate,
}: {
  card: ExerciseCard;
  total: number;
  width: number;
  onUpdate: (field: keyof Exercise, value: string) => void;
}) {
  const { exercise, sectionTitle, position } = card;

  return (
    <ScrollView
      style={{ width }}
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

      {/* Header: section + position */}
      <View style={styles.cardHeader}>
        <Text style={styles.sectionLabel}>{sectionTitle.toUpperCase()}</Text>
        <Text style={styles.positionText}>
          {position} / {total}
        </Text>
      </View>

      {/* Exercise name */}
      <Text style={styles.exerciseName}>{exercise.name.toUpperCase()}</Text>

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
          label="SETS"
          value={exercise.sets ? String(exercise.sets) : ''}
          onChange={(v) => onUpdate('sets', v)}
          numeric
        />
        <DataCell
          label="REPS"
          value={exercise.reps}
          onChange={(v) => onUpdate('reps', v)}
        />
        <DataCell
          label="LOAD"
          value={exercise.load}
          onChange={(v) => onUpdate('load', v)}
        />
        <DataCell
          label="REST"
          value={exercise.rest}
          onChange={(v) => onUpdate('rest', v)}
        />
      </View>
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
  width,
}: {
  day: WorkoutDay;
  week: number;
  width: number;
}) {
  const allExercises = day.sections.flatMap((s) => s.exercises);
  const totalSets = allExercises.reduce((sum, ex) => sum + ex.sets, 0);
  const today = new Date();
  const dateStr = today
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    .toUpperCase();

  return (
    <ScrollView
      style={{ width }}
      contentContainerStyle={styles.summaryContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.summaryTitle}>WORKOUT{'\n'}COMPLETE</Text>

      <View style={styles.summaryMeta}>
        <Text style={styles.summaryMetaText}>
          DAY {day.label} — WK {week}
        </Text>
        <Text style={styles.summaryDate}>{dateStr}</Text>
      </View>

      <View style={styles.summaryDivider} />

      {/* Stats */}
      <View style={styles.summaryStats}>
        <View style={styles.statBlock}>
          <Text style={styles.statValue}>{allExercises.length}</Text>
          <Text style={styles.statLabel}>EXERCISES</Text>
        </View>
        <View style={styles.statBlock}>
          <Text style={styles.statValue}>{totalSets}</Text>
          <Text style={styles.statLabel}>TOTAL SETS</Text>
        </View>
        <View style={styles.statBlock}>
          <Text style={styles.statValue}>{day.sections.length}</Text>
          <Text style={styles.statLabel}>SECTIONS</Text>
        </View>
      </View>

      <View style={styles.summaryDivider} />

      {/* Exercise breakdown */}
      {allExercises.map((ex) => (
        <View key={ex.id} style={styles.summaryRow}>
          <Text style={styles.summaryExName} numberOfLines={1}>
            {ex.name}
          </Text>
          <Text style={styles.summaryExDetail}>
            {ex.sets} x {ex.reps}
            {ex.load ? `  ${ex.load}` : ''}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },

  // Controls
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.grayBorder,
  },
  dayRow: { flexDirection: 'row', gap: 2 },
  dayTab: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  dayTabActive: { borderBottomWidth: 1, borderBottomColor: colors.white },
  dayLabel: {
    fontFamily: fonts.medium,
    fontSize: fontSize.caption,
    color: colors.grayMid,
    letterSpacing: tracking.wide,
  },
  dayLabelActive: { color: colors.white },
  weekRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  weekArrow: {
    fontFamily: fonts.medium,
    fontSize: fontSize.title,
    color: colors.grayLight,
    paddingHorizontal: 4,
  },
  weekText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.micro,
    color: colors.grayLight,
    letterSpacing: tracking.wide,
  },

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
    paddingBottom: spacing.xxl * 2,
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
  summaryExName: {
    fontFamily: fonts.medium,
    fontSize: fontSize.body,
    color: colors.white,
    flex: 1,
  },
  summaryExDetail: {
    fontFamily: fonts.regular,
    fontSize: fontSize.caption,
    color: colors.grayLight,
    letterSpacing: tracking.loose,
  },
});
