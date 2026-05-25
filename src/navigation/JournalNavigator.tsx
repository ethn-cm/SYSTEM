import { Platform, Pressable, Text, useWindowDimensions } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors, fonts, fontSize, breakpoints } from '../theme/theme';
import QuestListScreen from '../screens/QuestListScreen';
import QuestDetailScreen from '../screens/QuestDetailScreen';
import SplitLayout from './SplitLayout';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function JournalNavigator() {
  const { width } = useWindowDimensions();
  const isTablet = width >= breakpoints.tablet;

  if (isTablet) {
    return <SplitLayout />;
  }

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
        headerBackTitle: 'Back',
        contentStyle: { backgroundColor: colors.black },
        animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="QuestList"
        component={QuestListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="QuestDetail"
        component={QuestDetailScreen}
        options={({ navigation }) => ({
          title: '',
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.goBack()}
              hitSlop={16}
              style={{ paddingRight: 8 }}
            >
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 12,
                  color: colors.white,
                }}
              >
                ←
              </Text>
            </Pressable>
          ),
        })}
      />
    </Stack.Navigator>
  );
}
