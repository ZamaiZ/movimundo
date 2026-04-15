import { Text, View } from 'react-native';
import { useThemeStore } from '@/store/store';
import { brandTypography, getBrandColors } from '@/theme/tokens';

interface EditScreenInfoProps {
  path: string;
}

export const EditScreenInfo: React.FC<EditScreenInfoProps> = ({ path }) => {
  const mode = useThemeStore((state) => state.mode);
  const colors = getBrandColors(mode);
  const title = 'Open up the code for this screen:';
  const description =
    'Change any of the text, save the file, and your app will automatically update.';

  return (
    <View>
      <View className={styles.getStartedContainer}>
        <Text
          className={styles.getStartedText}
          style={{ color: colors.text, fontFamily: brandTypography.body }}>
          {title}
        </Text>
        <View
          className={`${styles.codeHighlightContainer} ${styles.homeScreenFilename}`}
          style={{ backgroundColor: colors.surface }}>
          <Text style={{ color: colors.primary, fontFamily: brandTypography.body }}>{path}</Text>
        </View>
        <Text
          className={styles.getStartedText}
          style={{ color: colors.textMuted, fontFamily: brandTypography.body }}>
          {description}
        </Text>
      </View>
    </View>
  );
};

const styles = {
  codeHighlightContainer: `rounded-md px-1`,
  getStartedContainer: `items-center mx-12`,
  getStartedText: `text-lg leading-6 text-center`,
  homeScreenFilename: `my-2`,
};
