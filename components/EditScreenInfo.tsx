import { Text, View } from 'react-native';
import { useThemeStore } from '@/store/store';
import { brandTypography, getBrandColors } from '@/theme/tokens';

interface EditScreenInfoProps {
  path: string;
}

/** Bloco opcional para desenvolvimento — não usado nas rotas de apresentação principais. */
export const EditScreenInfo: React.FC<EditScreenInfoProps> = ({ path }) => {
  const mode = useThemeStore((state) => state.mode);
  const colors = getBrandColors(mode);

  return (
    <View>
      <View className="items-center mx-12">
        <Text
          className="text-lg leading-6 text-center"
          style={{ color: colors.text, fontFamily: brandTypography.body }}>
          Arquivo desta tela:
        </Text>
        <View
          className="rounded-md px-1 my-2"
          style={{ backgroundColor: colors.surfaceHighlight, paddingVertical: 6, paddingHorizontal: 10 }}>
          <Text style={{ color: colors.primary, fontFamily: brandTypography.mono, fontSize: 13 }}>{path}</Text>
        </View>
        <Text
          className="text-lg leading-6 text-center"
          style={{ color: colors.textMuted, fontFamily: brandTypography.body }}>
          Salve o arquivo para atualizar o app em tempo real.
        </Text>
      </View>
    </View>
  );
};
