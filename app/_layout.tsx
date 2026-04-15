import '../global.css';
import { Inter_400Regular, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useThemeStore } from '@/store/store';
import { brandTypography, getBrandColors } from '@/theme/tokens';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(drawer)',
};

export default function RootLayout() {
  const mode = useThemeStore((state) => state.mode);
  const brandColors = getBrandColors(mode);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: brandColors.background },
            headerStyle: { backgroundColor: brandColors.surface },
            headerTintColor: brandColors.primary,
            headerTitleStyle: {
              color: brandColors.text,
              fontFamily: brandTypography.title,
            },
            headerShadowVisible: false,
          }}>
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ title: 'Modal', presentation: 'modal' }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
