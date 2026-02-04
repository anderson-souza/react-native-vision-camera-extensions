/**
 * Orientation calculation utilities for Device3DIndicator
 * Handles quaternion math, Euler angle conversion, and angle normalization
 */

'use strict';

import type { Quaternion, EulerAngles } from './types';

/**
 * Converts radians to degrees
 * @param radians - Angle in radians
 * @returns Angle in degrees
 */
export function radiansToDegrees(radians: number): number {
  'worklet';
  return (radians * 180) / Math.PI;
}

/**
 * Converts degrees to radians
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 */
export function degreesToRadians(degrees: number): number {
  'worklet';
  return (degrees * Math.PI) / 180;
}

/**
 * Normalizes an angle to the range [-180, 180] degrees
 * @param degrees - Angle in degrees
 * @returns Normalized angle in [-180, 180] range
 */
export function normalizeAngle(degrees: number): number {
  'worklet';
  let normalized = degrees % 360;
  if (normalized > 180) {
    normalized -= 360;
  } else if (normalized < -180) {
    normalized += 360;
  }
  return normalized;
}

/**
 * Converts a quaternion to Euler angles (pitch, roll, yaw)
 * Uses ZYX rotation order to avoid gimbal lock in most orientations
 *
 * @param q - Quaternion representing rotation
 * @returns Euler angles in degrees
 */
export function quaternionToEuler(q: Quaternion): EulerAngles {
  'worklet';

  const { w, x, y, z } = q;

  // Roll (rotation around X-axis)
  const sinr_cosp = 2 * (w * x + y * z);
  const cosr_cosp = 1 - 2 * (x * x + y * y);
  const rollRadians = Math.atan2(sinr_cosp, cosr_cosp);

  // Pitch (rotation around Y-axis)
  const sinp = 2 * (w * y - z * x);
  let pitchRadians: number;
  if (Math.abs(sinp) >= 1) {
    // Use 90 degrees if out of range (gimbal lock)
    pitchRadians = Math.sign(sinp) * (Math.PI / 2);
  } else {
    pitchRadians = Math.asin(sinp);
  }

  // Yaw (rotation around Z-axis)
  const siny_cosp = 2 * (w * z + x * y);
  const cosy_cosp = 1 - 2 * (y * y + z * z);
  const yawRadians = Math.atan2(siny_cosp, cosy_cosp);

  // Convert to degrees and normalize
  return {
    pitch: normalizeAngle(radiansToDegrees(pitchRadians)),
    roll: normalizeAngle(radiansToDegrees(rollRadians)),
    yaw: normalizeAngle(radiansToDegrees(yawRadians)),
    timestamp: Date.now(),
  };
}

/**
 * Calculates the dot product of two quaternions
 * @param q1 - First quaternion
 * @param q2 - Second quaternion
 * @returns Dot product value
 */
export function quaternionDotProduct(q1: Quaternion, q2: Quaternion): number {
  'worklet';

  console.log('🚀 ~ quaternionDotProduct ~ q2:', q2);
  console.log('🚀 ~ quaternionDotProduct ~ q1:', q1);

  if (!q1 || !q2) {
    return 0;
  }

  return q1.w * q2.w + q1.x * q2.x + q1.y * q2.y + q1.z * q2.z;
}

/**
 * Calculates the angular distance between two quaternions in degrees
 * Uses the quaternion dot product to avoid gimbal lock issues
 *
 * @param current - Current orientation quaternion
 * @param reference - Reference orientation quaternion
 * @returns Angular distance in degrees [0, 180]
 */
export function quaternionAngularDistance(
  current: Quaternion,
  reference: Quaternion
): number {
  'worklet';

  // Calculate dot product (handle double-cover with absolute value)
  // Quaternions q and -q represent the same rotation
  const dot = Math.abs(quaternionDotProduct(current, reference));

  // Clamp to valid range to handle numerical errors
  const clampedDot = Math.min(1.0, Math.max(0.0, dot));

  // Angular distance = 2 * acos(|q1 · q2|)
  const angleRadians = 2 * Math.acos(clampedDot);

  return radiansToDegrees(angleRadians);
}

/**
 * Formats an angle value for display with specified precision
 * @param angle - Angle value in degrees
 * @param precision - Number of decimal places (0-3)
 * @param format - 'degrees' or 'radians'
 * @returns Formatted angle string
 */
export function formatAngle(
  angle: number,
  precision: number = 1,
  format: 'degrees' | 'radians' = 'degrees'
): string {
  'worklet';

  const value = format === 'radians' ? degreesToRadians(angle) : angle;
  const suffix = format === 'radians' ? ' rad' : '°';

  return `${value.toFixed(Math.max(0, Math.min(3, precision)))}${suffix}`;
}

/**
 * Validates if a quaternion is normalized (magnitude ≈ 1)
 * @param q - Quaternion to validate
 * @returns True if quaternion is normalized
 */
export function isNormalizedQuaternion(q: Quaternion): boolean {
  'worklet';
  const magnitude = Math.sqrt(q.w * q.w + q.x * q.x + q.y * q.y + q.z * q.z);
  return Math.abs(magnitude - 1) < 0.01;
}

/**
 * Validates if sensor reading contains valid finite values
 * @param pitch - Pitch angle in radians or degrees
 * @param roll - Roll angle in radians or degrees
 * @param yaw - Yaw angle in radians or degrees
 * @returns True if all values are finite numbers
 */
export function isValidSensorReading(
  pitch: number,
  roll: number,
  yaw: number
): boolean {
  'worklet';
  return isFinite(pitch) && isFinite(roll) && isFinite(yaw);
}
