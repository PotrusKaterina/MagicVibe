import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import {
  Camera,
  DefaultLight,
  EntitySelector,
  FilamentScene,
  FilamentView,
  Model,
  type Float3,
} from 'react-native-filament';

import boxSource from '@/assets/box/designer-box-2-v1-icy.glb';

/**
 * Orbit describing the three-quarter view in assets/box/reference.png.
 * `transformToUnitCube` normalises the model (Y-up, base at Y = 0, ~1.12 units
 * tall per assets/box/MODEL.md) into a unit cube at the origin, so these are
 * independent of the authored scale.
 *
 * ORBIT_DISTANCE is the one knob for how large the box reads. Because the
 * camera keeps this exact distance from the origin at every yaw, the box cannot
 * grow out of frame as it turns — only the silhouette changes, and a cube is
 * widest across its diagonal. Calibrated against a screenshot rather than from
 * the lens maths, which did not match what filament actually rendered.
 */
const ORBIT_DISTANCE = 5.2;
/** Keeps the camera a little above the box, as in the reference. */
const ORBIT_ELEVATION_RATIO = 0.44;
const ORBIT_HEIGHT = ORBIT_DISTANCE * ORBIT_ELEVATION_RATIO;
const ORBIT_RADIUS = Math.sqrt(ORBIT_DISTANCE ** 2 - ORBIT_HEIGHT ** 2);

/** 36°, the angle that reproduces the reference framing at rest. */
export const INITIAL_YAW = 0.628;

/** A full drag across ~320pt takes the box once around. */
export const RADIANS_PER_POINT = (2 * Math.PI) / 320;

/**
 * Hinge authored into the model (assets/box/MODEL.md): the lid turns about the
 * +X axis through this point, from 0° closed to +115° fully open. The file
 * contains no animation clip, so the timing below is ours.
 */
const HINGE_PIVOT: Float3 = [0, 0.914876, 0.359181];
const LID_OPEN_ANGLE = (115 * Math.PI) / 180;
/** Exported so a reveal can wait for the lid instead of racing it. */
export const LID_DURATION_MS = 450;

/**
 * The moving parts are separate top-level nodes whose own origins are *not* the
 * hinge, so a plain `rotate` would swing them about the model origin. filament
 * composes transforms as translate ∘ rotate ∘ scale, and rotating about a pivot
 * `p` is `T(p) · R · T(-p)`, whose translation component is `p - R·p` — so the
 * pair below is exactly a hinge rotation.
 */
function hingeTransform(angle: number): { rotate: Float3; translate: Float3 } {
  const [, pivotY, pivotZ] = HINGE_PIVOT;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return {
    rotate: [angle, 0, 0],
    translate: [0, pivotY - (pivotY * cos - pivotZ * sin), pivotZ - (pivotY * sin + pivotZ * cos)],
  };
}

/** Eased lid angle in radians. Driven on the JS thread, like the drag. */
function useLidAngle(isOpen: boolean) {
  const [angle, setAngle] = useState(0);
  // Lets an interrupted animation resume from wherever the lid currently is.
  const currentAngle = useRef(0);

  useEffect(() => {
    const from = currentAngle.current;
    const to = isOpen ? LID_OPEN_ANGLE : 0;
    if (from === to) {
      return;
    }

    let frame: number;
    let startedAt: number | undefined;

    const step = (now: number) => {
      startedAt ??= now;
      const progress = Math.min(1, (now - startedAt) / LID_DURATION_MS);
      // easeInOutCubic
      const eased =
        progress < 0.5
          ? 4 * progress ** 3
          : 1 - (-2 * progress + 2) ** 3 / 2;

      currentAngle.current = from + (to - from) * eased;
      setAngle(currentAngle.current);

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  return angle;
}

type MysteryBoxProps = {
  style?: ViewStyle;
  /**
   * Controlled, because opening is a purchase: the catalogue keeps every box
   * shut and only the paid-for reveal flips this.
   */
  isOpen?: boolean;
  /**
   * Also controlled. The gesture lives with whoever owns the box, so that a
   * drag and a tap are decided by one responder instead of two competing ones.
   */
  yaw?: number;
};

function BoxScene({ style, yaw, lidAngle }: MysteryBoxProps & { yaw: number; lidAngle: number }) {
  const hinge = hingeTransform(lidAngle);

  return (
    <FilamentView style={StyleSheet.flatten([styles.view, style])}>
      <DefaultLight />
      <Model source={boxSource} transformToUnitCube>
        {/*
          <EntitySelector> resolves a glTF node by name and must live inside
          <Model>. `multiplyWithCurrentTransform={false}` because the angle is
          absolute — otherwise every frame would compound onto the last.
          The wordmark is glued to the lid, so it gets the same hinge.
        */}
        <EntitySelector byName="Shell_Lid" {...hinge} multiplyWithCurrentTransform={false} />
        <EntitySelector byName="Shell_Wordmark" {...hinge} multiplyWithCurrentTransform={false} />
      </Model>
      {/*
        The camera orbits the model rather than the model spinning in place:
        that leaves `transformToUnitCube` as the only transform on the root, so
        framing, spin and the hinge cannot fight each other.
      */}
      <Camera
        cameraPosition={[Math.sin(yaw) * ORBIT_RADIUS, ORBIT_HEIGHT, Math.cos(yaw) * ORBIT_RADIUS]}
        cameraTarget={[0, 0, 0]}
      />
    </FilamentView>
  );
}

export function MysteryBox({ style, isOpen = false, yaw = INITIAL_YAW }: MysteryBoxProps) {
  const lidAngle = useLidAngle(isOpen);

  return (
    <View style={styles.container}>
      <FilamentScene>
        <BoxScene style={style} yaw={yaw} lidAngle={lidAngle} />
      </FilamentScene>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 250,
    width: '100%',
  },
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
