import { useCallback } from 'react';
import { View } from 'react-native';
import { ControlButton } from './ControlButton';
import { ControlSlider } from './ControlSlider';
import { ExpandedPanel } from './ExpandedPanel';
import { ZoomIcon } from '../icons';

interface ZoomControlProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  zoomRange: { min: number; max: number };
  isExpanded: boolean;
  onToggleExpand: () => void;
  activeColor?: string;
  inactiveColor?: string;
}

export function ZoomControl({
  zoom,
  onZoomChange,
  zoomRange,
  isExpanded,
  onToggleExpand,
  activeColor,
  inactiveColor,
}: ZoomControlProps) {
  const formatZoomLabel = useCallback((value: number) => {
    return `${value.toFixed(1)}x`;
  }, []);

  return (
    <View>
      <ControlButton
        icon={<ZoomIcon />}
        isActive={isExpanded || zoom > zoomRange.min}
        onPress={onToggleExpand}
        accessibilityLabel={`Zoom ${zoom.toFixed(1)}x`}
        activeColor={activeColor}
        inactiveColor={inactiveColor}
      />
      {isExpanded && (
        <ExpandedPanel isExpanded={isExpanded}>
          <ControlSlider
            value={zoom}
            min={zoomRange.min}
            max={zoomRange.max}
            step={0.1}
            onChange={onZoomChange}
            formatLabel={formatZoomLabel}
          />
        </ExpandedPanel>
      )}
    </View>
  );
}
