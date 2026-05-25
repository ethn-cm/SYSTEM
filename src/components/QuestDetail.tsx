import {
  ScrollView,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { colors, fonts, fontSize, spacing, tracking } from '../theme/theme';
import type { Quest } from '../data/quests';

interface Props {
  quest: Quest | null;
}

export default function QuestDetail({ quest }: Props) {
  if (!quest) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>SELECT A QUEST</Text>
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
        <Text
          style={[
            styles.status,
            quest.status === 'active' && styles.statusActive,
          ]}
        >
          {quest.status.toUpperCase()}
        </Text>
        <Text style={styles.title}>{quest.title}</Text>

        <View style={styles.metaBlock}>
          <MetaRow label="TYPE" value={quest.type} />
          <MetaRow label="LOCATION" value={quest.location} />
          <MetaRow label="OBJECTIVE" value={quest.objective} />
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DETAILS</Text>
        <Text style={styles.body}>{quest.details}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          TASKS — {tasksDone}/{quest.tasks.length}
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
    </ScrollView>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
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
    paddingBottom: spacing.lg,
  },
  status: {
    fontFamily: fonts.medium,
    fontSize: fontSize.micro,
    color: colors.grayLight,
    letterSpacing: tracking.wide,
    marginBottom: spacing.sm,
  },
  statusActive: {
    color: colors.white,
  },
  title: {
    fontFamily: fonts.displayLight,
    fontSize: fontSize.heading,
    color: colors.white,
    lineHeight: fontSize.heading * 1.2,
    letterSpacing: tracking.wide,
    marginBottom: spacing.lg,
  },
  metaBlock: {
    gap: 6,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metaLabel: {
    fontFamily: fonts.regular,
    fontSize: fontSize.micro,
    color: colors.grayMid,
    letterSpacing: tracking.loose,
    width: 80,
    paddingTop: 1,
  },
  metaValue: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.white,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.grayBorder,
    marginVertical: spacing.lg,
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
});
