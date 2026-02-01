import Svg, { Path } from 'react-native-svg';
import type { IconProps } from '../types';
import { ICON_SIZE, DEFAULT_ICON_COLOR } from '../constants';

export function FlashIcon({
  size = ICON_SIZE,
  color = DEFAULT_ICON_COLOR,
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13 2L4.09 12.11C3.72 12.54 3.64 13.15 3.91 13.65C4.18 14.15 4.71 14.4 5.27 14.29L10 13.38V21C10 21.74 10.58 22.36 11.31 22.42C11.37 22.43 11.43 22.43 11.49 22.42C12.03 22.36 12.5 21.99 12.71 21.47L21 6.89C21.22 6.43 21.18 5.9 20.89 5.48C20.6 5.05 20.12 4.8 19.59 4.8H14V3C14 2.45 13.55 2 13 2Z"
        fill={color}
      />
    </Svg>
  );
}
