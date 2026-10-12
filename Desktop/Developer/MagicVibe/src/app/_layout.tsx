import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';

import {useHydrateUserStore} from '@/hooks/use-hydrate-user-store';
import {AppIntlProvider} from '@/i18n';
import {useUserStore} from '@/store/user-store';

SplashScreen.preventAutoHideAsync();

export default function LayoutRoot() {
  useHydrateUserStore();

  const hasHydrated = useUserStore((state) => state.hasHydrated);
  const hasName = useUserStore((state) => state.name.length > 0);

  useEffect(() => {
    if (hasHydrated) {
      SplashScreen.hideAsync();
    }
  }, [hasHydrated]);

  // Rendering before rehydration would mount the welcome screen and then yank it
  // away once the stored name arrives.
  if (!hasHydrated) {
    return null;
  }

  return (
    <AppIntlProvider>
      <Stack
        screenOptions={{
          headerShown: false
        }}>
        <Stack.Protected
          guard={!hasName}>
          <Stack.Screen name="(public)" />
        </Stack.Protected>
        <Stack.Protected
          guard={hasName}>
          <Stack.Screen
            name="(protected)"
            options={{ headerShown: false, animation: 'none' }}
          />
        </Stack.Protected>
      </Stack>
    </AppIntlProvider>
  );
}
