import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import { Platform, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { useThemeStore } from '@/store/store';
import { brandTypography, getBrandColors, layout } from '@/theme/tokens';

export default function Modal() {
  const mode = useThemeStore((state) => state.mode);
  const colors = getBrandColors(mode);
  const statusBarStyle = mode === 'dark' ? 'light' : Platform.OS === 'ios' ? 'dark' : 'auto';

  return (
    <Container>
      <StatusBar style={statusBarStyle} />
      <ScrollView
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 32, gap: 16 }}
        style={{ backgroundColor: 'transparent' }}
        showsVerticalScrollIndicator={false}>
        <Text
          style={{
            color: colors.text,
            fontFamily: brandTypography.display,
            fontSize: 24,
            lineHeight: 30,
            letterSpacing: -0.3,
          }}>
          O que é o Movimundo
        </Text>
        <Text
          style={{
            color: colors.textMuted,
            fontFamily: brandTypography.body,
            fontSize: 16,
            lineHeight: 24,
          }}>
          Uma ponte digital entre pessoas que buscam cuidar do corpo e profissionais de saúde e esporte. Este modal é
          parte do modelo de apresentação — a experiência completa vive nas abas Instrutor e Aluno.
        </Text>
        <View
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.borderSubtle,
            borderRadius: layout.radius.lg,
            padding: layout.space.md,
            gap: 8,
          }}>
          <Text style={{ color: colors.text, fontFamily: brandTypography.label, fontSize: 15 }}>Resumo do pitch</Text>
          <Text style={{ color: colors.textMuted, fontFamily: brandTypography.body, fontSize: 14, lineHeight: 20 }}>
            Conexão com propósito, agenda clara e uma interface pensada para transmitir confiança a investidores e
            parceiros.
          </Text>
        </View>
        <Link href="/" asChild>
          <Button title="Voltar para o início" variant="primary" size="lg" />
        </Link>
      </ScrollView>
    </Container>
  );
}
