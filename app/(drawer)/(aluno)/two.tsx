import { Stack } from 'expo-router';

import { Container } from '@/components/Container';
import { ScreenContent } from '@/components/ScreenContent';

export default function AlunoAulasScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Aulas do Aluno' }} />
      <Container>
        <ScreenContent path="app/(drawer)/(aluno)/two.tsx" title="Aluno - Aulas" />
      </Container>
    </>
  );
}
