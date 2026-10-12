import {DarkTheme, DefaultTheme, Tabs, ThemeProvider} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {useColorScheme} from 'react-native';
import {AnimatedSplashOverlay} from '@/components/animated-icon';
import {LogoutButton} from "@/components/logout-button";
import {ThemedBalance} from "@/components/themed-balance";

SplashScreen.preventAutoHideAsync();

// Hoisted out of the component: an options object rebuilt on every render makes
// react-navigation recompute each screen's descriptor every time, which is
// churn in exactly the part of the tree the warning points at.
const screenOptions = {headerRight: ThemedBalance};
const homeOptions = {title: 'Home'};
const exploreOptions = {title: 'Explore'};
const profileOptions = {title: 'Watches', headerLeft: LogoutButton};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay/>
      <Tabs screenOptions={screenOptions}>
        <Tabs.Screen name="index" options={homeOptions}/>
        <Tabs.Screen name="explore" options={exploreOptions}/>
        <Tabs.Screen name="profile" options={profileOptions}/>
      </Tabs>
    </ThemeProvider>
  );
}
