import { useCallback } from 'react';
import { View } from 'react-native';
import { ControlButton } from './ControlButton';
import { ControlSlider } from './ControlSlider';
import { ExpandedPanel } from './ExpandedPanel';
import { ExposureIcon } from '../icons';

interface ExposureControlProps {
  exposure: number;
  onExposureChange: (exposure: number) => void;
  exposureRange: { min: number; max: number };
  isExpanded: boolean;
  onToggleExpand: () => void;
  activeColor?: string;
  inactiveColor?: string;
}

export function ExposureControl({
  exposure,
  onExposureChange,
  exposureRange,
  isExpanded,
  onToggleExpand,
  activeColor,
  inactiveColor,
}: ExposureControlProps) {
  const formatExposureLabel = useCallback((value: number) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)} EV`;
  }, []);

  return (
    <View>
      <ControlButton
        icon={<ExposureIcon />}
        isActive={isExpanded || exposure !== 0}
        onPress={onToggleExpand}
        accessibilityLabel={`Exposure ${
          exposure > 0 ? '+' : ''
        }${exposure.toFixed(1)} EV`}
        activeColor={activeColor}
        inactiveColor={inactiveColor}
      />
      {isExpanded && (
        <ExpandedPanel isExpanded={isExpanded}>
          <ControlSlider
            value={exposure}
            min={exposureRange.min}
            max={exposureRange.max}
            step={0.1}
            onChange={onExposureChange}
            formatLabel={formatExposureLabel}
          />
        </ExpandedPanel>
      )}
    </View>
  );
}
