import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/theme';
import QuestList from '../components/QuestList';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'QuestList'>;

export default function QuestListScreen() {
  const navigation = useNavigation<Nav>();
  return (
    <View style={styles.container}>
      <QuestList
        onSelect={(quest) =>
          navigation.navigate('QuestDetail', { questId: quest.id })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
});
