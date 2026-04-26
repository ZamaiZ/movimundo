import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { Switch, Text, View } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

import { DrawerBrandHero } from '@/components/DrawerBrandHero';
import { DrawerHeaderBrand } from '@/components/DrawerHeaderBrand';
import { useThemeStore } from '@/store/store';
import { getAppHeaderStyle } from '@/theme/navigationStyle';
import { brandTypography, getBrandColors, layout } from '@/theme/tokens';

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
          contentContainerStyle={{ flexGrow: 1, backgroundColor: brandColors.backgroundElevated }}
          style={{ backgroundColor: brandColors.backgroundElevated }}>
          <DrawerBrandHero />
          <DrawerItemList {...props} />
          <View style={{ flex: 1, minHeight: 24 }} />
          <View
            style={[
              {
                marginTop: 'auto',
                borderTopWidth: 1,
                borderTopColor: brandColors.borderSubtle,
                paddingHorizontal: layout.space.page,
                paddingVertical: 14,
                backgroundColor: brandColors.surface,
              },
            ]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={{ gap: 2, flex: 1, paddingRight: 12 }}>
                <Text
                  style={{
                    color: brandColors.text,
                    fontFamily: brandTypography.label,
                    fontSize: 15,
                  }}>
                  Aparência
                </Text>
                <Text
                  style={{
                    color: brandColors.textMuted,
                    fontFamily: brandTypography.body,
                    fontSize: 12,
                  }}>
                  Modo escuro
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                thumbColor={isDarkMode ? brandColors.primary : '#F4F4F5'}
                trackColor={{ false: brandColors.border, true: brandColors.accentSoft }}
              />
            </View>
          </View>
        </DrawerContentScrollView>
      )}
      screenOptions={{
        drawerStyle: {
          backgroundColor: brandColors.backgroundElevated,
          width: 300,
        },
        drawerActiveTintColor: brandColors.primary,
        drawerInactiveTintColor: brandColors.textMuted,
        drawerActiveBackgroundColor: brandColors.accentSoft,
        drawerItemStyle: {
          borderRadius: layout.radius.md,
          marginHorizontal: layout.space.page,
        },
        drawerLabelStyle: {
          fontFamily: brandTypography.label,
          fontSize: 15,
        },
        headerStyle: getAppHeaderStyle(brandColors, mode),
        headerTintColor: brandColors.primary,
        headerTitleStyle: {
          color: brandColors.text,
          fontFamily: brandTypography.displaySemibold,
          fontSize: 17,
        },
        headerShadowVisible: false,
        headerLeft: (p) => <DrawerHeaderBrand {...p} />,
      }}>
      <Drawer.Screen
        name="(instrutor)"
        options={{
          headerTitle: '',
          drawerLabel: 'Instrutor',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="barbell-outline" size={size + 1} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="(aluno)"
        options={{
          headerTitle: '',
          drawerLabel: 'Aluno',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="heart-outline" size={size + 1} color={color} />
          ),
        }}
      />
    </Drawer>
  );
};

export default DrawerLayout;
