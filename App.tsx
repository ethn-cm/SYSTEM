import { useWindowDimensions, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors, fontMap, breakpoints } from './src/theme/theme';
import RootNavigator from './src/navigation/RootNavigator';
import SplitLayout from './src/navigation/SplitLayout';

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.black,
    card: colors.black,
    text: colors.white,
    border: colors.grayBorder,
    primary: colors.white,
  },
};

export default function App() {
  const [fontsLoaded] = useFonts(fontMap);
  const { width } = useWindowDimensions();
  const isTablet = width >= breakpoints.tablet;

  if (!fontsLoaded) {
    return <View style={styles.splash} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {isTablet ? (
        <SplitLayout />
      ) : (
        <NavigationContainer theme={navTheme}>
          <RootNavigator />
        </NavigationContainer>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: colors.black,
  },
});
