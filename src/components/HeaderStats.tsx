import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, fontSize, spacing, tracking } from '../theme/theme';
import type { Quest } from '../data/quests';

interface Props {
  quests: Quest[];
}

export default function HeaderStats({ quests }: Props) {
  const active = quests.filter((q) => q.status === 'active').length;
  const done = quests.filter((q) => q.status === 'completed').length;
  const total = quests.length;
  return (
    <View style={styles.row}>
      <Stat label="Active" value={active} />
      <Stat label="Done" value={done} />
      <Stat label="Total" value={total} />
    </View>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: fontSize.micro,
    color: colors.grayLight,
    letterSpacing: tracking.loose,
  },
  value: {
    fontFamily: fonts.medium,
    fontSize: fontSize.micro,
    color: colors.white,
    letterSpacing: tracking.loose,
  },
});
