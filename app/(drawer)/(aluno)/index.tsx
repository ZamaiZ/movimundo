import { Stack } from 'expo-router';

import { Container } from '@/components/Container';
import { ScreenContent } from '@/components/ScreenContent';

export default function AlunoHomeScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Aluno' }} />
      <Container>
        <ScreenContent path="app/(drawer)/(aluno)/index.tsx" title="Aluno - Início" />
      </Container>
    </>
  );
}
