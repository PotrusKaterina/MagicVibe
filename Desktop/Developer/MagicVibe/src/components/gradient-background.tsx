import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, type ViewProps } from 'react-native';

import { GradientLocations, Gradients } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const GradientBackground = ({ style, children, ...otherProps }: ViewProps) => {
  const scheme = useColorScheme();
  const colors = Gradients[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <LinearGradient
      colors={colors}
      locations={GradientLocations}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.fill, style]}
      {...otherProps}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
