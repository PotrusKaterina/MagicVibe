import { useEffect } from 'react';

import { useUserStore } from '@/store/user-store';

/**
 * The web store sets `skipHydration`, so the first client render matches the
 * statically rendered HTML. sessionStorage is synchronous, which means hydrating
 * on creation would both run the rehydrate callback before `useUserStore` is
 * assigned and desync that first render — so it is kicked off after mount.
 */
export function useHydrateUserStore() {
  useEffect(() => {
    useUserStore.persist.rehydrate();
  }, []);
}
