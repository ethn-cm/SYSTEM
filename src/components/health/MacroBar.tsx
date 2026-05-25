import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, fontSize, spacing, tracking } from '../../theme/theme';

interface Props {
  label: string;
  current: number;
  goal: number;
  unit?: string;
}

export default function MacroBar({ label, current, goal, unit = '' }: Props) {
  const pct = goal > 0 ? Math.min(current / goal, 1) : 0;
  const over = current > goal;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, over && styles.valueOver]}>
          {current}{unit} <Text style={styles.goal}>/ {goal}{unit}</Text>
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, over && styles.fillOver, { width: `${pct * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: fontSize.micro,
    color: colors.grayLight,
    letterSpacing: tracking.wide,
  },
  value: {
    fontFamily: fonts.medium,
    fontSize: fontSize.micro,
    color: colors.white,
    letterSpacing: tracking.loose,
  },
  valueOver: {
    color: '#FF4602',
  },
  goal: {
    color: colors.grayMid,
  },
  track: {
    height: 3,
    backgroundColor: colors.grayBorder,
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  fill: {
    height: 3,
    backgroundColor: colors.white,
    borderRadius: 1.5,
  },
  fillOver: {
    backgroundColor: '#FF4602',
  },
});
