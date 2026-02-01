/**
 * Calculate roll angle (horizontal tilt) from accelerometer data.
 * This is a worklet function that runs on the UI thread.
 *
 * For portrait orientation (phone held upright, screen facing user):
 * - Y-axis has the gravity component
 * - X-axis changes with left/right tilt
 *
 * @param x - X-axis acceleration in g-force (lateral tilt)
 * @param y - Y-axis acceleration in g-force (vertical/gravity in portrait)
 * @returns Roll angle in degrees (-90 to 90)
 */
export function calculateRollAngle(x: number, y: number): number {
  'worklet';
  // Using Math.abs(y) ensures consistent behavior whether phone is tilted forward or backward
  const angleRadians = Math.atan2(x, Math.abs(y));
  return (angleRadians * 180) / Math.PI;
}

/**
 * Check if an angle is within the level threshold.
 * This is a worklet function that runs on the UI thread.
 *
 * @param angle - Current angle in degrees
 * @param threshold - Degrees tolerance to consider "level"
 * @returns Whether the angle is within threshold of 0
 */
export function isWithinThreshold(angle: number, threshold: number): boolean {
  'worklet';
  return Math.abs(angle) <= threshold;
}
