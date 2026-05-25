import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors, fonts, fontSize, tracking } from '../theme/theme';

export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom > 0 ? insets.bottom : 12 },
      ]}
    >
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : options.title ?? route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              Haptics.selectionAsync();
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={({ pressed }) => [
                styles.tab,
                pressed && styles.tabPressed,
              ]}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={
                typeof options.tabBarAccessibilityLabel === 'string'
                  ? options.tabBarAccessibilityLabel
                  : (label as string)
              }
            >
              <Text
                style={[
                  styles.label,
                  isFocused ? styles.labelActive : styles.labelInactive,
                ]}
              >
                {String(label).toUpperCase()}
              </Text>
              <View style={[styles.indicator, isFocused && styles.indicatorActive]} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.grayBorder,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  tab: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 4,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 6,
  },
  tabPressed: {
    opacity: 0.6,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: fontSize.micro,
    letterSpacing: tracking.wide,
  },
  labelActive: {
    color: colors.white,
  },
  labelInactive: {
    color: colors.grayMid,
  },
  indicator: {
    width: 4,
    height: 4,
    backgroundColor: 'transparent',
  },
  indicatorActive: {
    backgroundColor: colors.white,
  },
});
