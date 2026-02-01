import { useCallback, type FC } from 'react';
import { View, Text, type ViewProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type { ControlSliderProps } from '../types';
import { styles } from '../styles';
import { ANIMATION_CONFIG } from '../constants';

// Workaround for TypeScript deep type instantiation issue with Reanimated
const AnimatedView = Animated.View as unknown as FC<
  ViewProps & { style?: object }
>;

const THUMB_SIZE = 24;
const TRACK_HEIGHT = 4;

export function ControlSlider({
  value,
  min,
  max,
  step = 0.1,
  onChange,
  formatLabel = (v) => v.toFixed(1),
  trackColor = 'rgba(255, 255, 255, 0.3)',
  thumbColor = '#FFD700',
}: ControlSliderProps) {
  const trackWidth = useSharedValue(0);
  const translateX = useSharedValue(0);
  const isActive = useSharedValue(false);

  const normalizedValue = (value - min) / (max - min);

  const updateValue = useCallback(
    (newValue: number) => {
      const clampedValue = Math.max(min, Math.min(max, newValue));
      const steppedValue = Math.round(clampedValue / step) * step;
      onChange(steppedValue);
    },
    [min, max, step, onChange]
  );

  const startX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
      isActive.value = true;
    })
    .onUpdate((event) => {
      const newX = startX.value + event.translationX;
      const clampedX = Math.max(0, Math.min(trackWidth.value, newX));
      translateX.value = clampedX;

      const newValue = min + (clampedX / trackWidth.value) * (max - min);
      runOnJS(updateValue)(newValue);
    })
    .onEnd(() => {
      isActive.value = false;
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withSpring(
          normalizedValue * trackWidth.value - THUMB_SIZE / 2,
          ANIMATION_CONFIG
        ),
      },
      { scale: withSpring(isActive.value ? 1.2 : 1, ANIMATION_CONFIG) },
    ],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: withSpring(normalizedValue * trackWidth.value, ANIMATION_CONFIG),
  }));

  return (
    <View style={styles.sliderContainer}>
      <Text style={styles.sliderLabel}>{formatLabel(value)}</Text>
      <View
        style={{ flex: 1, height: 40, justifyContent: 'center' }}
        onLayout={(e) => {
          trackWidth.value = e.nativeEvent.layout.width;
        }}
      >
        <View
          style={{
            height: TRACK_HEIGHT,
            backgroundColor: trackColor,
            borderRadius: TRACK_HEIGHT / 2,
          }}
        >
          <AnimatedView
            style={[
              {
                height: TRACK_HEIGHT,
                backgroundColor: thumbColor,
                borderRadius: TRACK_HEIGHT / 2,
              },
              progressStyle,
            ]}
          />
        </View>
        <GestureDetector gesture={panGesture}>
          <AnimatedView
            style={[
              {
                position: 'absolute',
                width: THUMB_SIZE,
                height: THUMB_SIZE,
                borderRadius: THUMB_SIZE / 2,
                backgroundColor: thumbColor,
                top: (40 - THUMB_SIZE) / 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              },
              thumbStyle,
            ]}
          />
        </GestureDetector>
      </View>
    </View>
  );
}
