import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/theme';
import { loadQuests } from '../data/storage';
import type { Quest } from '../data/quests';
import QuestList from '../components/QuestList';
import QuestDetail from '../components/QuestDetail';

export default function SplitLayout() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [selected, setSelected] = useState<Quest | null>(null);

  const load = useCallback(async () => {
    const all = await loadQuests();
    setQuests(all);
    setSelected((prev) => prev ?? all[0] ?? null);
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.body}>
        <View style={styles.sidebar}>
          <QuestList quests={quests} selectedId={selected?.id ?? null} onSelect={setSelected} />
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
