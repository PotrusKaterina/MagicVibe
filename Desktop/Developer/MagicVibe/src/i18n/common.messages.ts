import { defineMessage } from 'react-intl';

/**
 * Reused across several sections of the Explore screen. Messages used in a
 * single place are written inline at the call site instead.
 */
export const learnMoreMessage = defineMessage({
  id: 'common.learnMore',
  defaultMessage: 'Learn more',
  description: 'Link at the end of a section that opens external documentation',
});
