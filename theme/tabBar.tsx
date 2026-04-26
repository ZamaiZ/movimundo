import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { BrandTabBar } from '@/components/navigation/BrandTabBar';

/**
 * Opções compartilhadas das abas. `tabBar` em JSX (não `createElement` em ficheiro .ts)
 * para o Metro aplicar SEMPRE a barra custom no Android/iOS, com a paleta e tema escuro.
 */
export function getSharedTabScreenOptions() {
  return {
    headerShown: false,
    sceneStyle: { backgroundColor: 'transparent' } as const,
    tabBar: (props: BottomTabBarProps) => <BrandTabBar {...props} />,
  };
}
