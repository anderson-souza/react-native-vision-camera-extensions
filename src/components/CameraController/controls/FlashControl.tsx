import { useCallback } from 'react';
import { ControlButton } from './ControlButton';
import { FlashIcon } from '../icons';
import type { FlashMode } from '../types';

interface FlashControlProps {
  mode: FlashMode;
  onModeChange: (mode: FlashMode) => void;
  activeColor?: string;
  inactiveColor?: string;
}

const FLASH_MODES: FlashMode[] = ['off', 'on', 'auto'];

const FLASH_LABELS: Record<FlashMode, string> = {
  off: 'Flash off',
  on: 'Flash on',
  auto: 'Flash auto',
};

export function FlashControl({
  mode,
  onModeChange,
  activeColor,
  inactiveColor,
}: FlashControlProps) {
  const handlePress = useCallback(() => {
    const currentIndex = FLASH_MODES.indexOf(mode);
    const nextIndex = (currentIndex + 1) % FLASH_MODES.length;
    onModeChange(FLASH_MODES[nextIndex]!);
  }, [mode, onModeChange]);

  return (
    <ControlButton
      icon={<FlashIcon />}
      isActive={mode !== 'off'}
      onPress={handlePress}
      accessibilityLabel={FLASH_LABELS[mode]}
      activeColor={activeColor}
      inactiveColor={inactiveColor}
    />
  );
}
