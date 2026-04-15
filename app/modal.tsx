import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

import { ScreenContent } from '@/components/ScreenContent';
import { useThemeStore } from '@/store/store';

export default function Modal() {
  const mode = useThemeStore((state) => state.mode);
  const statusBarStyle = mode === 'dark' ? 'light' : Platform.OS === 'ios' ? 'dark' : 'auto';

  return (
    <>
      <ScreenContent path="app/modal.tsx" title="Modal"></ScreenContent>
      <StatusBar style={statusBarStyle} />
    </>
  );
}
