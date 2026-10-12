import * as Device from 'expo-device';
import { FormattedMessage, useIntl } from 'react-intl';
import { Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedIcon } from '@/components/animated-icon';
import { HintRow } from '@/components/hint-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

function getMenuHint() {
  if (Platform.OS === 'web') {
    return (
      <ThemedText type="small">
        <FormattedMessage
          id="home.devMenu.web"
          defaultMessage="use browser devtools"
          description="How to open the dev menu when the app runs in a browser"
        />
      </ThemedText>
    );
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        <FormattedMessage
          id="home.devMenu.device"
          defaultMessage="shake device or press <code>m</code> in terminal"
          description="How to open the dev menu on a physical phone"
        />
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
  return (
    <ThemedText type="small">
      <FormattedMessage
        id="home.devMenu.simulator"
        defaultMessage="press <code>{shortcut}</code>"
        description="How to open the dev menu in a simulator. {shortcut} is a key combination"
        values={{ shortcut }}
      />
    </ThemedText>
  );
}

export default function Home() {
  const intl = useIntl();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <AnimatedIcon />
          <ThemedText type="title" style={styles.title}>
            <FormattedMessage
              id="home.title"
              defaultMessage="Welcome to{nbsp}Expo"
              description="Main heading on the home screen. {nbsp} is a non-breaking space that keeps Expo on the same line"
              values={{ nbsp: '\u00a0' }}
            />
          </ThemedText>
        </ThemedView>

        <ThemedText type="code" style={styles.code}>
          <FormattedMessage
            id="home.getStarted"
            defaultMessage="get started"
            description="Caption above the list of first steps. Rendered uppercase"
          />
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.stepContainer}>
          <HintRow
            title={intl.formatMessage({
              id: 'home.hint.editing',
              defaultMessage: 'Try editing',
              description: 'Label of the row pointing at the file to edit first',
            })}
            hint={<ThemedText type="code">src/app/index.tsx</ThemedText>}
          />
          <HintRow
            title={intl.formatMessage({
              id: 'home.hint.devTools',
              defaultMessage: 'Dev tools',
              description: 'Label of the row explaining how to open the developer menu',
            })}
            hint={getMenuHint()}
          />
          <HintRow
            title={intl.formatMessage({
              id: 'home.hint.freshStart',
              defaultMessage: 'Fresh start',
              description: 'Label of the row pointing at the project reset command',
            })}
            hint={<ThemedText type="code">npm run reset-project</ThemedText>}
          />
        </ThemedView>

        {Platform.OS === 'web' && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});
