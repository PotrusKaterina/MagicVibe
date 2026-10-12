import { defineMessages } from 'react-intl';

/**
 * Shared by the native and web tab bars so the two platform variants extract to
 * the same ids instead of drifting apart.
 */
export const tabMessages = defineMessages({
  home: {
    id: 'tabs.home',
    defaultMessage: 'Home',
    description: 'Tab bar item that opens the main screen',
  },
  explore: {
    id: 'tabs.explore',
    defaultMessage: 'Explore',
    description: 'Tab bar item that opens the examples screen',
  },
});
