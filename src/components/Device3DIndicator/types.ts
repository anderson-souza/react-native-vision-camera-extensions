/**
 * TypeScript API Contract for Device3DIndicator Component
 *
 * This file defines the public interface for the 3D Device Angle Indicator component.
 * All types are exported from the main library entry point.
 *
 * @packageDocumentation
 */

import type { TextStyle, ViewStyle } from 'react-native';

// ============================================================================
// PUBLIC TYPES
// ============================================================================

/**
 * Orientation state representing device rotation in 3D space
 *
 * @public
 */
export interface OrientationState {
  /**
   * Pitch angle (forward/backward tilt) in degrees
   * @range -180 to 180
   * @example 0 = vertical, +45 = tilted forward, -45 = tilted backward
   */
  pitch: number;

  /**
   * Roll angle (left/right tilt) in degrees
   * @range -180 to 180
   * @example 0 = upright, +90 = tilted right, -90 = tilted left
   */
  roll: number;

  /**
   * Yaw angle (compass rotation) in degrees
   * @range -180 to 180
   * @remarks May drift over time without magnetometer calibration
   */
  yaw: number;

  /**
   * Timestamp when orientation was measured
   * @remarks Milliseconds since Unix epoch
   */
  timestamp: number;
}

/**
 * Target orientation type for alignment detection
 *
 * @public
 */
export type TargetOrientation = 'portrait' | 'landscape';

/**
 * Component properties for Device3DIndicator
 *
 * @public
 */
export interface Device3DIndicatorProps {
  // ========================================
  // Visual Customization
  // ========================================

  /**
   * Color of the 3D device model when not aligned
   * @defaultValue '#FFFFFF'
   * @example '#4A90E2' - iOS blue
   */
  modelColor?: string;

  /**
   * Color of the 3D device model when aligned to target orientation
   * @defaultValue '#00FF00'
   * @example '#32CD32' - Lime green
   */
  alignedColor?: string;

  /**
   * Size of the 3D device model
   * @defaultValue 120
   * @example 150 - larger model
   * @example '40%' - percentage of container width
   */
  modelSize?: number | string;

  /**
   * Whether to display dynamic shadow based on device tilt
   * @defaultValue true
   * @remarks Shadow moves opposite to tilt direction for depth perception
   */
  showShadow?: boolean;

  /**
   * Color of the shadow effect
   * @defaultValue '#000000'
   */
  shadowColor?: string;

  // ========================================
  // Alignment Detection
  // ========================================

  /**
   * Target orientation to detect alignment for
   * @defaultValue 'portrait'
   * @example 'landscape' - detect when device is in landscape mode
   */
  targetOrientation?: TargetOrientation;

  /**
   * Maximum angular distance (degrees) to consider "aligned"
   * @defaultValue 2
   * @range 0.1 to 45
   * @remarks Lower values require more precise alignment
   * @example 1 - strict alignment, 5 - lenient alignment
   */
  alignmentTolerance?: number;

  // ========================================
  // Numeric Display (User Story 3 - P3)
  // ========================================

  /**
   * Whether to display numeric angle values (pitch, roll, yaw)
   * @defaultValue false
   * @remarks Useful for technical applications or debugging
   */
  showAngles?: boolean;

  /**
   * Custom text style for angle display
   * @defaultValue undefined (uses default monospace style)
   */
  angleTextStyle?: TextStyle;

  /**
   * Format for angle display
   * @defaultValue 'degrees'
   * @remarks 'radians' option for scientific applications
   */
  angleFormat?: 'degrees' | 'radians';

  /**
   * Precision (decimal places) for angle values
   * @defaultValue 1
   * @range 0 to 3
   * @example 0 - integer angles, 2 - two decimal places
   */
  anglePrecision?: number;

  // ========================================
  // Performance Tuning
  // ========================================

  /**
   * Sensor update interval in milliseconds
   * @defaultValue 33 (approximately 30 FPS)
   * @range 8 to 100
   * @remarks Lower values = smoother animation but higher battery usage
   * @example 16 - 60 FPS, 50 - 20 FPS
   */
  updateInterval?: number;

  /**
   * Whether the component is enabled and processing sensor data
   * @defaultValue true
   * @remarks Set to false to pause sensor updates when component is off-screen
   */
  enabled?: boolean;

  // ========================================
  // Callbacks
  // ========================================

  /**
   * Callback invoked when device orientation changes
   * @param orientation - Current orientation state
   * @remarks Throttled by orientationChangeThrottleMs to prevent excessive calls
   * @example
   * ```tsx
   * <Device3DIndicator
   *   onOrientationChange={({ pitch, roll, yaw }) => {
   *     console.log(`Pitch: ${pitch}° Roll: ${roll}° Yaw: ${yaw}°`);
   *   }}
   * />
   * ```
   */
  onOrientationChange?: (orientation: OrientationState) => void;

  /**
   * Callback invoked when alignment state changes
   * @param isAligned - Whether device is now aligned to target orientation
   * @remarks Only called on state transitions (not on every update)
   * @example
   * ```tsx
   * <Device3DIndicator
   *   onAlignmentChange={(aligned) => {
   *     if (aligned) {
   *       console.log('Device is level!');
   *       Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
   *     }
   *   }}
   * />
   * ```
   */
  onAlignmentChange?: (isAligned: boolean) => void;

  /**
   * Throttle interval for onOrientationChange callback in milliseconds
   * @defaultValue 100
   * @range 0 to 1000
   * @remarks Higher values reduce callback frequency and JS thread overhead
   * @example 200 - callback at most every 200ms (5 Hz)
   */
  orientationChangeThrottleMs?: number;

  // ========================================
  // Layout
  // ========================================

  /**
   * Custom style for the container view
   * @defaultValue undefined
   * @example
   * ```tsx
   * <Device3DIndicator
   *   style={{ position: 'absolute', top: 50, right: 20 }}
   * />
   * ```
   */
  style?: ViewStyle;

  /**
   * Accessibility label for screen readers
   * @defaultValue 'Device orientation indicator'
   */
  accessibilityLabel?: string;
}

// ============================================================================
// INTERNAL TYPES (not exported from main library)
// ============================================================================

/**
 * Quaternion representation for rotation calculations
 * @internal
 */
export interface Quaternion {
  w: number; // Real component
  x: number; // i component
  y: number; // j component
  z: number; // k component
}

/**
 * Euler angles representation (same as OrientationState)
 * @internal
 */
export type EulerAngles = OrientationState;

/**
 * Alignment state for internal tracking
 * @internal
 */
export interface AlignmentState {
  isAligned: boolean;
  targetOrientation: TargetOrientation;
  tolerance: number;
  deviationAngle: number;
  lastTransitionTime: number;
}

/**
 * Hysteresis configuration for alignment detection
 * @internal
 */
export interface HysteresisConfig {
  enterThreshold: number;
  exitThreshold: number;
  minStableDurationMs: number;
  smoothingFactor: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Default prop values
 * @public
 */
export const DEFAULT_PROPS = {
  modelColor: '#FFFFFF',
  alignedColor: '#00FF00',
  modelSize: 120,
  showShadow: true,
  shadowColor: '#000000',
  targetOrientation: 'portrait' as TargetOrientation,
  alignmentTolerance: 2,
  showAngles: false,
  angleFormat: 'degrees' as const,
  anglePrecision: 1,
  updateInterval: 33, // ~30 FPS
  enabled: true,
  orientationChangeThrottleMs: 100,
  accessibilityLabel: 'Device orientation indicator',
} as const;

/**
 * Hysteresis multiplier for exit threshold
 * @remarks Exit threshold = enterThreshold × this value
 * @internal
 */
export const HYSTERESIS_MULTIPLIER = 2.0;

/**
 * Minimum stable duration before alignment state change (ms)
 * @internal
 */
export const MIN_STABLE_DURATION_MS = 150;

/**
 * Exponential moving average smoothing factor
 * @remarks 0 = no smoothing, 1 = no memory
 * @internal
 */
export const SMOOTHING_FACTOR = 0.2;

// ============================================================================
// VALIDATION CONSTRAINTS
// ============================================================================

/**
 * Validation constraints for prop values
 * @internal
 */
export const VALIDATION = {
  alignmentTolerance: {
    min: 0.1,
    max: 45,
  },
  updateInterval: {
    min: 8, // Max 120 FPS
    max: 100, // Min 10 FPS
  },
  orientationChangeThrottleMs: {
    min: 0,
    max: 1000,
  },
  anglePrecision: {
    min: 0,
    max: 3,
  },
} as const;

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Required props (none - all props are optional with defaults)
 */
export type RequiredProps = {};

/**
 * Optional props
 */
export type OptionalProps = Device3DIndicatorProps;

/**
 * Props with defaults applied
 */
export type PropsWithDefaults = Required<
  Pick<
    Device3DIndicatorProps,
    | 'modelColor'
    | 'alignedColor'
    | 'modelSize'
    | 'showShadow'
    | 'shadowColor'
    | 'targetOrientation'
    | 'alignmentTolerance'
    | 'showAngles'
    | 'angleFormat'
    | 'anglePrecision'
    | 'updateInterval'
    | 'enabled'
    | 'orientationChangeThrottleMs'
    | 'accessibilityLabel'
  >
> &
  Omit<
    Device3DIndicatorProps,
    | 'modelColor'
    | 'alignedColor'
    | 'modelSize'
    | 'showShadow'
    | 'shadowColor'
    | 'targetOrientation'
    | 'alignmentTolerance'
    | 'showAngles'
    | 'angleFormat'
    | 'anglePrecision'
    | 'updateInterval'
    | 'enabled'
    | 'orientationChangeThrottleMs'
    | 'accessibilityLabel'
  >;

// ============================================================================
// EXPORTS FOR LIBRARY
// ============================================================================

/**
 * Public exports from react-native-vision-camera-extensions
 *
 * @example
 * ```tsx
 * import {
 *   Device3DIndicator,
 *   Device3DIndicatorProps,
 *   OrientationState,
 * } from 'react-native-vision-camera-extensions';
 * ```
 */
export type {
  Device3DIndicatorProps as Device3DIndicatorProps,
  OrientationState as OrientationState,
  TargetOrientation as TargetOrientation,
};
