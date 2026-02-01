import {
  useCallback,
  isValidElement,
  cloneElement,
  type FC,
  type ReactElement,
} from 'react';
import { Pressable, type PressableProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import type { ControlButtonProps } from '../types';
import { styles } from '../styles';
import {
  DEFAULT_ICON_COLOR,
  DEFAULT_ACTIVE_ICON_COLOR,
  ANIMATION_CONFIG,
} from '../constants';

// Workaround for TypeScript deep type instantiation issue with Reanimated
const AnimatedPressable = Animated.createAnimatedComponent(
  Pressable
) as unknown as FC<PressableProps & { style?: object }>;

export function ControlButton({
  icon,
  isActive = false,
  onPress,
  accessibilityLabel,
  activeColor = DEFAULT_ACTIVE_ICON_COLOR,
  inactiveColor = DEFAULT_ICON_COLOR,
}: ControlButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value, ANIMATION_CONFIG) }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = 0.85;
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = 1;
  }, [scale]);

  const buttonStyle = useAnimatedStyle(() => ({
    backgroundColor: isActive ? `${activeColor}20` : 'transparent',
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      style={[styles.controlButton, animatedStyle, buttonStyle]}
    >
      {isValidElement(icon)
        ? cloneElement(icon as ReactElement<{ color?: string }>, {
            color: isActive ? activeColor : inactiveColor,
          })
        : icon}
    </AnimatedPressable>
  );
}
