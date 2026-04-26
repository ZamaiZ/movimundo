import React from 'react';
import { Text, View } from 'react-native';
import { useThemeStore } from '@/store/store';
import { brandTypography, getBrandColors } from '@/theme/tokens';

import { EditScreenInfo } from './EditScreenInfo';

interface ScreenContentProps {
  title: string;
  path: string;
  children?: React.ReactNode;
}

export const ScreenContent: React.FC<ScreenContentProps> = ({ title, path, children }) => {
  const mode = useThemeStore((state) => state.mode);
  const colors = getBrandColors(mode);

  return (
    <View className={styles.container} style={{ backgroundColor: colors.background }}>
      <Text
        className={styles.title}
        style={{ color: colors.text, fontFamily: brandTypography.displaySemibold }}>
        {title}
      </Text>
      <View className={styles.separator} style={{ backgroundColor: colors.borderSubtle }} />
      <EditScreenInfo path={path} />
      {children}
    </View>
  );
};

const styles = {
  container: `items-center flex-1 justify-center`,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `text-xl font-bold`,
};
