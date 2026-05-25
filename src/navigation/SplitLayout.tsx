import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/theme';
import HeaderStats from '../components/HeaderStats';
import ScreenHeader from '../components/ScreenHeader';
import QuestList from '../components/QuestList';
import QuestDetail from '../components/QuestDetail';
import { quests, type Quest } from '../data/quests';

export default function SplitLayout() {
  const [selected, setSelected] = useState<Quest | null>(quests[0] ?? null);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScreenHeader title="Journal" right={<HeaderStats />} />
      <View style={styles.body}>
        <View style={styles.sidebar}>
          <QuestList selectedId={selected?.id ?? null} onSelect={setSelected} />
        </View>
        <View style={styles.main}>
          <QuestDetail quest={selected} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.black,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 320,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: colors.grayBorder,
  },
  main: {
    flex: 1,
  },
});
