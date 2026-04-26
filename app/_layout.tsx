import '../global.css';
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_700Bold_Italic,
  useFonts,
} from '@expo-google-fonts/inter';
import {
  Outfit_400Regular,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useThemeStore } from '@/store/store';
import { getNavigationTheme } from '@/theme/navigationTheme';
import { brandTypography, getBrandColors } from '@/theme/tokens';

export const unstable_settings = {
  initialRouteName: '(drawer)',
};

export default function RootLayout() {
  const mode = useThemeStore((state) => state.mode);
  const brandColors = getBrandColors(mode);
  const navigationTheme = getNavigationTheme(mode);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_700Bold_Italic,
    Outfit_400Regular,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={navigationTheme}>
          <Stack
            screenOptions={{
              contentStyle: { backgroundColor: brandColors.background },
              headerStyle: {
                backgroundColor: brandColors.surface,
              },
              headerTintColor: brandColors.primary,
              headerTitleStyle: {
                color: brandColors.text,
                fontFamily: brandTypography.displaySemibold,
                fontSize: 18,
              },
              headerShadowVisible: false,
            }}>
            <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ title: 'Movimundo', presentation: 'modal' }}
            />
          </Stack>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
