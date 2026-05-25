import { Platform, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors, fontMap } from './src/theme/theme';
import RootTabs from './src/navigation/RootTabs';

// Force every text node to render lowercase. On web we inject a stylesheet
// rule (RN Web doesn't propagate Text.defaultProps reliably). On native
// the per-component fontFamily lookups will use Haltung — for true
// lowercase on iOS we'll need a base-text wrapper later.
if (Platform.OS === 'web' && typeof document !== 'undefined' && !document.getElementById('app-lowercase')) {
  const s = document.createElement('style');
  s.id = 'app-lowercase';
  s.textContent = `body, body * { text-transform: lowercase !important; }`;
  document.head.appendChild(s);
}

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

  if (!fontsLoaded) {
    return <View style={styles.splash} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer theme={navTheme}>
        <RootTabs />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: colors.black,
  },
});
