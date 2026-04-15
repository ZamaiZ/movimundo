import { View } from 'react-native';
import { useThemeStore } from '@/store/store';
import { getBrandColors } from '@/theme/tokens';

interface ContainerProps {
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
  const mode = useThemeStore((state) => state.mode);
  const colors = getBrandColors(mode);

  return <View className={styles.container} style={{ backgroundColor: colors.background }}>{children}</View>;
};

const styles = {
  container: 'flex flex-1 p-safe',
};
