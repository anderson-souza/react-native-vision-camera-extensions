import Svg, { Path, Line } from 'react-native-svg';
import type { IconProps } from '../types';
import { ICON_SIZE, DEFAULT_ICON_COLOR } from '../constants';

export function AngleIcon({
  size = ICON_SIZE,
  color = DEFAULT_ICON_COLOR,
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
        fill={color}
      />
      <Line
        x1="4"
        y1="12"
        x2="20"
        y2="12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Line
        x1="12"
        y1="12"
        x2="17"
        y2="8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}
