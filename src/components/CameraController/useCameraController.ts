import { useReducer, useCallback, useEffect, useRef } from 'react';
import type {
  CameraControllerState,
  CameraControllerProps,
  FlashMode,
  FocusMode,
  ControlName,
} from './types';
import { DEFAULT_STATE } from './constants';

type Action =
  | { type: 'SET_FLASH'; payload: FlashMode }
  | { type: 'TOGGLE_ANGLE_LINE' }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'TOGGLE_HDR' }
  | { type: 'SET_FOCUS_MODE'; payload: FocusMode }
  | { type: 'SET_FOCUS_VALUE'; payload: number }
  | { type: 'SET_EXPOSURE'; payload: number }
  | { type: 'EXPAND_CONTROL'; payload: ControlName | null }
  | { type: 'RESET'; payload: Partial<CameraControllerState> };

function reducer(
  state: CameraControllerState,
  action: Action
): CameraControllerState {
  switch (action.type) {
    case 'SET_FLASH':
      return { ...state, flash: action.payload };
    case 'TOGGLE_ANGLE_LINE':
      return { ...state, angleLineEnabled: !state.angleLineEnabled };
    case 'SET_ZOOM':
      return { ...state, zoom: action.payload };
    case 'TOGGLE_HDR':
      return { ...state, hdrEnabled: !state.hdrEnabled };
    case 'SET_FOCUS_MODE':
      return { ...state, focusMode: action.payload };
    case 'SET_FOCUS_VALUE':
      return { ...state, focusValue: action.payload };
    case 'SET_EXPOSURE':
      return { ...state, exposure: action.payload };
    case 'EXPAND_CONTROL':
      return {
        ...state,
        expandedControl:
          state.expandedControl === action.payload ? null : action.payload,
      };
    case 'RESET':
      return { ...DEFAULT_STATE, ...action.payload };
    default:
      return state;
  }
}

export function useCameraController(props: CameraControllerProps) {
  const {
    initialState,
    onFlashChange,
    onAngleLineToggle,
    onZoomChange,
    onHDRChange,
    onFocusChange,
    onExposureChange,
    onStateChange,
  } = props;

  const [state, dispatch] = useReducer(reducer, {
    ...DEFAULT_STATE,
    ...initialState,
  });

  const prevStateRef = useRef(state);

  // Call onStateChange when state changes
  useEffect(() => {
    if (prevStateRef.current !== state) {
      onStateChange?.(state);
      prevStateRef.current = state;
    }
  }, [state, onStateChange]);

  // Flash control
  const setFlash = useCallback(
    (mode: FlashMode) => {
      dispatch({ type: 'SET_FLASH', payload: mode });
      onFlashChange?.(mode);
    },
    [onFlashChange]
  );

  // Angle line control
  const toggleAngleLine = useCallback(() => {
    const newValue = !state.angleLineEnabled;
    dispatch({ type: 'TOGGLE_ANGLE_LINE' });
    onAngleLineToggle?.(newValue);
  }, [state.angleLineEnabled, onAngleLineToggle]);

  // Zoom control
  const setZoom = useCallback(
    (level: number) => {
      dispatch({ type: 'SET_ZOOM', payload: level });
      onZoomChange?.(level);
    },
    [onZoomChange]
  );

  // HDR control
  const toggleHDR = useCallback(() => {
    const newValue = !state.hdrEnabled;
    dispatch({ type: 'TOGGLE_HDR' });
    onHDRChange?.(newValue);
  }, [state.hdrEnabled, onHDRChange]);

  // Focus control
  const setFocus = useCallback(
    (mode: FocusMode, value?: number) => {
      dispatch({ type: 'SET_FOCUS_MODE', payload: mode });
      if (value !== undefined) {
        dispatch({ type: 'SET_FOCUS_VALUE', payload: value });
      }
      onFocusChange?.(mode, value);
    },
    [onFocusChange]
  );

  // Exposure control
  const setExposure = useCallback(
    (value: number) => {
      dispatch({ type: 'SET_EXPOSURE', payload: value });
      onExposureChange?.(value);
    },
    [onExposureChange]
  );

  // Expand control
  const expandControl = useCallback((controlName: ControlName | null) => {
    dispatch({ type: 'EXPAND_CONTROL', payload: controlName });
  }, []);

  // Toggle expand helper
  const toggleExpandControl = useCallback(
    (controlName: ControlName) => {
      expandControl(state.expandedControl === controlName ? null : controlName);
    },
    [state.expandedControl, expandControl]
  );

  return {
    state,
    setFlash,
    toggleAngleLine,
    setZoom,
    toggleHDR,
    setFocus,
    setExposure,
    expandControl,
    toggleExpandControl,
  };
}
