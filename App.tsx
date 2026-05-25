import { Platform, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from './src/theme/theme';
import RootTabs from './src/navigation/RootTabs';

// Web-only: load Univers Next Pro via Adobe Fonts (Typekit).
// On iOS native this is a no-op; bundle the .otf into assets/fonts/ when ready.
if (Platform.OS === 'web' && typeof document !== 'undefined' && !document.getElementById('typekit-univers')) {
  const link = document.createElement('link');
  link.id = 'typekit-univers';
  link.rel = 'stylesheet';
  link.href = 'https://use.typekit.net/xwq4gpc.css';
  document.head.appendChild(link);
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
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer theme={navTheme}>
        <RootTabs />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const _styles = StyleSheet.create({});
