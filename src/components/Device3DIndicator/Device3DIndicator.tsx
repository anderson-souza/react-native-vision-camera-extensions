/**
 * Device3DIndicator - Main component for 3D device orientation visualization
 * Displays real-time device orientation with optional alignment detection and numeric display
 */

import React, { memo, useMemo } from 'react';
import { View, Text } from 'react-native';
import {
  useSharedValue,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import type {
  Device3DIndicatorProps,
  OrientationState,
  Quaternion,
} from './types';
import { useOrientationSensor } from './useOrientationSensor';
import { Device3DModel } from './Device3DModel';
import { createAlignmentDetector } from './AlignmentDetector';
import {
  quaternionAngularDistance,
  formatAngle,
} from './OrientationCalculator';
import {
  DEFAULT_MODEL_COLOR,
  DEFAULT_ALIGNED_COLOR,
  DEFAULT_MODEL_SIZE,
  DEFAULT_SHOW_SHADOW,
  DEFAULT_SHADOW_COLOR,
  DEFAULT_TARGET_ORIENTATION,
  DEFAULT_ALIGNMENT_TOLERANCE,
  DEFAULT_ALIGNMENT_EXIT_MULTIPLIER,
  DEFAULT_MIN_STABLE_DURATION_MS,
  DEFAULT_SHOW_ANGLES,
  DEFAULT_ANGLE_PRECISION,
  DEFAULT_ANGLE_FORMAT,
  DEFAULT_UPDATE_INTERVAL,
  DEFAULT_ENABLED,
  DEFAULT_ORIENTATION_CHANGE_THROTTLE_MS,
  PORTRAIT_REFERENCE,
  LANDSCAPE_RIGHT_REFERENCE,
} from './constants';
import { styles } from './styles';

/**
 * Device3DIndicator Component
 *
 * Displays a 3D visualization of device orientation that updates in real-time.
 * Supports alignment detection and optional numeric angle display.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Device3DIndicator />
 *
 * // With alignment detection
 * <Device3DIndicator
 *   alignedColor="#00FF00"
 *   onAlignmentChange={(aligned) => console.log('Aligned:', aligned)}
 * />
 *
 * // With numeric display
 * <Device3DIndicator
 *   showAngles={true}
 *   anglePrecision={1}
 * />
 * ```
 */
export const Device3DIndicator = memo<Device3DIndicatorProps>(
  ({
    // Visual customization
    modelColor = DEFAULT_MODEL_COLOR,
    alignedColor = DEFAULT_ALIGNED_COLOR,
    modelSize = DEFAULT_MODEL_SIZE,
    showShadow = DEFAULT_SHOW_SHADOW,
    shadowColor = DEFAULT_SHADOW_COLOR,

    // Alignment detection
    targetOrientation = DEFAULT_TARGET_ORIENTATION,
    alignmentTolerance = DEFAULT_ALIGNMENT_TOLERANCE,

    // Numeric display
    showAngles = DEFAULT_SHOW_ANGLES,
    angleTextStyle,
    angleFormat = DEFAULT_ANGLE_FORMAT,
    anglePrecision = DEFAULT_ANGLE_PRECISION,

    // Performance tuning
    updateInterval = DEFAULT_UPDATE_INTERVAL,
    enabled = DEFAULT_ENABLED,

    // Callbacks
    onOrientationChange,
    onAlignmentChange,
    orientationChangeThrottleMs = DEFAULT_ORIENTATION_CHANGE_THROTTLE_MS,

    // Layout
    style,
    accessibilityLabel = 'Device orientation indicator',
  }) => {
    // Parse model size (support both number and percentage string)
    const numericSize = useMemo(() => {
      if (typeof modelSize === 'number') {
        return modelSize;
      }
      // For percentage strings, would need parent size - default to DEFAULT_MODEL_SIZE
      return DEFAULT_MODEL_SIZE;
    }, [modelSize]);

    // Get reference quaternion for alignment detection
    const referenceQuaternion = useMemo(() => {
      return targetOrientation === 'portrait'
        ? PORTRAIT_REFERENCE
        : LANDSCAPE_RIGHT_REFERENCE;
    }, [targetOrientation]);

    // Create alignment detector with hysteresis
    const alignmentDetector = useMemo(() => {
      return createAlignmentDetector({
        enterThreshold: alignmentTolerance,
        exitThreshold: alignmentTolerance * DEFAULT_ALIGNMENT_EXIT_MULTIPLIER,
        minStableDurationMs: DEFAULT_MIN_STABLE_DURATION_MS,
      });
    }, [alignmentTolerance]);

    // Shared value for alignment state
    const isAligned = useSharedValue(false);

    // Use orientation sensor hook
    const { orientation, quaternion, animatedOrientation } =
      useOrientationSensor({
        updateInterval,
        enabled,
        onOrientationChange: (orient: OrientationState) => {
          'worklet';
          // Calculate alignment
          const distance = quaternionAngularDistance(
            quaternion as Quaternion,
            referenceQuaternion
          );

          const alignmentState = alignmentDetector.check(
            distance,
            orient.timestamp
          );

          // Update alignment state
          const wasAligned = isAligned.value;
          isAligned.value = alignmentState.isAligned;

          // Trigger callbacks
          if (onOrientationChange) {
            onOrientationChange(orient);
          }

          if (onAlignmentChange && wasAligned !== alignmentState.isAligned) {
            onAlignmentChange(alignmentState.isAligned);
          }
        },
        orientationChangeThrottleMs,
      });

    // Animated color based on alignment
    const currentColor = useDerivedValue(() => {
      'worklet';
      return withTiming(isAligned.value ? alignedColor : modelColor, {
        duration: 300,
      });
    });

    return (
      <View
        style={[styles.container, style]}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="image"
      >
        {/* 3D Device Model */}
        <Device3DModel
          pitch={animatedOrientation.pitch}
          roll={animatedOrientation.roll}
          yaw={animatedOrientation.yaw}
          size={numericSize}
          currentColor={currentColor.value}
          showShadow={showShadow}
          shadowColor={shadowColor}
        />

        {/* Optional Numeric Angle Display */}
        {showAngles && (
          <View style={styles.angleTextContainer}>
            <View style={styles.angleRow}>
              <Text
                style={[styles.angleText, styles.angleLabel, angleTextStyle]}
              >
                P:
              </Text>
              <Text style={[styles.angleText, angleTextStyle]}>
                {formatAngle(orientation.pitch, anglePrecision, angleFormat)}
              </Text>
            </View>
            <View style={styles.angleRow}>
              <Text
                style={[styles.angleText, styles.angleLabel, angleTextStyle]}
              >
                R:
              </Text>
              <Text style={[styles.angleText, angleTextStyle]}>
                {formatAngle(orientation.roll, anglePrecision, angleFormat)}
              </Text>
            </View>
            <View style={styles.angleRow}>
              <Text
                style={[styles.angleText, styles.angleLabel, angleTextStyle]}
              >
                Y:
              </Text>
              <Text style={[styles.angleText, angleTextStyle]}>
                {formatAngle(orientation.yaw, anglePrecision, angleFormat)}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  }
);

Device3DIndicator.displayName = 'Device3DIndicator';
