import { useLayoutEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { colors } from '../theme/theme';
import QuestDetail from '../components/QuestDetail';
import { quests } from '../data/quests';
import type { RootStackParamList } from '../navigation/types';

export default function QuestDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'QuestDetail'>>();
  const navigation = useNavigation();
  const quest = quests.find((q) => q.id === route.params.questId) ?? null;

  useLayoutEffect(() => {
    if (quest) {
      navigation.setOptions({ title: quest.title.toUpperCase() });
    }
  }, [navigation, quest]);

  return (
    <View style={styles.container}>
      <QuestDetail quest={quest} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
});
