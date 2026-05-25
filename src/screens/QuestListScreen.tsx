import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/theme';
import QuestList from '../components/QuestList';
import ScreenHeader from '../components/ScreenHeader';
import HeaderStats from '../components/HeaderStats';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'QuestList'>;

export default function QuestListScreen() {
  const navigation = useNavigation<Nav>();
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScreenHeader title="Journal" right={<HeaderStats />} />
      <View style={styles.body}>
        <QuestList
          onSelect={(quest) =>
            navigation.navigate('QuestDetail', { questId: quest.id })
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  body: {
    flex: 1,
  },
});
