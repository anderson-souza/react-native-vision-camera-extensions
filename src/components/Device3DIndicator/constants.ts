/**
 * Constants for Device3DIndicator component
 */

import type { Quaternion } from './types';

/**
 * Default colors for the 3D device model
 */
export const DEFAULT_MODEL_COLOR = '#FFFFFF';
export const DEFAULT_ALIGNED_COLOR = '#00FF00';
export const DEFAULT_SHADOW_COLOR = '#000000';

/**
 * Default sizing and visual properties
 */
export const DEFAULT_MODEL_SIZE = 120; // pixels
export const DEFAULT_SHOW_SHADOW = true;
export const DEFAULT_SHOW_ANGLES = false;

/**
 * Default alignment detection settings
 */
export const DEFAULT_TARGET_ORIENTATION = 'portrait';
export const DEFAULT_ALIGNMENT_TOLERANCE = 2; // degrees
export const DEFAULT_ALIGNMENT_EXIT_MULTIPLIER = 2; // exitThreshold = tolerance × this value
export const DEFAULT_MIN_STABLE_DURATION_MS = 150; // milliseconds

/**
 * Default performance settings
 */
export const DEFAULT_UPDATE_INTERVAL = 33; // ~30 FPS (milliseconds)
export const DEFAULT_ORIENTATION_CHANGE_THROTTLE_MS = 100; // milliseconds
export const DEFAULT_ENABLED = true;

/**
 * Default angle display settings
 */
export const DEFAULT_ANGLE_PRECISION = 1; // decimal places
export const DEFAULT_ANGLE_FORMAT = 'degrees';

/**
 * Reference quaternions for alignment detection
 */
export const PORTRAIT_REFERENCE: Quaternion = {
  w: 1, // Identity quaternion (no rotation)
  x: 0,
  y: 0,
  z: 0,
};

export const LANDSCAPE_RIGHT_REFERENCE: Quaternion = {
  w: 0.7071067811865476, // cos(90°/2)
  x: 0,
  y: 0,
  z: 0.7071067811865476, // sin(90°/2) - rotation around Z-axis
};

export const LANDSCAPE_LEFT_REFERENCE: Quaternion = {
  w: 0.7071067811865476, // cos(-90°/2)
  x: 0,
  y: 0,
  z: -0.7071067811865476, // sin(-90°/2) - rotation around Z-axis
};

/**
 * 3D transform settings
 */
export const DEFAULT_PERSPECTIVE = 1200;

/**
 * Validation constants
 */
export const MIN_ALIGNMENT_TOLERANCE = 0.1; // degrees
export const MAX_ALIGNMENT_TOLERANCE = 45; // degrees
export const MIN_UPDATE_INTERVAL = 16; // ~60 FPS (milliseconds)
export const MAX_UPDATE_INTERVAL = 1000; // 1 second
