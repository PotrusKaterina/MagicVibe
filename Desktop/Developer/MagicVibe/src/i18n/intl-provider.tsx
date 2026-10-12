// Must run before react-intl formats anything.
import './polyfills';

import { useLocales } from 'expo-localization';
import { type ReactNode, useMemo } from 'react';
import { IntlProvider, ReactIntlErrorCode, type ResolvedIntlConfig } from 'react-intl';

import { CATALOGS } from './catalogs';
import { DEFAULT_LOCALE, resolveLocale } from './config';

import { ThemedText } from '@/components/themed-text';

/**
 * Tags translators may use inside a message, e.g.
 * `"press <code>{shortcut}</code>"`. React Native refuses to render a bare
 * string outside a `<Text>`, so every tag has to resolve to one — these are
 * safe to nest inside the surrounding `<ThemedText>`.
 *
 * Declared at module scope so the provider config stays referentially stable.
 */
const RICH_TEXT_ELEMENTS = {
  code: (chunks: ReactNode[]) => <ThemedText type="code">{chunks}</ThemedText>,
  b: (chunks: ReactNode[]) => <ThemedText type="smallBold">{chunks}</ThemedText>,
} satisfies ResolvedIntlConfig['defaultRichTextElements'];

const handleIntlError: ResolvedIntlConfig['onError'] = (error) => {
  // A missing translation renders the English default baked in by
  // babel-plugin-formatjs, which beats crashing a screen — worth fixing, not
  // worth shouting about in a release build.
  if (error.code === ReactIntlErrorCode.MISSING_TRANSLATION) {
    if (__DEV__) {
      console.warn(error.message);
    }
    return;
  }

  console.error(error);
};

/**
 * Supplies the compiled catalogue for the device's preferred language.
 * Rerenders when the OS language changes, so the UI follows without a restart.
 */
export function AppIntlProvider({ children }: { children: ReactNode }) {
  const deviceLocales = useLocales();
  const locale = useMemo(() => resolveLocale(deviceLocales), [deviceLocales]);

  return (
    <IntlProvider
      locale={locale}
      defaultLocale={DEFAULT_LOCALE}
      messages={CATALOGS[locale]}
      defaultRichTextElements={RICH_TEXT_ELEMENTS}
      onError={handleIntlError}>
      {children}
    </IntlProvider>
  );
}
