import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Text, View, Switch } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

import { HeaderButton } from '../../components/HeaderButton';
import { useThemeStore } from '@/store/store';
import { brandTypography, getBrandColors } from '@/theme/tokens';

const DrawerLayout = () => {
  const mode = useThemeStore((state) => state.mode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const brandColors = getBrandColors(mode);
  const isDarkMode = mode === 'dark';

  return (
    <Drawer
      drawerContent={(props) => (
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={{ flex: 1, backgroundColor: brandColors.surface }}>
          <DrawerItemList {...props} />
          <View
            style={{
              marginTop: 'auto',
              borderTopWidth: 1,
              borderTopColor: brandColors.border,
              paddingHorizontal: 16,
              paddingVertical: 14,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: brandColors.text,
                fontFamily: brandTypography.body,
                fontSize: 14,
              }}>
              Modo escuro
            </Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              thumbColor={isDarkMode ? brandColors.secondary : '#F4F4F5'}
              trackColor={{ false: brandColors.border, true: brandColors.primary }}
            />
          </View>
        </DrawerContentScrollView>
      )}
      screenOptions={{
        drawerStyle: { backgroundColor: brandColors.surface },
        drawerActiveTintColor: brandColors.primary,
        drawerInactiveTintColor: brandColors.textMuted,
        drawerLabelStyle: {
          fontFamily: brandTypography.body,
          fontSize: 14,
        },
        headerStyle: { backgroundColor: brandColors.surface },
        headerTintColor: brandColors.primary,
        headerTitleStyle: {
          color: brandColors.text,
          fontFamily: brandTypography.title,
        },
        headerShadowVisible: false,
      }}>
      <Drawer.Screen
        name="index"
        options={{
          headerTitle: 'Home',
          drawerLabel: 'Home',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="(tabs)"
        options={{
          headerTitle: 'Tabs',
          drawerLabel: 'Tabs',
          drawerIcon: ({ size, color }) => (
            <MaterialIcons name="border-bottom" size={size} color={color} />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <HeaderButton />
            </Link>
          ),
        }}
      />
    </Drawer>
  );
};

export default DrawerLayout;
