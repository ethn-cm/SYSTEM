import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { colors, fonts, fontSize, spacing, tracking } from '../../theme/theme';
import type { WeekEntry } from '../../data/storage';

function parseLoad(load: string): number | null {
  const match = load.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

interface Props {
  entries: WeekEntry[];
  currentWeek: number;
}

export default function ProgressLine({ entries, currentWeek }: Props) {
  const { width } = useWindowDimensions();

  const points = entries
    .map((e) => ({ week: e.week, value: parseLoad(e.load) }))
    .filter((p): p is { week: number; value: number } => p.value !== null);

  if (points.length < 2) return null;

  const chartWidth = width - spacing.xl * 2;
  const chartHeight = 56;
  const pad = { top: 12, bottom: 16, left: 0, right: 0 };
  const plotW = chartWidth - pad.left - pad.right;
  const plotH = chartHeight - pad.top - pad.bottom;

  const minWeek = points[0].week;
  const maxWeek = Math.max(points[points.length - 1].week, currentWeek);
  const weekRange = maxWeek - minWeek || 1;

  const values = points.map((p) => p.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const valRange = maxVal - minVal || 1;

  function toX(week: number) {
    return pad.left + ((week - minWeek) / weekRange) * plotW;
  }
  function toY(val: number) {
    return pad.top + (1 - (val - minVal) / valRange) * plotH;
  }

  const latest = points[points.length - 1];
  const prev = points.length >= 2 ? points[points.length - 2] : null;
  const delta = prev ? latest.value - prev.value : 0;

  return (
    <View style={[styles.container, { width: chartWidth, height: chartHeight }]}>
      {/* Lines */}
      {points.map((p, i) => {
        if (i === 0) return null;
        const p0 = points[i - 1];
        return (
          <Segment
            key={`l${i}`}
            x1={toX(p0.week)}
            y1={toY(p0.value)}
            x2={toX(p.week)}
            y2={toY(p.value)}
          />
        );
      })}
      {/* Dots */}
      {points.map((p, i) => {
        const isCurrent = p.week === currentWeek;
        const size = isCurrent ? 6 : 4;
        return (
          <View
            key={`d${i}`}
            style={{
              position: 'absolute',
              left: toX(p.week) - size / 2,
              top: toY(p.value) - size / 2,
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: isCurrent ? colors.white : colors.grayMid,
            }}
          />
        );
      })}
      {/* Latest value label */}
      <Text style={styles.valueLabel}>
        {latest.value}lb
        {delta !== 0 && (
          <Text style={delta > 0 ? styles.deltaUp : styles.deltaDown}>
            {' '}{delta > 0 ? '+' : ''}{delta}
          </Text>
        )}
      </Text>
      {/* Week range */}
      <Text style={styles.weekRange}>
        WK {minWeek}–{maxWeek}
      </Text>
    </View>
  );
}

function Segment({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);

  return (
    <View
      style={{
        position: 'absolute',
        left: x1,
        top: y1,
        width: length,
        height: 1,
        backgroundColor: colors.grayBorder,
        transform: [{ rotate: `${angle}rad` }],
        transformOrigin: 'left center',
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xl,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.grayBorder,
    paddingTop: spacing.sm,
  },
  valueLabel: {
    position: 'absolute',
    top: 0,
    right: 0,
    fontFamily: fonts.medium,
    fontSize: fontSize.micro,
    color: colors.grayLight,
    letterSpacing: tracking.loose,
  },
  deltaUp: {
    color: colors.white,
  },
  deltaDown: {
    color: '#FF4602',
  },
  weekRange: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    fontFamily: fonts.regular,
    fontSize: fontSize.micro,
    color: colors.grayMid,
    letterSpacing: tracking.loose,
  },
});
