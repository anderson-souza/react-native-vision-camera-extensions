import { useCallback } from 'react';
import { ControlButton } from './ControlButton';
import { AngleIcon } from '../icons';

interface AngleLineControlProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  activeColor?: string;
  inactiveColor?: string;
}

export function AngleLineControl({
  enabled,
  onToggle,
  activeColor,
  inactiveColor,
}: AngleLineControlProps) {
  const handlePress = useCallback(() => {
    onToggle(!enabled);
  }, [enabled, onToggle]);

  return (
    <ControlButton
      icon={<AngleIcon />}
      isActive={enabled}
      onPress={handlePress}
      accessibilityLabel={
        enabled ? 'Angle indicator on' : 'Angle indicator off'
      }
      activeColor={activeColor}
      inactiveColor={inactiveColor}
    />
  );
}
