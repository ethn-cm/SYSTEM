import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import JournalNavigator from './JournalNavigator';
import HealthScreen from '../screens/HealthScreen';
import MementoScreen from '../screens/MementoScreen';
import InventoryScreen from '../screens/InventoryScreen';
import TabBar from '../components/TabBar';

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
        options={{ tabBarLabel: 'J' }}
      />
      <Tab.Screen
        name="Health"
        component={HealthScreen}
        options={{ tabBarLabel: 'H' }}
      />
      <Tab.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{ tabBarLabel: 'I' }}
      />
      <Tab.Screen
        name="Memento"
        component={MementoScreen}
        options={{ tabBarLabel: 'M' }}
      />
    </Tab.Navigator>
  );
}
