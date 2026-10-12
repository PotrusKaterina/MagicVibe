import type { MessageFormatElement } from 'react-intl';

import type { AppLocale } from './config';

import de from './compiled-lang/de.json';
import en from './compiled-lang/en.json';
import es from './compiled-lang/es.json';
import fr from './compiled-lang/fr.json';

/**
 * Ids in the compiled English catalogue. Everything under `compiled-lang/` is
 * generated — run `npm run extract` then `npm run compile-folder` after
 * adding or editing any message descriptor.
 */
export type MessageId = keyof typeof en;

export type CompiledCatalog = Record<MessageId, MessageFormatElement[]>;

/**
 * Typed as a complete record per locale, so a translation that misses a key
 * fails `tsc` instead of silently falling back at runtime.
 */
const RAW_CATALOGS: Record<AppLocale, Record<MessageId, unknown>> = { de, en, es, fr };

/**
 * `compile --ast` emits plain JSON, so TypeScript widens each element's
 * discriminant (`"type": 0`) to `number` and cannot line it up with the
 * `MessageFormatElement` union. The shape is guaranteed by the compiler.
 */
export const CATALOGS = RAW_CATALOGS as Record<AppLocale, CompiledCatalog>;
