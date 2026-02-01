import { useMemo, useCallback } from 'react';
import { FlatList, View } from 'react-native';
import type { CameraControllerProps, ControlName } from './types';
import { useCameraController } from './useCameraController';
import {
  FlashControl,
  AngleLineControl,
  ZoomControl,
  HdrControl,
  FocusControl,
  ExposureControl,
} from './controls';
import { styles } from './styles';
import {
  DEFAULT_CONTROLS,
  DEFAULT_ZOOM_RANGE,
  DEFAULT_EXPOSURE_RANGE,
  DEFAULT_ICON_COLOR,
  DEFAULT_ACTIVE_ICON_COLOR,
  DEFAULT_BACKGROUND_COLOR,
} from './constants';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export function CameraController(props: CameraControllerProps) {
  const {
    controls = DEFAULT_CONTROLS,
    zoomRange = DEFAULT_ZOOM_RANGE,
    exposureRange = DEFAULT_EXPOSURE_RANGE,
    style,
    barStyle,
    iconColor = DEFAULT_ICON_COLOR,
    activeIconColor = DEFAULT_ACTIVE_ICON_COLOR,
    backgroundColor = DEFAULT_BACKGROUND_COLOR,
  } = props;

  const {
    state,
    setFlash,
    toggleAngleLine,
    setZoom,
    toggleHDR,
    setFocus,
    setExposure,
    toggleExpandControl,
  } = useCameraController(props);

  const controlsSet = useMemo(() => new Set(controls), [controls]);

  const handleToggleZoom = useCallback(() => {
    toggleExpandControl('zoom');
  }, [toggleExpandControl]);

  const handleToggleFocus = useCallback(() => {
    toggleExpandControl('focus');
  }, [toggleExpandControl]);

  const handleToggleExposure = useCallback(() => {
    toggleExpandControl('exposure');
  }, [toggleExpandControl]);

  const renderControl = useCallback(
    (controlName: ControlName) => {
      switch (controlName) {
        case 'flash':
          return (
            <FlashControl
              key="flash"
              mode={state.flash}
              onModeChange={setFlash}
              activeColor={activeIconColor}
              inactiveColor={iconColor}
            />
          );
        case 'angleLine':
          return (
            <AngleLineControl
              key="angleLine"
              enabled={state.angleLineEnabled}
              onToggle={toggleAngleLine}
              activeColor={activeIconColor}
              inactiveColor={iconColor}
            />
          );
        case 'zoom':
          return (
            <ZoomControl
              key="zoom"
              zoom={state.zoom}
              onZoomChange={setZoom}
              zoomRange={zoomRange}
              isExpanded={state.expandedControl === 'zoom'}
              onToggleExpand={handleToggleZoom}
              activeColor={activeIconColor}
              inactiveColor={iconColor}
            />
          );
        case 'hdr':
          return (
            <HdrControl
              key="hdr"
              enabled={state.hdrEnabled}
              onToggle={toggleHDR}
              activeColor={activeIconColor}
              inactiveColor={iconColor}
            />
          );
        case 'focus':
          return (
            <FocusControl
              key="focus"
              focusMode={state.focusMode}
              focusValue={state.focusValue}
              onFocusChange={setFocus}
              isExpanded={state.expandedControl === 'focus'}
              onToggleExpand={handleToggleFocus}
              activeColor={activeIconColor}
              inactiveColor={iconColor}
            />
          );
        case 'exposure':
          return (
            <ExposureControl
              key="exposure"
              exposure={state.exposure}
              onExposureChange={setExposure}
              exposureRange={exposureRange}
              isExpanded={state.expandedControl === 'exposure'}
              onToggleExpand={handleToggleExposure}
              activeColor={activeIconColor}
              inactiveColor={iconColor}
            />
          );
        default:
          return null;
      }
    },
    [
      state,
      setFlash,
      toggleAngleLine,
      setZoom,
      toggleHDR,
      setFocus,
      setExposure,
      handleToggleZoom,
      handleToggleFocus,
      handleToggleExposure,
      zoomRange,
      exposureRange,
      activeIconColor,
      iconColor,
    ]
  );

  const visibleControls = useMemo(
    () => DEFAULT_CONTROLS.filter((control) => controlsSet.has(control)),
    [controlsSet]
  );

  return (
    <GestureHandlerRootView style={[styles.container, style]}>
      <View style={[styles.controlBar, { backgroundColor }, barStyle]}>
        <FlatList
          data={visibleControls}
          renderItem={({ item }) => renderControl(item)}
          keyExtractor={(item) => item}
          horizontal
        />
      </View>
    </GestureHandlerRootView>
  );
}
