import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { colors, fonts, fontSize } from '../theme/theme';
import HeaderStats from '../components/HeaderStats';
import QuestListScreen from '../screens/QuestListScreen';
import QuestDetailScreen from '../screens/QuestDetailScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.black },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontFamily: fonts.medium,
          fontSize: fontSize.caption,
        },
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerBackTitle: 'BACK',
        contentStyle: { backgroundColor: colors.black },
        animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="QuestList"
        component={QuestListScreen}
        options={{
          title: 'SYSTEM',
          headerRight: () => <HeaderStats />,
        }}
      />
      <Stack.Screen
        name="QuestDetail"
        component={QuestDetailScreen}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
}
