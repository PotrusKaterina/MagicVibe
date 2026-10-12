import {Image} from 'expo-image';
import {useEffect, useState} from 'react';
import {FormattedNumber} from 'react-intl';
import {PanResponder, StyleSheet, View} from 'react-native';

import {
  INITIAL_YAW,
  LID_DURATION_MS,
  MysteryBox,
  RADIANS_PER_POINT,
} from '@/components/mystery-box';
import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {Spacing} from '@/constants/theme';
import type {Box} from '@/models/box';
import {useUserStore} from '@/store/user-store';

/** A release that moved less than this counts as a tap, not a drag. */
const TAP_SLOP_POINTS = 6;

type BoxCardProps = {
  box: Box;
};

/**
 * Catalogue entry. While shut, `box.watch` is never rendered — the content is
 * what you are paying to find out. Tapping buys and opens; dragging spins.
 */
export const BoxCard = ({box}: BoxCardProps) => {
  const balance = useUserStore((state) => state.balance);
  const purchase = useUserStore((state) => state.purchase);

  const [isOpen, setIsOpen] = useState(false);
  const [yaw, setYaw] = useState(INITIAL_YAW);
  // Separate from `isOpen` so the watch appears once the lid has swung away,
  // rather than through a box that is still closed.
  const [isRevealed, setIsRevealed] = useState(false);

  const canAfford = balance >= box.price;

  useEffect(() => {
    // A bought box never shuts again, so this only ever runs forward — no
    // reset branch, which would mean setting state synchronously in an effect.
    if (!isOpen) {
      return;
    }

    const timer = setTimeout(() => setIsRevealed(true), LID_DURATION_MS);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Lazy initial state rather than useMemo: this must be created exactly once,
  // and useMemo is only a hint. Everything mutable lives in the responder's own
  // closure, so nothing reads mutable state during render.
  const [panResponder] = useState(() => {
    let settledYaw = INITIAL_YAW;
    let opened = false;

    // One responder owns both gestures. An outer <Pressable> plus this would be
    // two responders negotiating for the same touch, and the Pressable wins the
    // moment it is enabled — which left closed boxes unable to rotate at all.
    //
    // PanResponder also runs entirely on the JS thread. gesture-handler would
    // route these through Reanimated worklets, and filament expects
    // react-native-worklets-core — a mix this project has not resolved.
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_event, gesture) => setYaw(settledYaw + gesture.dx * RADIANS_PER_POINT),
      onPanResponderRelease: (_event, gesture) => {
        settledYaw += gesture.dx * RADIANS_PER_POINT;

        const isTap =
          Math.abs(gesture.dx) < TAP_SLOP_POINTS && Math.abs(gesture.dy) < TAP_SLOP_POINTS;
        if (!isTap || opened) {
          return;
        }

        // `purchase` checks affordability, deducts and records the watch inside
        // one store update, so nothing here may touch the balance itself.
        if (purchase(box.price, box.watch.id)) {
          opened = true;
          setIsOpen(true);
        }
      },
      onPanResponderTerminate: (_event, gesture) => {
        settledYaw += gesture.dx * RADIANS_PER_POINT;
      },
    });
  });

  return (
    <ThemedView
      type="backgroundElement"
      style={[styles.card, !isOpen && !canAfford && styles.unaffordable]}>
      <View style={styles.stage} {...panResponder.panHandlers}>
        <MysteryBox isOpen={isOpen} yaw={yaw}/>
        {isRevealed && (
          // Not interactive, so dragging the box underneath still rotates it.
          <View style={styles.revealLayer} pointerEvents="none">
            <Image
              source={box.watch.image}
              style={styles.watch}
              contentFit="contain"
              transition={300}
            />
          </View>
        )}
      </View>

      <ThemedText type="subtitle">
        {isRevealed ? box.watch.name : <FormattedNumber value={box.price}/>}
      </ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.four,
    paddingBottom: Spacing.three,
    alignItems: 'center',
    overflow: 'hidden',
  },
  unaffordable: {
    opacity: 0.45,
  },
  stage: {
    width: '100%',
  },
  revealLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watch: {
    width: '55%',
    height: '80%',
  },
});
