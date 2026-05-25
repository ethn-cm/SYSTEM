import type { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, fontSize, spacing, tracking } from '../theme/theme';

interface Props {
  title: string;
  right?: ReactNode;
}

export default function ScreenHeader({ title, right }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title.toUpperCase()}</Text>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.grayBorder,
    backgroundColor: colors.black,
  },
  title: {
    fontFamily: fonts.medium,
    fontSize: fontSize.caption,
    color: colors.white,
    letterSpacing: tracking.wide,
  },
  right: {
    flexShrink: 0,
  },
});
