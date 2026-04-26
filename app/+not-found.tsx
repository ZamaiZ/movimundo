import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { useThemeStore } from '@/store/store';
import { brandTypography, getBrandColors, layout } from '@/theme/tokens';

export default function NotFoundScreen() {
  const mode = useThemeStore((state) => state.mode);
  const colors = getBrandColors(mode);

  return (
    <>
      <Stack.Screen options={{ title: 'Página não encontrada' }} />
      <Container>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: layout.space.page,
            gap: 20,
          }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: colors.accentSoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons name="compass-outline" size={36} color={colors.primary} />
          </View>
          <Text
            style={{
              textAlign: 'center',
              color: colors.text,
              fontFamily: brandTypography.display,
              fontSize: 22,
              lineHeight: 28,
            }}>
            Esta tela não existe
          </Text>
          <Text
            style={{
              textAlign: 'center',
              color: colors.textMuted,
              fontFamily: brandTypography.body,
              fontSize: 15,
              lineHeight: 22,
            }}>
            Verifique o endereço ou volte para a área principal do app.
          </Text>
          <Link href="/" asChild>
            <Button title="Ir para o início" variant="primary" size="lg" />
          </Link>
        </View>
      </Container>
    </>
  );
}
