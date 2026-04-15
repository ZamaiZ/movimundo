import { forwardRef } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { useThemeStore } from '@/store/store';
import { brandTypography, getBrandColors } from '@/theme/tokens';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
}

export const Button = forwardRef<View, ButtonProps>(({ title, ...touchableProps }, ref) => {
  const mode = useThemeStore((state) => state.mode);
  const colors = getBrandColors(mode);

  return (
    <TouchableOpacity
      ref={ref}
      {...touchableProps}
      className={`${styles.button} ${touchableProps.className}`}
      style={[{ backgroundColor: colors.primary }, touchableProps.style]}>
      <Text className={styles.buttonText} style={{ fontFamily: brandTypography.title }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
});

Button.displayName = 'Button';

const styles = {
  button: 'items-center rounded-[28px] shadow-md p-4',
  buttonText: 'text-white text-lg font-semibold text-center',
};
