import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const themeColor = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: themeColor.icon,
        tabBarInactiveTintColor: themeColor.default,
        tabBarStyle: {
          alignContent: 'center',
          backgroundColor: themeColor.backgroundLight,
          borderTopColor: themeColor.backgroundLight,
          marginLeft: 10, 
          marginRight: 10,
          borderRadius: 10,
          paddingBottom: 0,
          height: 60,
        },
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ranking"
        options={{
          title: 'Ranking',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'trophy' : 'trophy-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

