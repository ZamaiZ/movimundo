import { forwardRef } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Pressable, StyleSheet } from 'react-native';
import { useThemeStore } from '@/store/store';
import { getBrandColors } from '@/theme/tokens';

export const HeaderButton = forwardRef<typeof Pressable, { onPress?: () => void }>(
  ({ onPress }, ref) => {
    const mode = useThemeStore((state) => state.mode);
    const brandColors = getBrandColors(mode);

    return (
      <Pressable onPress={onPress}>
        {({ pressed }) => (
          <FontAwesome
            name="info-circle"
            size={25}
            color={brandColors.secondary}
            style={[
              styles.headerRight,
              {
                opacity: pressed ? 0.5 : 1,
              },
            ]}
          />
        )}
      </Pressable>
    );
  }
);

HeaderButton.displayName = 'HeaderButton';

export const styles = StyleSheet.create({
  headerRight: {
    marginRight: 15,
  },
});
