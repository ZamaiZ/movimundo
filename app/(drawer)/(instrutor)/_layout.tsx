import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { getSharedTabScreenOptions } from '@/theme/tabBar';

export default function InstrutorTabLayout() {
  return (
    <Tabs
      screenOptions={getSharedTabScreenOptions()}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Agenda',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
