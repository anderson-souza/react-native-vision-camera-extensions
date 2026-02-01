import type { CameraControllerState, ControlName } from './types';

export const DEFAULT_CONTROLS: ControlName[] = [
  'flash',
  'angleLine',
  'zoom',
  'hdr',
  'focus',
  'exposure',
];

export const DEFAULT_STATE: CameraControllerState = {
  flash: 'off',
  angleLineEnabled: false,
  zoom: 1,
  hdrEnabled: false,
  focusMode: 'auto',
  focusValue: 0.5,
  exposure: 0,
  expandedControl: null,
};

export const DEFAULT_ZOOM_RANGE = { min: 1, max: 10 };
export const DEFAULT_EXPOSURE_RANGE = { min: -2, max: 2 };

export const DEFAULT_ICON_COLOR = '#FFFFFF';
export const DEFAULT_ACTIVE_ICON_COLOR = '#FFD700';
export const DEFAULT_BACKGROUND_COLOR = 'rgba(0, 0, 0, 0.6)';

export const ICON_SIZE = 24;
export const BUTTON_SIZE = 40;
export const BAR_PADDING = 8;
export const PANEL_HEIGHT = 80;

export const ANIMATION_CONFIG = {
  damping: 50,
  stiffness: 50,
};
