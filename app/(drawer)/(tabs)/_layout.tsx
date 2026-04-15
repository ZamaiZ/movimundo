import { Tabs } from 'expo-router';
import { TabBarIcon } from '@/components/TabBarIcon';
import { useThemeStore } from '@/store/store';
import { brandTypography, getBrandColors } from '@/theme/tokens';

export default function TabLayout() {
  const mode = useThemeStore((state) => state.mode);
  const brandColors = getBrandColors(mode);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: brandColors.background },
        tabBarActiveTintColor: brandColors.primary,
        tabBarInactiveTintColor: brandColors.textMuted,
        tabBarStyle: {
          backgroundColor: brandColors.surface,
          borderTopColor: brandColors.border,
        },
        tabBarLabelStyle: {
          fontFamily: brandTypography.body,
          fontSize: 12,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tab One',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Tab Two',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </Tabs>
  );
}
