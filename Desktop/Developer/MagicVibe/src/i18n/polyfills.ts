/**
 * Hermes ships a partial `Intl` implementation: `NumberFormat` and
 * `DateTimeFormat` are there, but `Intl.PluralRules` — which react-intl needs to
 * resolve `{plural}` arguments — is not guaranteed on every platform.
 *
 * Each FormatJS `polyfill.js` entry checks the runtime itself and installs
 * nothing when the native implementation is already good enough, and the
 * `locale-data` modules no-op unless the polyfill actually took over. Importing
 * them unconditionally is therefore safe, and keeps the order below meaningful:
 * `PluralRules` depends on `Intl.Locale`, which depends on `getCanonicalLocales`.
 */
import '@formatjs/intl-getcanonicallocales/polyfill.js';
import '@formatjs/intl-locale/polyfill.js';
import '@formatjs/intl-pluralrules/polyfill.js';

// Metro resolves `require`/`import` paths statically, so every supported locale
// has to be listed literally — keep in sync with `SUPPORTED_LOCALES`.
import '@formatjs/intl-pluralrules/locale-data/de.js';
import '@formatjs/intl-pluralrules/locale-data/en.js';
import '@formatjs/intl-pluralrules/locale-data/es.js';
import '@formatjs/intl-pluralrules/locale-data/fr.js';
