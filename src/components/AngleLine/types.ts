import type { ViewStyle, TextStyle } from 'react-native';

export interface AngleLineProps {
  /**
   * Color of the rotating indicator line
   * @default '#FFFFFF'
   */
  lineColor?: string;

  /**
   * Width/thickness of the lines in pixels
   * @default 2
   */
  lineWidth?: number;

  /**
   * Length of the rotating line. Can be a number (pixels) or percentage string
   * @default '80%'
   */
  lineLength?: number | `${number}%`;

  /**
   * Color of the line when the device is level (within threshold)
   * @default '#00FF00'
   */
  levelIndicatorColor?: string;

  /**
   * Color of the static reference line
   * @default 'rgba(255,255,255,0.3)'
   */
  referenceLineColor?: string;

  /**
   * Whether to show the static horizontal reference line
   * @default true
   */
  showReferenceLine?: boolean;

  /**
   * Degrees tolerance to consider the device "level"
   * @default 1
   */
  levelThreshold?: number;

  /**
   * Sensor update interval in milliseconds
   * @default 50
   */
  updateInterval?: number;

  /**
   * Whether to show the numeric angle value
   * @default false
   */
  showAngleText?: boolean;

  /**
   * Style for the angle text
   */
  angleTextStyle?: TextStyle;

  /**
   * Whether the sensor is enabled
   * @default true
   */
  enabled?: boolean;

  /**
   * Style for the container view
   */
  style?: ViewStyle;

  /**
   * Callback when the angle changes
   */
  onAngleChange?: (angle: number) => void;

  /**
   * Callback when the device becomes level (within threshold)
   */
  onLevelReached?: () => void;

  /**
   * Callback when the device is no longer level
   */
  onLevelLost?: () => void;

  /**
   * Throttle interval for onAngleChange callback in milliseconds
   * @default 100
   */
  angleChangeThrottleMs?: number;
}

export interface UseAngleSensorReturn {
  rotatingLineStyle: ReturnType<
    typeof import('react-native-reanimated').useAnimatedStyle
  >;
  angleText: string;
  sensorError: string | null;
}
