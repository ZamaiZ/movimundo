import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeStore } from '@/store/store';
import { brandTypography, getBrandColors, getShadow, layout } from '@/theme/tokens';

/**
 * Barra de abas custom: dock com hairline + sombra leve, track em cápsula e pílula ativa
 * (comportamento idêntico iOS/Android; evita o retângulo do tabBarActiveBackgroundColor no Material).
 * Fundo: backgroundElevated — leve contraste com o conteúdo; miolo: surfaceMuted; ativo: gradiente de tokens.
 */
export function BrandTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const mode = useThemeStore((s) => s.mode);
  const colors = getBrandColors(mode);
  const bottomPad = insets.bottom;

  return (
    <View
      style={[
        {
          backgroundColor: colors.backgroundElevated,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.borderSubtle,
          paddingTop: 6,
          paddingBottom: bottomPad,
          paddingHorizontal: layout.space.page,
        },
        getShadow(mode, 'barTop'),
      ]}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'stretch',
          backgroundColor: colors.surfaceMuted,
          borderRadius: layout.radius.full,
          padding: 5,
        }}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const color = isFocused ? colors.primary : colors.textMuted;
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : options.title ?? route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={({ pressed }) => ({
                flex: 1,
                opacity: pressed ? 0.92 : 1,
              })}>
              <View
                style={{
                  minHeight: 48,
                  borderRadius: layout.radius.full,
                  overflow: 'hidden',
                }}>
                {isFocused && (
                  <LinearGradient
                    colors={[colors.surfaceHighlight, colors.accentSoft]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFillObject}
                  />
                )}
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 6,
                    paddingHorizontal: 4,
                    minHeight: 48,
                  }}>
                  {options.tabBarIcon?.({
                    focused: isFocused,
                    color,
                    size: 24,
                  })}
                  {isFocused && (
                    <View
                      style={{
                        marginTop: 2,
                        width: 20,
                        height: 2,
                        borderRadius: 1,
                        backgroundColor: colors.primary,
                      }}
                    />
                  )}
                  <Text
                    numberOfLines={1}
                    style={{
                      marginTop: isFocused ? 2 : 4,
                      fontFamily: isFocused ? brandTypography.label : brandTypography.body,
                      fontSize: 11,
                      lineHeight: 14,
                      color,
                    }}>
                    {String(label)}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
