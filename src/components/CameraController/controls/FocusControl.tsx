import { useCallback } from 'react';
import { View } from 'react-native';
import { ControlButton } from './ControlButton';
import { ControlSlider } from './ControlSlider';
import { ExpandedPanel } from './ExpandedPanel';
import { FocusIcon } from '../icons';
import type { FocusMode } from '../types';

interface FocusControlProps {
  focusMode: FocusMode;
  focusValue: number;
  onFocusChange: (mode: FocusMode, value?: number) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  activeColor?: string;
  inactiveColor?: string;
}

export function FocusControl({
  focusMode,
  focusValue,
  onFocusChange,
  isExpanded,
  onToggleExpand,
  activeColor,
  inactiveColor,
}: FocusControlProps) {
  const handleButtonPress = useCallback(() => {
    if (focusMode === 'auto') {
      onFocusChange('manual', focusValue);
      onToggleExpand();
    } else {
      onFocusChange('auto');
      if (isExpanded) onToggleExpand();
    }
  }, [focusMode, focusValue, onFocusChange, isExpanded, onToggleExpand]);

  const handleSliderChange = useCallback(
    (value: number) => {
      onFocusChange('manual', value);
    },
    [onFocusChange]
  );

  const formatFocusLabel = useCallback((value: number) => {
    return `${Math.round(value * 100)}%`;
  }, []);

  return (
    <View>
      <ControlButton
        icon={<FocusIcon />}
        isActive={focusMode === 'manual'}
        onPress={handleButtonPress}
        accessibilityLabel={
          focusMode === 'auto'
            ? 'Auto focus'
            : `Manual focus ${Math.round(focusValue * 100)}%`
        }
        activeColor={activeColor}
        inactiveColor={inactiveColor}
      />
      {isExpanded && focusMode === 'manual' && (
        <ExpandedPanel isExpanded={isExpanded && focusMode === 'manual'}>
          <ControlSlider
            value={focusValue}
            min={0}
            max={1}
            step={0.01}
            onChange={handleSliderChange}
            formatLabel={formatFocusLabel}
          />
        </ExpandedPanel>
      )}
    </View>
  );
}
