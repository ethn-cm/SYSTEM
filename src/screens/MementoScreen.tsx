import { useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, fontSize, spacing, tracking } from '../theme/theme';

// Placeholder values — swap when user input is wired up
const BIRTH_DATE = new Date(1995, 0, 1); // Jan 1, 1995
const LIFE_EXPECTANCY_YEARS = 80;
const COLUMNS = 52; // one row = one year of weeks
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

export default function MementoScreen() {
  const { width } = useWindowDimensions();

  const { weeksLived, totalWeeks, weeksRemaining, percentLived } = useMemo(() => {
    const total = LIFE_EXPECTANCY_YEARS * COLUMNS;
    const lived = Math.max(
      0,
      Math.min(total, Math.floor((Date.now() - BIRTH_DATE.getTime()) / MS_PER_WEEK))
    );
    return {
      weeksLived: lived,
      totalWeeks: total,
      weeksRemaining: total - lived,
      percentLived: ((lived / total) * 100).toFixed(1),
    };
  }, []);

  // Compute square cell size for the current viewport
  const sideMargin = spacing.xl;
  const gap = 2;
  const containerWidth = width - sideMargin * 2;
  // On iPad-width viewports cap the grid so it doesn't get huge
  const maxGridWidth = Math.min(containerWidth, 560);
  const cellSize = (maxGridWidth - gap * (COLUMNS - 1)) / COLUMNS;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MEMENTO</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleRow}>
          <Text style={styles.title}>MEMENTO MORI</Text>
          <Text style={styles.lifespan} numberOfLines={1}>
            {LIFE_EXPECTANCY_YEARS} YR
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statsRow}>
          <Stat label="LIVED" value={formatNumber(weeksLived)} />
          <Stat label="REMAINING" value={formatNumber(weeksRemaining)} />
          <Stat label="ELAPSED" value={`${percentLived}%`} />
        </View>

        <View
          style={[
            styles.grid,
            { width: maxGridWidth, gap },
          ]}
        >
          {Array.from({ length: totalWeeks }, (_, i) => {
            const isLived = i < weeksLived;
            const isCurrent = i === weeksLived;
            return (
              <View
                key={i}
                style={{
                  width: cellSize,
                  height: cellSize,
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

        <Text style={styles.footnote}>
          EACH SQUARE = ONE WEEK · {COLUMNS} WEEKS PER ROW · {LIFE_EXPECTANCY_YEARS} ROWS
        </Text>

        <View style={styles.divider} />

        <Text style={styles.body}>
          You will not live forever. Most of your weeks are already spent. The rest are not guaranteed. Plan accordingly.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
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
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl * 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  title: {
    fontFamily: fonts.displayLight,
    fontSize: fontSize.heading,
    color: colors.white,
    letterSpacing: tracking.wide,
  },
  lifespan: {
    fontFamily: fonts.medium,
    fontSize: fontSize.micro,
    color: colors.grayLight,
    letterSpacing: tracking.wide,
    flexShrink: 0,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.grayBorder,
    marginVertical: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginBottom: spacing.xl,
  },
  stat: {
    gap: 4,
  },
  statValue: {
    fontFamily: fonts.displayLight,
    fontSize: 20,
    color: colors.white,
    letterSpacing: tracking.normal,
  },
  statLabel: {
    fontFamily: fonts.regular,
    fontSize: fontSize.micro,
    color: colors.grayMid,
    letterSpacing: tracking.loose,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  footnote: {
    fontFamily: fonts.regular,
    fontSize: fontSize.micro,
    color: colors.grayMid,
    letterSpacing: tracking.loose,
    marginTop: spacing.sm,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.grayLight,
    lineHeight: fontSize.body * 1.65,
  },
});
