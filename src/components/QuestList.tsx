import { useMemo } from 'react';
import {
  SectionList,
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, fonts, fontSize, spacing, tracking } from '../theme/theme';
import { quests as allQuests, type Quest } from '../data/quests';
import StatusIndicator from './StatusIndicator';

interface Props {
  selectedId?: number | null;
  onSelect: (quest: Quest) => void;
}

interface Section {
  title: string;
  data: Quest[];
}

export default function QuestList({ selectedId, onSelect }: Props) {
  const sections = useMemo<Section[]>(() => {
    const active = allQuests.filter((q) => q.status === 'active');
    const completed = allQuests.filter((q) => q.status === 'completed');
    const failed = allQuests.filter((q) => q.status === 'failed');
    return [
      { title: 'Active', data: active },
      { title: 'Completed', data: completed },
      { title: 'Failed', data: failed },
    ].filter((s) => s.data.length > 0);
  }, []);

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => String(item.id)}
      stickySectionHeadersEnabled={false}
      contentContainerStyle={styles.content}
      renderSectionHeader={({ section }) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{section.title.toUpperCase()}</Text>
          <Text style={styles.sectionCount}>{section.data.length}</Text>
        </View>
      )}
      ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      SectionSeparatorComponent={({ trailingItem, leadingSection }) =>
        trailingItem || !leadingSection ? null : (
          <View style={styles.sectionDivider} />
        )
      }
      renderItem={({ item }) => {
        const isSelected = item.id === selectedId;
        const isDimmed = item.status !== 'active';
        return (
          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              onSelect(item);
            }}
            style={({ pressed }) => [
              styles.row,
              pressed && styles.rowPressed,
              isSelected && styles.rowSelected,
            ]}
          >
            <StatusIndicator status={item.status} />
            <Text
              style={[
                styles.rowTitle,
                isDimmed && styles.rowTitleDim,
                isSelected && styles.rowTitleSelected,
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text style={styles.rowType}>{item.type.toUpperCase()}</Text>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  sectionTitle: {
    fontFamily: fonts.medium,
    fontSize: fontSize.micro,
    color: colors.grayLight,
    letterSpacing: tracking.wide,
  },
  sectionCount: {
    fontFamily: fonts.regular,
    fontSize: fontSize.micro,
    color: colors.grayMid,
  },
  sectionDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.grayBorder,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  itemSeparator: {
    height: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
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
    fontSize: fontSize.title,
    color: colors.white,
  },
  rowTitleDim: {
    color: colors.grayMid,
  },
  rowTitleSelected: {
    fontFamily: fonts.medium,
  },
  rowType: {
    fontFamily: fonts.regular,
    fontSize: fontSize.micro,
    color: colors.grayMid,
    letterSpacing: tracking.loose,
  },
});
