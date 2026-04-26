import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { getSharedTabScreenOptions } from '@/theme/tabBar';

export default function AlunoTabLayout() {
  return (
    <Tabs
      screenOptions={getSharedTabScreenOptions()}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'sparkles' : 'sparkles-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Aulas',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'barbell' : 'barbell-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
