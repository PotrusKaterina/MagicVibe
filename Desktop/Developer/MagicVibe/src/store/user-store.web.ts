import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { WATCHES, type WatchId } from '@/models/watch';

type UserState = {
  name: string;
  balance: number;
  /**
   * Watches won so far, oldest first. Ids rather than whole objects, so the
   * persisted payload stays small and never goes stale against the catalogue.
   * Duplicates are meaningful: the same watch can be won more than once.
   */
  ownedWatchIds: WatchId[];
  /** False until the persisted state has been read back from storage. */
  hasHydrated: boolean;
  setName: (name: string) => void;
  setBalance: (balance: number) => void;
  /**
   * Spends `price` and records the watch it bought, and reports whether it
   * went through. Both halves happen in one `set`: a purchase that debited the
   * balance without handing over the watch would lose the user's money.
   */
  purchase: (price: number, watchId: WatchId) => boolean;
  /**
   * Sells the owned watch at `index`, crediting its catalogue price. Indexed
   * rather than keyed by id because the same watch can be owned twice and only
   * one of them is being sold. The price is looked up here rather than passed
   * in, so a caller cannot name its own figure.
   */
  sellWatch: (index: number) => boolean;
  clearName: () => void;
  clearBalance: () => void;
  clearStore: () => void;
};

const initialState = {
  name: '',
  balance: 100,
  ownedWatchIds: [] as WatchId[],
  hasHydrated: false,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initialState,
      setName: (name) => set({ name: name.trim() }),
      setBalance: (balance) => set({ balance: balance }),
      purchase: (price, watchId) => {
        let purchased = false;
        set((state) => {
          if (price > state.balance) {
            return {};
          }
          purchased = true;
          return {
            balance: state.balance - price,
            ownedWatchIds: [...state.ownedWatchIds, watchId],
          };
        });
        return purchased;
      },
      sellWatch: (index) => {
        let sold = false;
        set((state) => {
          const watchId = state.ownedWatchIds[index];
          if (watchId == null) {
            return {};
          }
          sold = true;
          return {
            balance: state.balance + WATCHES[watchId].price,
            ownedWatchIds: state.ownedWatchIds.filter((_unused, at) => at !== index),
          };
        });
        return sold;
      },
      clearName: () => set({ name: '' }),
      clearBalance: () => set({ balance: 100 }),
      // `hasHydrated` is deliberately left alone: rehydration only runs once per
      // session, so resetting it would leave the gate stuck on the splash screen.
      clearStore: () => set({ ...initialState, hasHydrated: true }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => sessionStorage),
      // sessionStorage is synchronous, so hydrating on creation would run the
      // rehydrate callback below while `useUserStore` is still uninitialised, and
      // would make the first client render disagree with the statically rendered
      // HTML. `useHydrateUserStore` starts hydration after mount instead.
      skipHydration: true,
      // `hasHydrated` describes this session, so it must not be written to storage.
      partialize: ({ name, balance, ownedWatchIds }) => ({ name, balance, ownedWatchIds }),
      // Runs after rehydration finishes, including when it fails — the gate must
      // never stay stuck on the splash screen.
      onRehydrateStorage: () => () => {
        useUserStore.setState({ hasHydrated: true });
      },
    }
  )
);
