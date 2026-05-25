import { Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors, fonts, fontSize, breakpoints, spacing } from '../theme/theme';
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
          // Align the back button with the content's left edge (spacing.xl = 24).
          // Native-stack already adds some inset, so we offset just enough.
          headerLeftContainerStyle: { paddingLeft: spacing.xl - 16 },
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.goBack()}
              hitSlop={12}
              style={({ pressed }) => [
                backStyles.button,
                pressed && backStyles.buttonPressed,
              ]}
            >
              <View style={backStyles.iconWrap}>
                <Text style={backStyles.icon}>←</Text>
              </View>
            </Pressable>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

const BACK_SIZE = 28;
const backStyles = StyleSheet.create({
  button: {
    width: BACK_SIZE,
    height: BACK_SIZE,
  },
  buttonPressed: {
    opacity: 0.5,
  },
  iconWrap: {
    width: BACK_SIZE,
    height: BACK_SIZE,
    borderRadius: BACK_SIZE / 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.white,
    lineHeight: 12,
    marginTop: -1,
  },
});
