import { Stack } from 'expo-router';

import { Container } from '@/components/Container';
import { ScreenContent } from '@/components/ScreenContent';

export default function InstrutorAgendaScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Agenda do Instrutor' }} />
      <Container>
        <ScreenContent path="app/(drawer)/(instrutor)/two.tsx" title="Instrutor - Agenda" />
      </Container>
    </>
  );
}
