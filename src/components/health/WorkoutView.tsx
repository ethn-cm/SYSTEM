import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, fonts, fontSize, spacing, tracking } from '../../theme/theme';
import type { WorkoutDay, WorkoutSession, ExerciseLog } from '../../data/workouts';
import { loadProgram, loadWeek, loadWorkoutLog, saveWorkoutLog, saveWeek, todayKey } from '../../data/storage';
import ExerciseRow from './ExerciseRow';

export default function WorkoutView() {
  const [program, setProgram] = useState<WorkoutDay[]>([]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [week, setWeek] = useState(1);
  const [session, setSession] = useState<WorkoutSession | null>(null);

  const date = todayKey();
  const day = program[selectedDay];

  useEffect(() => {
    (async () => {
      const [p, w] = await Promise.all([loadProgram(), loadWeek()]);
      setProgram(p);
      setWeek(w);
    })();
  }, []);

  useEffect(() => {
    if (!day) return;
    (async () => {
      const log = await loadWorkoutLog(date);
      if (log && log.dayId === day.id) {
        setSession(log);
      } else {
        setSession({ date, dayId: day.id, week, exercises: {} });
      }
    })();
  }, [day, date, week]);

  const handleLogChange = useCallback(
    (exerciseId: string, log: ExerciseLog) => {
      setSession((prev) => {
        if (!prev) return prev;
        const next = { ...prev, exercises: { ...prev.exercises, [exerciseId]: log } };
        saveWorkoutLog(next);
        return next;
      });
    },
    [],
  );

  function selectDay(index: number) {
    Haptics.selectionAsync();
    setSelectedDay(index);
  }

  async function adjustWeek(delta: number) {
    Haptics.selectionAsync();
    const next = Math.max(1, week + delta);
    setWeek(next);
    await saveWeek(next);
  }

  if (!day) return null;

  const allExercises = day.sections.flatMap((s) => s.exercises);
  const hasExercises = allExercises.length > 0;

  return (
    <View style={styles.container}>
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

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {hasExercises ? (
          day.sections.map((section) => {
            if (section.exercises.length === 0) return null;
            return (
              <View key={section.title}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{section.title.toUpperCase()}</Text>
                </View>
                {section.exercises.map((ex) => (
                  <ExerciseRow
                    key={ex.id}
                    exercise={ex}
                    log={session?.exercises[ex.id]}
                    onLogChange={(log) => handleLogChange(ex.id, log)}
                  />
                ))}
              </View>
            );
          })
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>NO EXERCISES</Text>
            <Text style={styles.emptyHint}>Add exercises to Day {day.label}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.grayBorder,
  },
  dayRow: {
    flexDirection: 'row',
    gap: 2,
  },
  dayTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  dayTabActive: {
    borderBottomWidth: 1,
    borderBottomColor: colors.white,
  },
  dayLabel: {
    fontFamily: fonts.medium,
    fontSize: fontSize.caption,
    color: colors.grayMid,
    letterSpacing: tracking.wide,
  },
  dayLabelActive: {
    color: colors.white,
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
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
  scroll: {
    paddingBottom: spacing.xxl * 2,
  },
  sectionHeader: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    backgroundColor: colors.grayDim,
  },
  sectionTitle: {
    fontFamily: fonts.medium,
    fontSize: fontSize.micro,
    color: colors.grayMid,
    letterSpacing: tracking.wide,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 120,
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
});
