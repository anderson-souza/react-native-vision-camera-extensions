import Svg, { Circle, Line } from 'react-native-svg';
import type { IconProps } from '../types';
import { ICON_SIZE, DEFAULT_ICON_COLOR } from '../constants';

export function ZoomIcon({
  size = ICON_SIZE,
  color = DEFAULT_ICON_COLOR,
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="10"
        cy="10"
        r="7"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <Line
        x1="15.5"
        y1="15.5"
        x2="21"
        y2="21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Line
        x1="7"
        y1="10"
        x2="13"
        y2="10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Line
        x1="10"
        y1="7"
        x2="10"
        y2="13"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}
