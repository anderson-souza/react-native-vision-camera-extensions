/**
 * Alignment detection utility with hysteresis
 * Prevents flickering by using different thresholds for entering and exiting aligned state
 */

'use strict';

export interface HysteresisConfig {
  enterThreshold: number; // Degrees - threshold to enter aligned state
  exitThreshold: number; // Degrees - threshold to exit aligned state
  minStableDurationMs: number; // Milliseconds - minimum duration before state change
}

export interface AlignmentState {
  isAligned: boolean;
  deviationAngle: number;
  lastTransitionTime: number;
}

/**
 * Creates an alignment detector with hysteresis and time-based debouncing
 *
 * Hysteresis prevents flickering:
 * - To enter aligned state: distance must be ≤ enterThreshold
 * - To exit aligned state: distance must be > exitThreshold
 * - exitThreshold > enterThreshold creates stable "buffer zone"
 *
 * @param config - Hysteresis configuration
 * @returns Alignment checker function
 *
 * @example
 * const detector = createAlignmentDetector({
 *   enterThreshold: 2,    // Enter aligned at ≤2°
 *   exitThreshold: 4,     // Exit aligned at >4°
 *   minStableDurationMs: 150
 * });
 *
 * const result = detector.check(1.5, Date.now()); // isAligned: true
 * const result2 = detector.check(3, Date.now() + 200); // still true (< exitThreshold)
 * const result3 = detector.check(5, Date.now() + 400); // isAligned: false
 */
export function createAlignmentDetector(config: HysteresisConfig) {
  let state: AlignmentState = {
    isAligned: false,
    deviationAngle: 0,
    lastTransitionTime: 0,
  };

  return {
    /**
     * Checks if the current angular distance indicates alignment
     *
     * @param angularDistance - Distance from target orientation in degrees
     * @param currentTimeMs - Current timestamp in milliseconds
     * @returns Current alignment state
     */
    check: (angularDistance: number, currentTimeMs: number): AlignmentState => {
      'worklet';

      // Update deviation angle
      state.deviationAngle = angularDistance;

      // Use different thresholds for entering vs exiting aligned state
      const threshold = state.isAligned
        ? config.exitThreshold // Harder to exit (larger threshold)
        : config.enterThreshold; // Easier to enter (smaller threshold)

      const isWithinThreshold = angularDistance <= threshold;

      // Only change state after stable duration
      if (isWithinThreshold !== state.isAligned) {
        const timeSinceChange = currentTimeMs - state.lastTransitionTime;

        if (timeSinceChange >= config.minStableDurationMs) {
          state.isAligned = isWithinThreshold;
          state.lastTransitionTime = currentTimeMs;
        }
      } else {
        // Reset timer if we're stable in current state
        state.lastTransitionTime = currentTimeMs;
      }

      return { ...state };
    },

    /**
     * Resets the detector to initial state
     */
    reset: (): void => {
      'worklet';
      state = {
        isAligned: false,
        deviationAngle: 0,
        lastTransitionTime: 0,
      };
    },

    /**
     * Gets the current state without updating
     */
    getState: (): AlignmentState => {
      'worklet';
      return { ...state };
    },
  };
}
