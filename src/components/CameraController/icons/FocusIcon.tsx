import Svg, { Path, Circle } from 'react-native-svg';
import type { IconProps } from '../types';
import { ICON_SIZE, DEFAULT_ICON_COLOR } from '../constants';

export function FocusIcon({
  size = ICON_SIZE,
  color = DEFAULT_ICON_COLOR,
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="3" fill={color} />
      <Path d="M12 2V6" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path
        d="M12 18V22"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path d="M2 12H6" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path
        d="M18 12H22"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M5 5L7.5 7.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M16.5 16.5L19 19"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M5 19L7.5 16.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M16.5 7.5L19 5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}
