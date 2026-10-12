import type { AppLocale } from './config';

/**
 * Narrows react-intl's `locale` to the locales this app actually ships, so a
 * typo in a locale code fails the typecheck.
 *
 * Message ids are deliberately not registered here: they live in the message
 * descriptors at their call sites, and `lang/` plus `compiled-lang/` are
 * generated *from* that source — not the other way round.
 */
declare global {
  namespace FormatjsIntl {
    interface IntlConfig {
      locale: AppLocale;
    }
  }
}
