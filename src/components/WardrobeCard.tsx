import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, fonts, fontSize, spacing, tracking } from '../theme/theme';
import type { WardrobeItem } from '../data/wardrobe';

interface Props {
  item: WardrobeItem;
  onAcquire?: (item: WardrobeItem) => void;
}

export default function WardrobeCard({ item, onAcquire }: Props) {
  const isWishlist = item.status === 'wishlist';

  return (
    <View style={styles.card}>
      <View style={[styles.swatch, { backgroundColor: item.swatch }]} />
      <View style={styles.meta}>
        <Text style={styles.brand} numberOfLines={1}>
          {item.brand}
        </Text>
        <Text style={styles.category} numberOfLines={1}>
          {item.category}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.detail} numberOfLines={1}>
            {item.color.toUpperCase()}
          </Text>
          <Text style={styles.detail}>{item.season.toUpperCase()}</Text>
        </View>
        {isWishlist && onAcquire ? (
          <Pressable
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              onAcquire(item);
            }}
            style={({ pressed }) => [
              styles.action,
              pressed && styles.actionPressed,
            ]}
          >
            <Text style={styles.actionLabel}>ACQUIRE</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.grayBorder,
    backgroundColor: colors.black,
  },
  swatch: {
    width: '100%',
    aspectRatio: 1,
  },
  meta: {
    padding: spacing.md,
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
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  detail: {
    fontFamily: fonts.regular,
    fontSize: fontSize.micro,
    color: colors.grayMid,
    letterSpacing: tracking.loose,
  },
  action: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.grayBorder,
    alignItems: 'center',
  },
  actionPressed: {
    backgroundColor: colors.grayDim,
  },
  actionLabel: {
    fontFamily: fonts.medium,
    fontSize: fontSize.micro,
    color: colors.white,
    letterSpacing: tracking.wide,
  },
});
