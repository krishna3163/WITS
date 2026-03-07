import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import Screen Modules
import ChatListScreen from '../screens/messaging/ChatListScreen';
import ContactsListScreen from '../screens/contacts/ContactsListScreen';
import FeedHomeScreen from '../screens/feed/FeedHomeScreen';
import DiscoverHomeScreen from '../screens/discover/DiscoverHomeScreen';
import MiniAppStoreScreen from '../screens/miniapps/MiniAppStoreScreen';
import WalletDashboardScreen from '../screens/wallet/WalletDashboardScreen';
import MyProfileScreen from '../screens/profile/MyProfileScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'Chats') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Contacts') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Moments') {
            iconName = focused ? 'aperture' : 'aperture-outline';
          } else if (route.name === 'Discover') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'MiniApps') {
            iconName = focused ? 'apps' : 'apps-outline';
          } else if (route.name === 'Wallet') {
            iconName = focused ? 'card' : 'card-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#07C160', // WeChat Green
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}
    >
      <Tab.Screen name="Chats" component={ChatListScreen} />
      <Tab.Screen name="Contacts" component={ContactsListScreen} />
      <Tab.Screen name="Moments" component={FeedHomeScreen} />
      <Tab.Screen name="Discover" component={DiscoverHomeScreen} />
      <Tab.Screen name="MiniApps" component={MiniAppStoreScreen} />
      <Tab.Screen name="Wallet" component={WalletDashboardScreen} />
      <Tab.Screen name="Profile" component={MyProfileScreen} />
    </Tab.Navigator>
  );
}
