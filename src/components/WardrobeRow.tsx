import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, fontSize, spacing, tracking } from '../theme/theme';
import type { WardrobeItem } from '../data/wardrobe';

interface Props {
  item: WardrobeItem;
}

export default function WardrobeRow({ item }: Props) {
  return (
    <View style={styles.row}>
      <View style={[styles.swatch, { backgroundColor: item.swatch }]} />
      <View style={styles.meta}>
        <Text style={styles.brand} numberOfLines={1}>
          {item.brand}
        </Text>
        <Text style={styles.category} numberOfLines={1}>
          {item.category}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.detail}>{item.color}</Text>
        <Text style={styles.detail}>{item.season}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.grayBorder,
  },
  swatch: {
    width: 36,
    height: 36,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.grayBorder,
    flexShrink: 0,
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  brand: {
    fontFamily: fonts.medium,
    fontSize: fontSize.micro,
    color: colors.grayLight,
    letterSpacing: tracking.loose,
  },
  category: {
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.white,
  },
  right: {
    alignItems: 'flex-end',
    gap: 2,
    flexShrink: 0,
  },
  detail: {
    fontFamily: fonts.regular,
    fontSize: fontSize.micro,
    color: colors.grayMid,
    letterSpacing: tracking.loose,
  },
});
