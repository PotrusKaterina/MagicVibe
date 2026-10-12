import { ALL_WATCHES, type Watch } from './watch';

export type Box = {
  id: string;
  /**
   * What the box costs. Named `price` rather than `balance` so it never reads
   * as the user's wallet — `useUserStore().balance` is what this is paid from.
   */
  price: number;
  /** The watch sealed inside. Known up front, shown only once the box opens. */
  watch: Watch;
};

/**
 * Prices land on a round step so a randomly generated catalogue still looks
 * authored. The range is scaled to the starting balance of 100, so the first
 * session can afford a few boxes.
 */
const PRICE_MIN = 20;
const PRICE_MAX = 120;
const PRICE_STEP = 5;

function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function randomPrice(): number {
  const steps = (PRICE_MAX - PRICE_MIN) / PRICE_STEP;
  return PRICE_MIN + randomInt(0, steps) * PRICE_STEP;
}

function randomWatch(): Watch {
  return ALL_WATCHES[randomInt(0, ALL_WATCHES.length - 1)];
}

/**
 * Builds a catalogue, giving every box a random watch and a random price.
 *
 * This is not referentially stable — calling it twice returns a different
 * catalogue. Call it once, behind the mock API or a store, never during render.
 */
export function createBoxes(count: number): Box[] {
  return Array.from({ length: count }, (_unused, index) => ({
    id: `box-${index + 1}`,
    price: randomPrice(),
    watch: randomWatch(),
  }));
}
