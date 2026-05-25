import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, fonts, fontSize, spacing, tracking } from '../../theme/theme';
import type { Exercise, ExerciseLog, SetLog } from '../../data/workouts';

interface Props {
  exercise: Exercise;
  log?: ExerciseLog;
  onLogChange: (log: ExerciseLog) => void;
}

export default function ExerciseRow({ exercise, log, onLogChange }: Props) {
  const [expanded, setExpanded] = useState(false);
  const completed = log?.completed ?? false;

  const sets: SetLog[] = log?.sets ??
    Array.from({ length: exercise.sets }, () => ({ weight: '', reps: '' }));

  function toggleComplete() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onLogChange({ completed: !completed, sets });
  }

  function updateSet(index: number, field: 'weight' | 'reps', value: string) {
    const next = sets.map((s, i) => i === index ? { ...s, [field]: value } : s);
    onLogChange({ completed, sets: next });
  }

  function toggleExpand() {
    Haptics.selectionAsync();
    setExpanded(!expanded);
  }

  return (
    <View style={[styles.container, completed && styles.containerDone]}>
      <Pressable onPress={toggleExpand} style={styles.mainRow}>
        <Pressable onPress={toggleComplete} hitSlop={8} style={styles.checkbox}>
          <View style={[styles.check, completed && styles.checkActive]}>
            {completed && <View style={styles.checkInner} />}
          </View>
        </Pressable>

        <View style={styles.info}>
          <Text style={[styles.name, completed && styles.nameDone]} numberOfLines={1}>
            {exercise.name}
          </Text>
          {exercise.notes ? (
            <Text style={styles.notes} numberOfLines={1}>{exercise.notes}</Text>
          ) : null}
        </View>

        <View style={styles.meta}>
          <Text style={styles.metaText}>
            {exercise.sets} x {exercise.reps}
          </Text>
          {exercise.load ? (
            <Text style={styles.metaSecondary}>{exercise.load}</Text>
          ) : null}
        </View>
      </Pressable>

      {expanded && (
        <View style={styles.setList}>
          {sets.map((s, i) => (
            <View key={i} style={styles.setRow}>
              <Text style={styles.setLabel}>SET {i + 1}</Text>
              <View style={styles.setInputs}>
                <TextInput
                  style={styles.input}
                  value={s.weight}
                  onChangeText={(v) => updateSet(i, 'weight', v)}
                  placeholder={exercise.load || 'lb'}
                  placeholderTextColor={colors.grayMid}
                  keyboardType="numeric"
                  returnKeyType="next"
                />
                <Text style={styles.inputSep}>x</Text>
                <TextInput
                  style={styles.input}
                  value={s.reps}
                  onChangeText={(v) => updateSet(i, 'reps', v)}
                  placeholder={exercise.reps}
                  placeholderTextColor={colors.grayMid}
                  keyboardType="numeric"
                  returnKeyType="done"
                />
              </View>
            </View>
          ))}
          {exercise.rest ? (
            <Text style={styles.restText}>REST: {exercise.rest}s</Text>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.grayBorder,
  },
  containerDone: {
    opacity: 0.5,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  checkbox: {
    padding: 2,
  },
  check: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: colors.grayMid,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkActive: {
    borderColor: colors.white,
  },
  checkInner: {
    width: 8,
    height: 8,
    backgroundColor: colors.white,
    borderRadius: 1,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontFamily: fonts.medium,
    fontSize: fontSize.body,
    color: colors.white,
  },
  nameDone: {
    color: colors.grayMid,
  },
  notes: {
    fontFamily: fonts.regular,
    fontSize: fontSize.micro,
    color: colors.grayMid,
    letterSpacing: tracking.normal,
  },
  meta: {
    alignItems: 'flex-end',
    gap: 2,
  },
  metaText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.caption,
    color: colors.grayLight,
    letterSpacing: tracking.loose,
  },
  metaSecondary: {
    fontFamily: fonts.regular,
    fontSize: fontSize.micro,
    color: colors.grayMid,
  },
  setList: {
    paddingHorizontal: spacing.xl,
    paddingLeft: spacing.xl + 16 + spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  setLabel: {
    fontFamily: fonts.medium,
    fontSize: fontSize.micro,
    color: colors.grayMid,
    letterSpacing: tracking.wide,
    width: 40,
  },
  setInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  input: {
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayBorder,
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 56,
    textAlign: 'center',
  },
  inputSep: {
    fontFamily: fonts.regular,
    fontSize: fontSize.caption,
    color: colors.grayMid,
  },
  restText: {
    fontFamily: fonts.regular,
    fontSize: fontSize.micro,
    color: colors.grayMid,
    letterSpacing: tracking.wide,
    marginTop: 4,
  },
});
