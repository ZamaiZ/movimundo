import { View, type ViewProps } from 'react-native';

import { useThemeStore } from '@/store/store';
import { getBrandColors, getShadow, layout, type BrandColors } from '@/theme/tokens';

type AccentStrip = 'primary' | 'secondary' | 'none';

export interface BrandCardProps extends ViewProps {
  children: React.ReactNode;
  /** Faixa no topo (2px) */
  accent?: AccentStrip;
  /** Sombra suave estilo “elevado” */
  elevated?: boolean;
}

function accentColor(colors: BrandColors, accent: AccentStrip): string | undefined {
  if (accent === 'primary') return colors.primary;
  if (accent === 'secondary') return colors.secondary;
  return undefined;
}

export function BrandCard({
  children,
  style,
  accent = 'none',
  elevated = true,
  ...rest
}: BrandCardProps) {
  const mode = useThemeStore((state) => state.mode);
  const colors = getBrandColors(mode);
  const strip = accentColor(colors, accent);

  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.borderSubtle,
          borderRadius: layout.radius.lg,
          overflow: 'hidden' as const,
        },
        elevated ? getShadow(mode, 'card') : undefined,
        style,
      ]}
      {...rest}>
      {strip ? (
        <View style={{ height: 3, width: '100%', backgroundColor: strip }} />
      ) : null}
      <View style={{ padding: layout.space.md }}>{children}</View>
    </View>
  );
}
