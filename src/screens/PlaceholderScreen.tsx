import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, fontSize, spacing, tracking } from '../theme/theme';

interface Props {
  name: string;
}

export default function PlaceholderScreen({ name }: Props) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{name.toUpperCase()}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.placeholder}>COMING SOON</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.grayBorder,
  },
  headerTitle: {
    fontFamily: fonts.medium,
    fontSize: fontSize.caption,
    color: colors.white,
    letterSpacing: tracking.wide,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    fontFamily: fonts.medium,
    fontSize: fontSize.caption,
    color: colors.grayMid,
    letterSpacing: tracking.wide,
  },
});
