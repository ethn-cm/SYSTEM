import { useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, fonts, fontSize, spacing, tracking } from '../theme/theme';
import type { Quest } from '../data/quests';
import StatusIndicator from './StatusIndicator';
import MainQuestCard from './MainQuestCard';

interface Props {
  quests: Quest[];
  selectedId?: number | null;
  onSelect: (quest: Quest) => void;
}

export default function QuestList({ quests, selectedId, onSelect }: Props) {
  const { mainQuests, sideQuests } = useMemo(() => {
    const main = quests.filter((q) => q.type === 'Main Quest');
    const side = quests.filter((q) => q.type !== 'Main Quest');
    return { mainQuests: main, sideQuests: side };
  }, [quests]);

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* MAIN QUESTS — square tiles in a row */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Main Quests</Text>
          <Text style={styles.sectionCount}>{mainQuests.length}</Text>
        </View>
        <View style={styles.mainQuestRow}>
          {mainQuests.map((q) => (
            <MainQuestCard
              key={q.id}
              quest={q}
              selected={q.id === selectedId}
              onPress={onSelect}
            />
          ))}
        </View>
      </View>

      {/* SIDE QUESTS — compact rows */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Side Quests</Text>
          <Text style={styles.sectionCount}>{sideQuests.length}</Text>
        </View>
        {sideQuests.map((q) => {
          const isSelected = q.id === selectedId;
          const isDimmed = q.status !== 'active';
          return (
            <Pressable
              key={q.id}
              onPress={() => {
                Haptics.selectionAsync();
                onSelect(q);
              }}
              style={({ pressed }) => [
                styles.row,
                pressed && styles.rowPressed,
                isSelected && styles.rowSelected,
              ]}
            >
              <StatusIndicator status={q.status} />
              <Text
                style={[
                  styles.rowTitle,
                  isDimmed && styles.rowTitleDim,
                  isSelected && styles.rowTitleSelected,
                ]}
                numberOfLines={1}
              >
                {q.title}
              </Text>
              <Text style={styles.rowType}>{q.type}</Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  section: {
    marginTop: spacing.lg,
  },
  mainQuestRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.sm,
  },
  sectionTitle: {
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.grayLight,
    letterSpacing: tracking.wide,
  },
  sectionCount: {
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.grayMid,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 14,
  },
  rowPressed: {
    backgroundColor: colors.grayDim,
  },
  rowSelected: {
    backgroundColor: colors.grayDim,
  },
  rowTitle: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.white,
  },
  rowTitleDim: {
    color: colors.grayMid,
  },
  rowTitleSelected: {
    fontFamily: fonts.regular,
  },
  rowType: {
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.grayMid,
    letterSpacing: tracking.loose,
  },
});
