import type { Locale } from 'expo-localization';

/** Locales with a message catalogue in `./messages`. */
export const SUPPORTED_LOCALES = ['en', 'de', 'es', 'fr'] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

/** Used when the device asks for a language we do not ship. */
export const DEFAULT_LOCALE: AppLocale = 'en';

function isSupportedLocale(value: string | null | undefined): value is AppLocale {
  return value != null && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/**
 * Picks the first device language we have translations for. Catalogues are keyed
 * by language rather than by region, so `en-GB` and `en-US` both resolve to `en`.
 */
export function resolveLocale(
  deviceLocales: readonly Pick<Locale, 'languageCode' | 'languageTag'>[]
): AppLocale {
  for (const { languageCode, languageTag } of deviceLocales) {
    const language = languageCode ?? languageTag.split('-')[0];
    if (isSupportedLocale(language)) {
      return language;
    }
  }

  return DEFAULT_LOCALE;
}
