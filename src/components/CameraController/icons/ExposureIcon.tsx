import Svg, { Circle, Path } from 'react-native-svg';
import type { IconProps } from '../types';
import { ICON_SIZE, DEFAULT_ICON_COLOR } from '../constants';

export function ExposureIcon({
  size = ICON_SIZE,
  color = DEFAULT_ICON_COLOR,
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="12"
        r="9"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <Path d="M12 3V12L21 12" stroke={color} strokeWidth="2" />
      <Path
        d="M12 3C16.97 3 21 7.03 21 12"
        stroke={color}
        strokeWidth="2"
        fill={color}
        fillOpacity="0.3"
      />
      <Path d="M8 12H16" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M12 8V16" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}
