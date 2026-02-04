/**
 * StyleSheet definitions for Device3DIndicator component
 */

import { StyleSheet, Platform } from 'react-native';
import { DEFAULT_SHADOW_COLOR } from './constants';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceModelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceModel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceFace: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceEdge: {
    position: 'absolute',
  },
  angleTextContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  angleText: {
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'monospace',
    }),
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  angleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 2,
  },
  angleLabel: {
    fontWeight: 'bold',
    marginRight: 4,
  },
});

/**
 * Creates platform-specific shadow styles
 * @param color - Shadow color
 * @param offsetX - Shadow horizontal offset
 * @param offsetY - Shadow vertical offset
 * @param opacity - Shadow opacity (0-1)
 * @param radius - Shadow blur radius
 * @returns Platform-specific shadow style object
 */
export function createShadowStyle(
  color: string = DEFAULT_SHADOW_COLOR,
  offsetX: number = 0,
  offsetY: number = 10,
  opacity: number = 0.3,
  radius: number = 20
) {
  return Platform.select({
    ios: {
      shadowColor: color,
      shadowOffset: { width: offsetX, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    android: {
      elevation: Math.min(24, radius / 2), // Android elevation max is 24
    },
    default: {},
  });
}

/**
 * Creates 3D transform perspective style
 * @param perspective - Perspective value (larger = less dramatic)
 * @returns Transform style with perspective
 */
export function createPerspectiveStyle(perspective: number = 1200) {
  return {
    transform: [{ perspective }],
  };
}
