import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import JournalNavigator from './JournalNavigator';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import MementoScreen from '../screens/MementoScreen';
import TabBar from '../components/TabBar';

const Tab = createBottomTabNavigator();

const InventoryScreen = () => <PlaceholderScreen name="Inventory" />;
const ProfileScreen = () => <PlaceholderScreen name="Profile" />;

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
        name="Memento"
        component={MementoScreen}
        options={{ tabBarLabel: 'M' }}
      />
      <Tab.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{ tabBarLabel: 'I' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'P' }}
      />
    </Tab.Navigator>
  );
}
