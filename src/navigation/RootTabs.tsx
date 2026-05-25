import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import JournalNavigator from './JournalNavigator';
import HealthScreen from '../screens/HealthScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import InventoryScreen from '../screens/InventoryScreen';
import TabBar from '../components/TabBar';

const DrawingScreen = () => <PlaceholderScreen name="Drawing" />;

const Tab = createBottomTabNavigator();

export default function RootTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: '#000000' },
      }}
    >
      <Tab.Screen
        name="Journal"
        component={JournalNavigator}
        options={{ tabBarLabel: 'Q' }}
      />
      <Tab.Screen
        name="Health"
        component={HealthScreen}
        options={{ tabBarLabel: 'H' }}
      />
      <Tab.Screen
        name="Drawing"
        component={DrawingScreen}
        options={{ tabBarLabel: 'D' }}
      />
      <Tab.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{ tabBarLabel: 'I' }}
      />
    </Tab.Navigator>
  );
}
