import { Link, Stack } from 'expo-router';

import { Text } from 'react-native';

import { Container } from '@/components/Container';
import { useThemeStore } from '@/store/store';
import { brandTypography, getBrandColors } from '@/theme/tokens';

export default function NotFoundScreen() {
  const mode = useThemeStore((state) => state.mode);
  const colors = getBrandColors(mode);

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Container>
        <Text
          className={styles.title}
          style={{ color: colors.text, fontFamily: brandTypography.title }}>
          {"This screen doesn't exist."}
        </Text>
        <Link href="/" className={styles.link}>
          <Text
            className={styles.linkText}
            style={{ color: colors.primary, fontFamily: brandTypography.body }}>
            Go to home screen!
          </Text>
        </Link>
      </Container>
    </>
  );
}

const styles = {
  title: `text-xl font-bold`,
  link: `mt-4 pt-4`,
  linkText: `text-base`,
};
