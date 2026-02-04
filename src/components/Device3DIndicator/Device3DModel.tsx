/* eslint-disable react-native/no-inline-styles */
/**
 * Device3DModel component - 3D visual representation of device orientation
 * Uses React Native transforms to create 3D effect
 */

import { memo } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import {
  styles as baseStyles,
  createShadowStyle,
  createPerspectiveStyle,
} from './styles';
import { DEFAULT_PERSPECTIVE } from './constants';

export interface Device3DModelProps {
  /** Pitch angle in degrees (rotation around X-axis) */
  pitch: any; // SharedValue or number
  /** Roll angle in degrees (rotation around Y-axis) */
  roll: any; // SharedValue or number
  /** Yaw angle in degrees (rotation around Z-axis) */
  yaw: any; // SharedValue or number
  /** Model size in pixels */
  size: number;
  /** Current color of the model */
  currentColor: string;
  /** Whether to show shadow */
  showShadow: boolean;
  /** Shadow color */
  shadowColor?: string;
}

/**
 * 3D device model component that responds to orientation changes
 * Renders a simplified 3D representation using React Native transforms
 */
export const Device3DModel = memo<Device3DModelProps>(
  ({
    pitch,
    roll,
    yaw,
    size,
    currentColor,
    showShadow,
    shadowColor = '#000000',
  }) => {
    // Calculate dimensions
    const width = size;
    const height = size * 2; // Phone aspect ratio ~1:2
    const depth = size * 0.1; // Device thickness

    // Animated style for 3D transforms
    const animatedStyle = useAnimatedStyle(() => {
      'worklet';
      const pitchValue =
        typeof pitch === 'object' && 'value' in pitch ? pitch.value : pitch;
      const rollValue =
        typeof roll === 'object' && 'value' in roll ? roll.value : roll;
      const yawValue =
        typeof yaw === 'object' && 'value' in yaw ? yaw.value : yaw;

      return {
        transform: [
          { perspective: DEFAULT_PERSPECTIVE },
          { rotateX: `${pitchValue}deg` },
          { rotateY: `${yawValue}deg` },
          { rotateZ: `${rollValue}deg` },
        ],
      };
    });

    // Shadow style (animated based on tilt)
    const shadowStyle = showShadow
      ? createShadowStyle(shadowColor, 0, 10, 0.3, 20)
      : {};

    return (
      <View style={[baseStyles.deviceModelContainer, createPerspectiveStyle()]}>
        <Animated.View
          style={[
            baseStyles.deviceModel,
            {
              width,
              height,
            },
            animatedStyle,
            shadowStyle,
          ]}
        >
          {/* Front face (screen) */}
          <View
            style={[
              baseStyles.deviceFace,
              {
                width,
                height,
                backgroundColor: currentColor,
                borderRadius: size * 0.1,
                borderWidth: size * 0.02,
                borderColor: 'rgba(0,0,0,0.3)',
              },
            ]}
          >
            {/* Camera notch */}
            <View
              style={{
                position: 'absolute',
                top: size * 0.05,
                width: size * 0.3,
                height: size * 0.05,
                backgroundColor: 'rgba(0,0,0,0.8)',
                borderRadius: size * 0.05,
              }}
            />

            {/* Home indicator (modern phones) */}
            <View
              style={{
                position: 'absolute',
                bottom: size * 0.05,
                width: size * 0.4,
                height: size * 0.02,
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderRadius: size * 0.01,
              }}
            />
          </View>

          {/* Back face */}
          <View
            style={[
              baseStyles.deviceFace,
              {
                width,
                height,
                backgroundColor: currentColor,
                opacity: 0.7,
                borderRadius: size * 0.1,
                transform: [{ rotateY: '180deg' }],
              },
            ]}
          >
            {/* Camera module */}
            <View
              style={{
                position: 'absolute',
                top: size * 0.08,
                left: size * 0.1,
                width: size * 0.2,
                height: size * 0.15,
                backgroundColor: 'rgba(0,0,0,0.6)',
                borderRadius: size * 0.05,
              }}
            />
          </View>

          {/* Edges for depth perception */}
          {/* Top edge */}
          <View
            style={[
              baseStyles.deviceEdge,
              {
                width,
                height: depth,
                backgroundColor: currentColor,
                opacity: 0.5,
                transform: [{ rotateX: '90deg' }, { translateY: -height / 2 }],
              },
            ]}
          />

          {/* Bottom edge */}
          <View
            style={[
              baseStyles.deviceEdge,
              {
                width,
                height: depth,
                backgroundColor: currentColor,
                opacity: 0.5,
                transform: [{ rotateX: '90deg' }, { translateY: height / 2 }],
              },
            ]}
          />

          {/* Left edge */}
          <View
            style={[
              baseStyles.deviceEdge,
              {
                width: depth,
                height,
                backgroundColor: currentColor,
                opacity: 0.4,
                transform: [{ rotateY: '90deg' }, { translateX: -width / 2 }],
              },
            ]}
          />

          {/* Right edge */}
          <View
            style={[
              baseStyles.deviceEdge,
              {
                width: depth,
                height,
                backgroundColor: currentColor,
                opacity: 0.4,
                transform: [{ rotateY: '90deg' }, { translateX: width / 2 }],
              },
            ]}
          />
        </Animated.View>
      </View>
    );
  }
);

Device3DModel.displayName = 'Device3DModel';
