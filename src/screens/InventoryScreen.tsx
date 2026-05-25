import { useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, fontSize, spacing, tracking } from '../theme/theme';
import ScreenHeader from '../components/ScreenHeader';
import SegmentedToggle from '../components/SegmentedToggle';
import WardrobeCard from '../components/WardrobeCard';
import {
  wardrobeItems as seedItems,
  type WardrobeItem,
} from '../data/wardrobe';

type Mode = 'inventory' | 'shop';

const MODE_OPTIONS = [
  { label: 'Inventory', value: 'inventory' as const },
  { label: 'Shop', value: 'shop' as const },
];

export default function InventoryScreen() {
  const [items, setItems] = useState<WardrobeItem[]>(seedItems);
  const [mode, setMode] = useState<Mode>('inventory');

  const visible = useMemo(
    () =>
      items.filter((item) =>
        mode === 'inventory'
          ? item.status === 'owned'
          : item.status === 'wishlist',
      ),
    [items, mode],
  );

  const acquire = (item: WardrobeItem) => {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: 'owned' } : i)),
    );
    setMode('inventory');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScreenHeader title="Inventory" />
      <SegmentedToggle options={MODE_OPTIONS} value={mode} onChange={setMode} />
      <View style={styles.countRow}>
        <Text style={styles.countLabel}>
          {mode === 'inventory' ? 'OWNED' : 'WISHLIST'}
        </Text>
        <Text style={styles.countValue}>{visible.length}</Text>
      </View>
      <FlatList
        data={visible}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <WardrobeCard item={item} onAcquire={acquire} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>NOTHING HERE YET</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  countLabel: {
    fontFamily: fonts.medium,
    fontSize: fontSize.micro,
    color: colors.grayLight,
    letterSpacing: tracking.wide,
  },
  countValue: {
    fontFamily: fonts.regular,
    fontSize: fontSize.micro,
    color: colors.grayMid,
  },
  grid: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  row: {
    gap: spacing.md,
  },
  empty: {
    paddingVertical: spacing.xxl * 2,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.caption,
    color: colors.grayMid,
    letterSpacing: tracking.wide,
  },
});
