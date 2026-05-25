import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, fonts, fontSize, spacing, tracking } from '../theme/theme';
import type { Quest } from '../data/quests';

const HOLD_DURATION_MS = 1200;

interface Props {
  quest: Quest | null;
  onAbandon?: () => void;
}

export default function QuestDetail({ quest, onAbandon }: Props) {
  if (!quest) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Select a Quest</Text>
      </View>
    );
  }

  const tasksDone = quest.tasks.filter((t) => t.done).length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerBlock}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{quest.title}</Text>
          <Text
            style={[
              styles.status,
              quest.status === 'active' && styles.statusActive,
            ]}
          >
            {quest.status[0].toUpperCase() + quest.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {quest.image ? (
        <Image
          source={quest.image}
          style={styles.headerImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>Image</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Tasks — {tasksDone}/{quest.tasks.length}
        </Text>
        <View style={styles.taskList}>
          {quest.tasks.map((task, i) => (
            <View key={i} style={styles.taskRow}>
              <View
                style={[
                  styles.checkbox,
                  task.done && styles.checkboxDone,
                ]}
              >
                {task.done && <View style={styles.checkboxInner} />}
              </View>
              <Text
                style={[
                  styles.taskLabel,
                  task.done && styles.taskLabelDone,
                ]}
              >
                {task.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {quest.details ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <Text style={styles.body}>{quest.details}</Text>
        </View>
      ) : null}

      {quest.status === 'active' && onAbandon ? (
        <HoldToAbandon onComplete={onAbandon} />
      ) : null}
    </ScrollView>
  );
}

function HoldToAbandon({ onComplete }: { onComplete: () => void }) {
  const fillAnim = useRef(new Animated.Value(0)).current;
  const fireTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cancel any pending fire on unmount
  useEffect(() => {
    return () => {
      if (fireTimer.current) clearTimeout(fireTimer.current);
    };
  }, []);

  const startHold = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.timing(fillAnim, {
      toValue: 1,
      duration: HOLD_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    fireTimer.current = setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      onComplete();
    }, HOLD_DURATION_MS);
  };

  const cancelHold = () => {
    if (fireTimer.current) {
      clearTimeout(fireTimer.current);
      fireTimer.current = null;
    }
    Animated.timing(fillAnim, {
      toValue: 0,
      duration: 180,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  };

  const widthPct = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Pressable
      onPressIn={startHold}
      onPressOut={cancelHold}
      style={styles.abandonButton}
    >
      <Animated.View
        pointerEvents="none"
        style={[styles.abandonFill, { width: widthPct }]}
      />
      <Text style={styles.abandonText}>Hold to Abandon</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl * 2,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
  },
  emptyText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.caption,
    color: colors.grayMid,
    letterSpacing: tracking.wide,
  },
  headerBlock: {
    paddingBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  title: {
    flex: 1,
    fontFamily: fonts.displayLight,
    fontSize: fontSize.heading,
    color: colors.white,
    lineHeight: fontSize.heading * 1.2,
    letterSpacing: tracking.wide,
  },
  status: {
    fontFamily: fonts.medium,
    fontSize: fontSize.micro,
    color: colors.grayLight,
    letterSpacing: tracking.wide,
  },
  statusActive: {
    color: colors.white,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.grayBorder,
    marginVertical: spacing.lg,
  },
  headerImage: {
    width: '100%',
    height: 200,
    borderRadius: 4,
    marginBottom: spacing.xl,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: colors.grayDim,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.grayBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  imagePlaceholderText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.micro,
    color: colors.grayMid,
    letterSpacing: tracking.wide,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontFamily: fonts.medium,
    fontSize: fontSize.micro,
    color: colors.grayLight,
    letterSpacing: tracking.wide,
    marginBottom: spacing.md,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.grayLight,
    lineHeight: fontSize.body * 1.65,
  },
  taskList: {
    gap: spacing.md,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: colors.grayMid,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    borderColor: colors.white,
  },
  checkboxInner: {
    width: 8,
    height: 8,
    backgroundColor: colors.white,
  },
  taskLabel: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.white,
    lineHeight: fontSize.body * 1.5,
  },
  taskLabelDone: {
    color: colors.grayMid,
    textDecorationLine: 'line-through',
  },
  abandonButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.grayBorder,
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  abandonFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.white,
  },
  abandonText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.caption,
    color: colors.grayMid,
    letterSpacing: tracking.wide,
  },
});
