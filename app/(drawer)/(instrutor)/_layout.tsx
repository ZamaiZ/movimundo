import { Tabs } from 'expo-router';
import { TabBarIcon } from '@/components/TabBarIcon';
import { useThemeStore } from '@/store/store';
import { brandTypography, getBrandColors } from '@/theme/tokens';

export default function InstrutorTabLayout() {
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
          title: 'Início',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Agenda',
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
        }}
      />
    </Tabs>
  );
}
