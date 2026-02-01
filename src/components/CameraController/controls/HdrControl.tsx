import { useCallback } from 'react';
import { ControlButton } from './ControlButton';
import { HdrIcon } from '../icons';

interface HdrControlProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  activeColor?: string;
  inactiveColor?: string;
}

export function HdrControl({
  enabled,
  onToggle,
  activeColor,
  inactiveColor,
}: HdrControlProps) {
  const handlePress = useCallback(() => {
    onToggle(!enabled);
  }, [enabled, onToggle]);

  return (
    <ControlButton
      icon={<HdrIcon />}
      isActive={enabled}
      onPress={handlePress}
      accessibilityLabel={enabled ? 'HDR on' : 'HDR off'}
      activeColor={activeColor}
      inactiveColor={inactiveColor}
    />
  );
}
