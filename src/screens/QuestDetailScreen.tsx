import { useState, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/theme';
import { loadQuests, saveQuests } from '../data/storage';
import type { Quest } from '../data/quests';
import QuestDetail from '../components/QuestDetail';
import type { RootStackParamList } from '../navigation/types';

export default function QuestDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'QuestDetail'>>();
  const navigation = useNavigation();
  const [quest, setQuest] = useState<Quest | null>(null);

  useEffect(() => {
    loadQuests().then((all) => {
      setQuest(all.find((q) => q.id === route.params.questId) ?? null);
    });
  }, [route.params.questId]);

  useLayoutEffect(() => {
    if (quest) {
      navigation.setOptions({ title: quest.title });
    }
  }, [navigation, quest]);

  async function handleAbandon() {
    if (!quest) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const all = await loadQuests();
    const updated = all.map((q) =>
      q.id === quest.id ? { ...q, status: 'abandoned' as const } : q,
    );
    await saveQuests(updated);
    setQuest({ ...quest, status: 'abandoned' });
  }

  return (
    <View style={styles.container}>
      <QuestDetail quest={quest} onAbandon={handleAbandon} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
});
