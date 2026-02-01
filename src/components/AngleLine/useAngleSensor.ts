import { useCallback, useEffect, useRef, useState } from 'react';
import {
  useAnimatedSensor,
  useAnimatedStyle,
  SensorType,
  runOnJS,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { calculateRollAngle, isWithinThreshold } from './utils';
import {
  ANIMATION_DURATION,
  DEFAULT_ANGLE_CHANGE_THROTTLE_MS,
  ANGLE_TEXT_UPDATE_THRESHOLD,
} from './constants';
import type { UseAngleSensorReturn } from './types';

interface UseAngleSensorParams {
  updateInterval: number;
  levelThreshold: number;
  lineColor: string;
  levelIndicatorColor: string;
  enabled: boolean;
  showAngleText: boolean;
  angleChangeThrottleMs?: number;
  onAngleChange?: (angle: number) => void;
  onLevelReached?: () => void;
  onLevelLost?: () => void;
}

export function useAngleSensor({
  updateInterval,
  levelThreshold,
  lineColor,
  levelIndicatorColor,
  enabled,
  showAngleText,
  angleChangeThrottleMs = DEFAULT_ANGLE_CHANGE_THROTTLE_MS,
  onAngleChange,
  onLevelReached,
  onLevelLost,
}: UseAngleSensorParams): UseAngleSensorReturn {
  const wasLevelRef = useRef(false);
  const [angleText, setAngleText] = useState('0.0');
  const [sensorError, setSensorError] = useState<string | null>(null);

  // Shared values for throttling
  const lastCallbackTimestamp = useSharedValue(0);
  const lastDisplayedAngle = useSharedValue(0);

  const gravitySensor = useAnimatedSensor(SensorType.GRAVITY, {
    interval: updateInterval,
  });

  // Handle callbacks on JS thread with useCallback for stable references
  const handleAngleChange = useCallback(
    (angle: number) => {
      onAngleChange?.(angle);
    },
    [onAngleChange]
  );

  const handleAngleTextUpdate = useCallback((angle: number) => {
    setAngleText(angle.toFixed(1));
  }, []);

  const handleLevelReached = useCallback(() => {
    onLevelReached?.();
  }, [onLevelReached]);

  const handleLevelLost = useCallback(() => {
    onLevelLost?.();
  }, [onLevelLost]);

  const checkLevelState = useCallback(
    (isLevel: boolean) => {
      if (isLevel && !wasLevelRef.current) {
        wasLevelRef.current = true;
        handleLevelReached();
      } else if (!isLevel && wasLevelRef.current) {
        wasLevelRef.current = false;
        handleLevelLost();
      }
    },
    [handleLevelReached, handleLevelLost]
  );

  // Animated style for the rotating line
  const rotatingLineStyle = useAnimatedStyle(() => {
    if (!enabled) {
      return {
        transform: [{ rotate: '0deg' }],
        backgroundColor: lineColor,
      };
    }

    const { x, y } = gravitySensor.sensor.value;
    const angle = calculateRollAngle(x, y);
    const isLevel = isWithinThreshold(angle, levelThreshold);

    // Fire callbacks on JS thread with throttling
    if (onAngleChange) {
      const now = Date.now();
      if (now - lastCallbackTimestamp.value >= angleChangeThrottleMs) {
        lastCallbackTimestamp.value = now;
        runOnJS(handleAngleChange)(angle);
      }
    }

    // Only update text when angle changes significantly
    if (showAngleText) {
      const angleDiff = Math.abs(angle - lastDisplayedAngle.value);
      if (angleDiff >= ANGLE_TEXT_UPDATE_THRESHOLD) {
        lastDisplayedAngle.value = angle;
        runOnJS(handleAngleTextUpdate)(angle);
      }
    }

    runOnJS(checkLevelState)(isLevel);

    return {
      transform: [{ rotate: `${angle}deg` }],
      backgroundColor: withTiming(isLevel ? levelIndicatorColor : lineColor, {
        duration: ANIMATION_DURATION,
      }),
    };
  });

  // Reset level state when component unmounts or becomes disabled
  useEffect(() => {
    if (!enabled) {
      wasLevelRef.current = false;
    }
  }, [enabled]);

  // Validate sensor availability
  useEffect(() => {
    const checkSensor = setTimeout(() => {
      try {
        const sensorValue = gravitySensor.sensor.value;
        if (
          !sensorValue ||
          typeof sensorValue.x !== 'number' ||
          typeof sensorValue.y !== 'number'
        ) {
          setSensorError('Gravity sensor not available on this device');
        } else {
          setSensorError(null);
        }
      } catch (error) {
        setSensorError(
          `Sensor initialization failed: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        );
      }
    }, 100);

    return () => clearTimeout(checkSensor);
  }, [gravitySensor]);

  return {
    rotatingLineStyle,
    angleText,
    sensorError,
  };
}
