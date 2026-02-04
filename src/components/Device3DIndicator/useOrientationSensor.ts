/**
 * Custom hook for device orientation sensing using React Native Reanimated
 * Provides pitch, roll, yaw angles from device sensors
 */

'use strict';

import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedSensor,
  SensorType,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import type { OrientationState, Quaternion } from './types';
import {
  quaternionToEuler,
  isValidSensorReading,
} from './OrientationCalculator';
import {
  DEFAULT_UPDATE_INTERVAL,
  DEFAULT_ORIENTATION_CHANGE_THROTTLE_MS,
} from './constants';

export interface UseOrientationSensorConfig {
  updateInterval?: number;
  enabled?: boolean;
  onOrientationChange?: (orientation: OrientationState) => void;
  orientationChangeThrottleMs?: number;
}

export interface UseOrientationSensorReturn {
  orientation: OrientationState;
  quaternion: Quaternion;
  animatedOrientation: {
    pitch: any; // SharedValue
    roll: any;
    yaw: any;
  };
  config: {
    enabled: boolean;
    updateInterval: number;
  };
}

/**
 * Hook for accessing device orientation from sensors
 *
 * @param config - Configuration options
 * @returns Orientation data and animated values
 *
 * @example
 * ```tsx
 * const { orientation, animatedOrientation } = useOrientationSensor({
 *   updateInterval: 33, // 30 FPS
 *   enabled: true,
 *   onOrientationChange: (orient) => {
 *     console.log(`Pitch: ${orient.pitch}°`);
 *   },
 * });
 * ```
 */
export function useOrientationSensor(
  config: UseOrientationSensorConfig = {}
): UseOrientationSensorReturn {
  const {
    updateInterval = DEFAULT_UPDATE_INTERVAL,
    enabled = true,
    onOrientationChange,
    orientationChangeThrottleMs = DEFAULT_ORIENTATION_CHANGE_THROTTLE_MS,
  } = config;

  // Animated shared values for real-time orientation
  const pitch = useSharedValue(0);
  const roll = useSharedValue(0);
  const yaw = useSharedValue(0);

  // Internal state tracking
  const lastCallbackTime = useSharedValue(0);

  // Quaternion state
  const qw = useSharedValue(1); // Identity quaternion
  const qx = useSharedValue(0);
  const qy = useSharedValue(0);
  const qz = useSharedValue(0);

  // Initialize sensor
  const sensor = useAnimatedSensor(SensorType.ROTATION, {
    interval: updateInterval,
  });

  // Process sensor updates
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const intervalId = setInterval(() => {
      'worklet';
      try {
        const sensorValue = sensor.sensor.value;

        // Validate sensor data
        if (
          !sensorValue ||
          !isValidSensorReading(
            sensorValue.pitch || 0,
            sensorValue.roll || 0,
            sensorValue.yaw || 0
          )
        ) {
          return;
        }

        // Update quaternion
        qw.value = sensorValue.qw || 1;
        qx.value = sensorValue.qx || 0;
        qy.value = sensorValue.qy || 0;
        qz.value = sensorValue.qz || 0;

        // Convert quaternion to Euler angles
        const quaternion: Quaternion = {
          w: qw.value,
          x: qx.value,
          y: qy.value,
          z: qz.value,
        };

        const euler = quaternionToEuler(quaternion);

        // Update animated values with smooth timing
        pitch.value = withTiming(euler.pitch, { duration: updateInterval });
        roll.value = withTiming(euler.roll, { duration: updateInterval });
        yaw.value = withTiming(euler.yaw, { duration: updateInterval });

        // Throttled callback to JS thread
        if (onOrientationChange) {
          const now = Date.now();
          if (now - lastCallbackTime.value >= orientationChangeThrottleMs) {
            lastCallbackTime.value = now;
            runOnJS(onOrientationChange)({
              pitch: euler.pitch,
              roll: euler.roll,
              yaw: euler.yaw,
              timestamp: euler.timestamp,
            });
          }
        }
      } catch (error) {
        // Silently handle errors to prevent crashes
        console.warn('Orientation sensor error:', error);
      }
    }, updateInterval);

    return () => clearInterval(intervalId);
  }, [
    enabled,
    updateInterval,
    onOrientationChange,
    orientationChangeThrottleMs,
    sensor,
    pitch,
    roll,
    yaw,
    qw,
    qx,
    qy,
    qz,
    lastCallbackTime,
  ]);

  // Return current values (non-reactive, for initial render)
  return {
    orientation: {
      pitch: pitch.value,
      roll: roll.value,
      yaw: yaw.value,
      timestamp: Date.now(),
    },
    quaternion: {
      w: qw.value,
      x: qx.value,
      y: qy.value,
      z: qz.value,
    },
    animatedOrientation: {
      pitch,
      roll,
      yaw,
    },
    config: {
      enabled,
      updateInterval,
    },
  };
}
