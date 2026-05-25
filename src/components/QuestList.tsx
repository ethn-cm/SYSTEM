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
import { quests as allQuests, type Quest } from '../data/quests';
import StatusIndicator from './StatusIndicator';
import MainQuestCard from './MainQuestCard';

interface Props {
  selectedId?: number | null;
  onSelect: (quest: Quest) => void;
}

export default function QuestList({ selectedId, onSelect }: Props) {
  const { mainQuests, sideQuests } = useMemo(() => {
    const main = allQuests.filter((q) => q.type === 'Main Quest');
    const side = allQuests.filter((q) => q.type !== 'Main Quest');
    return { mainQuests: main, sideQuests: side };
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* MAIN QUESTS — large cards with image */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>MAIN QUESTS</Text>
          <Text style={styles.sectionCount}>{mainQuests.length}</Text>
        </View>
        {mainQuests.map((q) => (
          <MainQuestCard
            key={q.id}
            quest={q}
            selected={q.id === selectedId}
            onPress={onSelect}
          />
        ))}
      </View>

      {/* SIDE QUESTS — compact rows */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>SIDE QUESTS</Text>
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
              <Text style={styles.rowType}>{q.type.toUpperCase()}</Text>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.sm,
  },
  sectionTitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.grayLight,
    letterSpacing: tracking.wide,
  },
  sectionCount: {
    fontFamily: fonts.regular,
    fontSize: 14,
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
    fontSize: 14,
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
    fontSize: 14,
    color: colors.grayMid,
    letterSpacing: tracking.loose,
  },
});
