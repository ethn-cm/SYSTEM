import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import JournalNavigator from './JournalNavigator';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import TabBar from '../components/TabBar';

const Tab = createBottomTabNavigator();

const MapScreen = () => <PlaceholderScreen name="Map" />;
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
        options={{ tabBarLabel: 'JOURNAL' }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{ tabBarLabel: 'MAP' }}
      />
      <Tab.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{ tabBarLabel: 'INVENTORY' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'PROFILE' }}
      />
    </Tab.Navigator>
  );
}
