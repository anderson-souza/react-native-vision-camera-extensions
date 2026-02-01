import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import type { IconProps } from '../types';
import { ICON_SIZE, DEFAULT_ICON_COLOR } from '../constants';

export function HdrIcon({
  size = ICON_SIZE,
  color = DEFAULT_ICON_COLOR,
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="2"
        y="6"
        width="20"
        height="12"
        rx="2"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <SvgText
        x="12"
        y="14"
        textAnchor="middle"
        fontSize="7"
        fontWeight="bold"
        fill={color}
      >
        HDR
      </SvgText>
    </Svg>
  );
}
