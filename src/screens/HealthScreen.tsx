import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors, fonts, fontSize, spacing, tracking } from '../theme/theme';
import ScreenHeader from '../components/ScreenHeader';
import WorkoutView from '../components/health/WorkoutView';
import NutritionView from '../components/health/NutritionView';

type Tab = 'workout' | 'nutrition';

export default function HealthScreen() {
  const [tab, setTab] = useState<Tab>('workout');

  function switchTab(t: Tab) {
    if (t === tab) return;
    Haptics.selectionAsync();
    setTab(t);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScreenHeader
        title="Health"
        right={
          <View style={styles.toggle}>
            <Pressable onPress={() => switchTab('workout')}>
              <Text style={[styles.toggleLabel, tab === 'workout' && styles.toggleActive]}>
                WORKOUT
              </Text>
            </Pressable>
            <Pressable onPress={() => switchTab('nutrition')}>
              <Text style={[styles.toggleLabel, tab === 'nutrition' && styles.toggleActive]}>
                NUTRITION
              </Text>
            </Pressable>
          </View>
        }
      />
      {tab === 'workout' ? <WorkoutView /> : <NutritionView />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  toggle: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  toggleLabel: {
    fontFamily: fonts.medium,
    fontSize: fontSize.micro,
    color: colors.grayMid,
    letterSpacing: tracking.wide,
  },
  toggleActive: {
    color: colors.white,
  },
});
