import {useMemo, useState} from 'react';
import {Platform, ScrollView, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BoxCard} from '@/components/box-card';
import {ThemedView} from '@/components/themed-view';
import {WebBadge} from '@/components/web-badge';
import {BottomTabInset, MaxContentWidth, Spacing} from '@/constants/theme';
import {useTheme} from '@/hooks/use-theme';
import {createBoxes} from '@/models/box';

const CATALOGUE_SIZE = 5;

export const Explore = () => {
  // Lazy initialiser, so the random catalogue is built once per mount instead
  // of reshuffling on every render.
  const boxes = useMemo(() => {
    return createBoxes(CATALOGUE_SIZE);
  }, []);

  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const theme = useTheme();

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  return (
    <ScrollView
      style={[styles.scrollView, {backgroundColor: theme.background}]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <ThemedView style={styles.container}>
        {boxes.map((box) => (
          <BoxCard key={box.id} box={box}/>
        ))}
        {Platform.OS === 'web' && <WebBadge/>}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
    gap: Spacing.four,
    paddingHorizontal: Spacing.three,
  },
});
