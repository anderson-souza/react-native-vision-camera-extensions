import type { ViewStyle } from 'react-native';

export type FlashMode = 'off' | 'on' | 'auto';
export type FocusMode = 'auto' | 'manual';

export type ControlName =
  | 'flash'
  | 'angleLine'
  | 'zoom'
  | 'hdr'
  | 'focus'
  | 'exposure';

export interface CameraControllerState {
  flash: FlashMode;
  angleLineEnabled: boolean;
  zoom: number;
  hdrEnabled: boolean;
  focusMode: FocusMode;
  focusValue: number;
  exposure: number;
  expandedControl: ControlName | null;
}

export interface CameraControllerProps {
  /**
   * Which controls to display
   * @default ['flash', 'angleLine', 'zoom', 'hdr', 'focus', 'exposure']
   */
  controls?: ControlName[];

  /**
   * Initial state values
   */
  initialState?: Partial<CameraControllerState>;

  /**
   * Callback when flash mode changes
   */
  onFlashChange?: (mode: FlashMode) => void;

  /**
   * Callback when angle line is toggled
   */
  onAngleLineToggle?: (enabled: boolean) => void;

  /**
   * Callback when zoom level changes
   */
  onZoomChange?: (level: number) => void;

  /**
   * Callback when HDR is toggled
   */
  onHDRChange?: (enabled: boolean) => void;

  /**
   * Callback when focus mode or value changes
   */
  onFocusChange?: (mode: FocusMode, value?: number) => void;

  /**
   * Callback when exposure value changes
   */
  onExposureChange?: (value: number) => void;
  /**
   * Callback when any state changes
   */
  onStateChange?: (state: CameraControllerState) => void;

  /**
   * Zoom range configuration
   * @default { min: 1, max: 10 }
   */
  zoomRange?: { min: number; max: number };

  /**
   * Exposure range configuration
   * @default { min: -2, max: 2 }
   */
  exposureRange?: { min: number; max: number };

  /**
   * Container style
   */
  style?: ViewStyle;

  /**
   * Control bar style
   */
  barStyle?: ViewStyle;

  /**
   * Icon color for inactive state
   * @default '#FFFFFF'
   */
  iconColor?: string;

  /**
   * Icon color for active state
   * @default '#FFD700'
   */
  activeIconColor?: string;

  /**
   * Background color of the control bar
   * @default 'rgba(0, 0, 0, 0.6)'
   */
  backgroundColor?: string;
}

export interface IconProps {
  size?: number;
  color?: string;
}

export interface ControlButtonProps {
  icon: React.ReactNode;
  isActive?: boolean;
  onPress: () => void;
  accessibilityLabel: string;
  activeColor?: string;
  inactiveColor?: string;
}

export interface ControlSliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatLabel?: (value: number) => string;
  trackColor?: string;
  thumbColor?: string;
}

export interface ExpandedPanelProps {
  isExpanded: boolean;
  children: React.ReactNode;
}
