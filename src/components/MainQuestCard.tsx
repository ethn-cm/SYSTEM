import { Image, Pressable, Text, View, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, fonts, fontSize, spacing, tracking } from '../theme/theme';
import type { Quest } from '../data/quests';

interface Props {
  quest: Quest;
  selected?: boolean;
  onPress: (quest: Quest) => void;
}

export default function MainQuestCard({ quest, selected, onPress }: Props) {
  const doneCount = quest.tasks.filter((t) => t.done).length;

  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        onPress(quest);
      }}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
        selected && styles.selected,
      ]}
    >
      <View style={styles.imageWrap}>
        {quest.image ? (
          <Image source={quest.image} style={styles.image} resizeMode="cover" />
        ) : (
          <Text style={styles.placeholder}>IMAGE</Text>
        )}
      </View>
      <View style={styles.meta}>
        <Text style={styles.title} numberOfLines={2}>
          {quest.title}
        </Text>
        <Text style={styles.progress}>
          {doneCount}/{quest.tasks.length}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.black,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.grayBorder,
    marginBottom: spacing.md,
  },
  pressed: {
    backgroundColor: colors.grayDim,
  },
  selected: {
    borderColor: colors.white,
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.grayDim,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    fontFamily: fonts.medium,
    fontSize: fontSize.micro,
    color: colors.grayMid,
    letterSpacing: tracking.wide,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.grayBorder,
  },
  title: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: fontSize.title,
    color: colors.white,
    letterSpacing: tracking.normal,
  },
  progress: {
    fontFamily: fonts.regular,
    fontSize: fontSize.micro,
    color: colors.grayMid,
    letterSpacing: tracking.loose,
  },
});
