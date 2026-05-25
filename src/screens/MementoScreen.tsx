import { useMemo } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme/theme';
import ScreenHeader from '../components/ScreenHeader';

// Placeholder values — swap when user input is wired up
const BIRTH_DATE = new Date(1995, 0, 1);
const LIFE_EXPECTANCY_YEARS = 80;
const COLUMNS = 52;
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

export default function MementoScreen() {
  const { width } = useWindowDimensions();

  const { weeksLived, totalWeeks } = useMemo(() => {
    const total = LIFE_EXPECTANCY_YEARS * COLUMNS;
    const lived = Math.max(
      0,
      Math.min(total, Math.floor((Date.now() - BIRTH_DATE.getTime()) / MS_PER_WEEK))
    );
    return { weeksLived: lived, totalWeeks: total };
  }, []);

  // Integer cell size + exact grid width keeps all circles uniform
  // and ensures all 52 cells fit per row precisely.
  const sideMargin = spacing.xl;
  const gap = 2;
  const containerWidth = width - sideMargin * 2;
  const maxGridWidth = Math.min(containerWidth, 560);
  const cellSize = Math.floor((maxGridWidth - gap * (COLUMNS - 1)) / COLUMNS);
  const gridWidth = cellSize * COLUMNS + gap * (COLUMNS - 1);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScreenHeader title="Memento" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.grid, { width: gridWidth, gap }]}>
          {Array.from({ length: totalWeeks }, (_, i) => {
            const isLived = i < weeksLived;
            const isCurrent = i === weeksLived;
            return (
              <View
                key={i}
                style={{
                  width: cellSize,
                  height: cellSize,
                  borderRadius: cellSize / 2,
                  backgroundColor: isLived
                    ? colors.white
                    : isCurrent
                    ? colors.grayLight
                    : colors.grayBorder,
                }}
              />
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
