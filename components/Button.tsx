import { forwardRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, TouchableOpacity, TouchableOpacityProps, View, type ViewStyle } from 'react-native';

import { useThemeStore } from '@/store/store';
import { brandTypography, getBrandColors, getShadow, layout } from '@/theme/tokens';

export type ButtonVariant = 'primary' | 'outline' | 'ghost';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: 'md' | 'lg';
}

export const Button = forwardRef<View, ButtonProps>(
  ({ title, variant = 'primary', size = 'md', className, style, disabled, ...touchableProps }, ref) => {
    const mode = useThemeStore((state) => state.mode);
    const colors = getBrandColors(mode);

    const isPrimary = variant === 'primary';
    const paddingV = size === 'lg' ? 16 : 12;
    const minHeight = size === 'lg' ? 52 : 48;
    const fontSize = size === 'lg' ? 17 : 15;
    const radius = layout.radius.md;

    const baseRow: ViewStyle = {
      minHeight,
      borderRadius: radius,
      paddingVertical: paddingV,
      paddingHorizontal: 20,
      alignItems: 'center',
      justifyContent: 'center',
    };

    if (variant === 'outline') {
      return (
        <TouchableOpacity
          ref={ref}
          {...touchableProps}
          disabled={disabled}
          className={className}
          style={[
            baseRow,
            {
              backgroundColor: 'transparent',
              borderWidth: 1.5,
              borderColor: colors.borderStrong,
            },
            disabled && { opacity: 0.5 },
            style,
          ]}
          activeOpacity={0.85}>
          <Text
            style={{
              color: colors.text,
              fontFamily: brandTypography.label,
              fontSize,
            }}>
            {title}
          </Text>
        </TouchableOpacity>
      );
    }

    if (variant === 'ghost') {
      return (
        <TouchableOpacity
          ref={ref}
          {...touchableProps}
          disabled={disabled}
          className={className}
          style={[baseRow, { backgroundColor: colors.surfaceMuted }, disabled && { opacity: 0.5 }, style]}
          activeOpacity={0.85}>
          <Text
            style={{
              color: colors.primary,
              fontFamily: brandTypography.label,
              fontSize,
            }}>
            {title}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        ref={ref}
        {...touchableProps}
        disabled={disabled}
        className={className}
        style={[{ borderRadius: radius, overflow: 'hidden' as const }, disabled && { opacity: 0.55 }, style]}
        activeOpacity={0.92}>
        <LinearGradient
          colors={[colors.accentButton, colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            baseRow,
            {
              minHeight,
              borderRadius: radius,
            },
            getShadow(mode, 'glow'),
          ]}>
          <Text
            style={{
              color: colors.textOnPrimary,
              fontFamily: brandTypography.label,
              fontSize,
            }}>
            {title}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';
