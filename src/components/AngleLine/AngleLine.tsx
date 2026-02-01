import type { FC } from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import type { AngleLineProps } from './types';
import { useAngleSensor } from './useAngleSensor';
import { styles } from './styles';
import {
  DEFAULT_LINE_COLOR,
  DEFAULT_LEVEL_COLOR,
  DEFAULT_REFERENCE_COLOR,
  DEFAULT_LINE_WIDTH,
  DEFAULT_LINE_LENGTH,
  DEFAULT_LEVEL_THRESHOLD,
  DEFAULT_UPDATE_INTERVAL,
  DEFAULT_ANGLE_CHANGE_THROTTLE_MS,
} from './constants';

// Workaround for TypeScript deep type instantiation issue with Reanimated
// See: https://github.com/software-mansion/react-native-reanimated/issues/5765
const AnimatedView = Animated.View as unknown as FC<{ style?: object }>;

export function AngleLine({
  lineColor = DEFAULT_LINE_COLOR,
  lineWidth = DEFAULT_LINE_WIDTH,
  lineLength = DEFAULT_LINE_LENGTH,
  levelIndicatorColor = DEFAULT_LEVEL_COLOR,
  referenceLineColor = DEFAULT_REFERENCE_COLOR,
  showReferenceLine = true,
  levelThreshold = DEFAULT_LEVEL_THRESHOLD,
  updateInterval = DEFAULT_UPDATE_INTERVAL,
  showAngleText = false,
  angleTextStyle,
  enabled = true,
  style,
  angleChangeThrottleMs = DEFAULT_ANGLE_CHANGE_THROTTLE_MS,
  onAngleChange,
  onLevelReached,
  onLevelLost,
}: AngleLineProps) {
  const { rotatingLineStyle, angleText } = useAngleSensor({
    updateInterval,
    levelThreshold,
    lineColor,
    levelIndicatorColor,
    enabled,
    showAngleText,
    angleChangeThrottleMs,
    onAngleChange,
    onLevelReached,
    onLevelLost,
  });

  return (
    <View style={[styles.container, style]} pointerEvents="none">
      {showAngleText && (
        <Text style={[styles.angleText, angleTextStyle]}>{angleText}&deg;</Text>
      )}

      <View style={styles.linesContainer}>
        {/* Static reference line */}
        {showReferenceLine && (
          <View
            style={[
              styles.referenceLine,
              {
                backgroundColor: referenceLineColor,
                height: lineWidth,
              },
            ]}
          />
        )}

        {/* Rotating indicator line */}
        <AnimatedView
          style={[
            styles.angleLine,
            {
              width: lineLength,
              height: lineWidth,
              borderRadius: lineWidth / 2,
            },
            rotatingLineStyle,
          ]}
        />
      </View>
    </View>
  );
}
