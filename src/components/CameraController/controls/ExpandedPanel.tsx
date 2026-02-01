import type { FC } from 'react';
import type { ViewProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { ExpandedPanelProps } from '../types';
import { styles } from '../styles';
import { PANEL_HEIGHT, ANIMATION_CONFIG } from '../constants';

// Workaround for TypeScript deep type instantiation issue with Reanimated
const AnimatedView = Animated.View as unknown as FC<
  ViewProps & { style?: object }
>;

export function ExpandedPanel({ isExpanded, children }: ExpandedPanelProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    height: withSpring(isExpanded ? PANEL_HEIGHT : 0, ANIMATION_CONFIG),
    opacity: withTiming(isExpanded ? 1 : 0, { duration: 200 }),
  }));

  return (
    <AnimatedView style={[styles.expandedPanel, animatedStyle]}>
      <AnimatedView style={styles.expandedPanelContent}>
        {children}
      </AnimatedView>
    </AnimatedView>
  );
}
