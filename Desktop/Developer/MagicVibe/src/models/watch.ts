/**
 * The four watches shipped with the assignment. Names are mock product names —
 * proper nouns, so they stay out of the i18n catalogue.
 */
export const WATCH_IDS = ['casio', 'gmt', 'perpetual', 'sky-dweller'] as const;

export type WatchId = (typeof WATCH_IDS)[number];

export type Watch = {
  id: WatchId;
  name: string;
  /**
   * What the watch is worth, in the same virtual currency as the balance. This
   * is the watch's own value, not what any particular box cost — the gamble is
   * precisely that the two differ.
   */
  price: number;
  /** Metro asset id from `require()`, which is what expo-image's `source` takes. */
  image: number;
};

/**
 * Keyed by id so a persisted collection can store ids rather than whole
 * objects, and Metro can still resolve every `require()` statically.
 */
export const WATCHES: Record<WatchId, Watch> = {
  casio: {
    id: 'casio',
    name: 'Casio',
    price: 25,
    image: require('@/assets/watches/casio.png'),
  },
  gmt: {
    id: 'gmt',
    name: 'GMT',
    price: 90,
    image: require('@/assets/watches/gmt.png'),
  },
  perpetual: {
    id: 'perpetual',
    name: 'Perpetual',
    price: 180,
    image: require('@/assets/watches/perpetual.png'),
  },
  'sky-dweller': {
    id: 'sky-dweller',
    name: 'Sky-Dweller',
    price: 400,
    image: require('@/assets/watches/sky-dweller.png'),
  },
};

export const ALL_WATCHES: readonly Watch[] = WATCH_IDS.map((id) => WATCHES[id]);
