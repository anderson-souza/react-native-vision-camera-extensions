import { renderHook, act } from '@testing-library/react-hooks';
import { useCameraController } from '../components/CameraController/useCameraController';
import type { CameraControllerProps } from '../components/CameraController/types';

describe('useCameraController', () => {
  const defaultProps: CameraControllerProps = {};

  describe('initial state', () => {
    it('should have default state values', () => {
      const { result } = renderHook(() => useCameraController(defaultProps));

      expect(result.current.state.flash).toBe('off');
      expect(result.current.state.angleLineEnabled).toBe(false);
      expect(result.current.state.zoom).toBe(1);
      expect(result.current.state.hdrEnabled).toBe(false);
      expect(result.current.state.focusMode).toBe('auto');
      expect(result.current.state.focusValue).toBe(0.5);
      expect(result.current.state.exposure).toBe(0);
      expect(result.current.state.expandedControl).toBe(null);
    });

    it('should accept initial state overrides', () => {
      const props: CameraControllerProps = {
        initialState: {
          flash: 'on',
          zoom: 2,
          hdrEnabled: true,
        },
      };

      const { result } = renderHook(() => useCameraController(props));

      expect(result.current.state.flash).toBe('on');
      expect(result.current.state.zoom).toBe(2);
      expect(result.current.state.hdrEnabled).toBe(true);
    });
  });

  describe('flash control', () => {
    it('should update flash mode', () => {
      const onFlashChange = jest.fn();
      const props: CameraControllerProps = { onFlashChange };

      const { result } = renderHook(() => useCameraController(props));

      act(() => {
        result.current.setFlash('on');
      });

      expect(result.current.state.flash).toBe('on');
      expect(onFlashChange).toHaveBeenCalledWith('on');
    });

    it('should cycle through flash modes', () => {
      const { result } = renderHook(() => useCameraController(defaultProps));

      act(() => {
        result.current.setFlash('on');
      });
      expect(result.current.state.flash).toBe('on');

      act(() => {
        result.current.setFlash('auto');
      });
      expect(result.current.state.flash).toBe('auto');

      act(() => {
        result.current.setFlash('off');
      });
      expect(result.current.state.flash).toBe('off');
    });
  });

  describe('angle line control', () => {
    it('should toggle angle line', () => {
      const onAngleLineToggle = jest.fn();
      const props: CameraControllerProps = { onAngleLineToggle };

      const { result } = renderHook(() => useCameraController(props));

      expect(result.current.state.angleLineEnabled).toBe(false);

      act(() => {
        result.current.toggleAngleLine();
      });

      expect(result.current.state.angleLineEnabled).toBe(true);
      expect(onAngleLineToggle).toHaveBeenCalledWith(true);

      act(() => {
        result.current.toggleAngleLine();
      });

      expect(result.current.state.angleLineEnabled).toBe(false);
      expect(onAngleLineToggle).toHaveBeenCalledWith(false);
    });
  });

  describe('zoom control', () => {
    it('should update zoom level', () => {
      const onZoomChange = jest.fn();
      const props: CameraControllerProps = { onZoomChange };

      const { result } = renderHook(() => useCameraController(props));

      act(() => {
        result.current.setZoom(2.5);
      });

      expect(result.current.state.zoom).toBe(2.5);
      expect(onZoomChange).toHaveBeenCalledWith(2.5);
    });
  });

  describe('HDR control', () => {
    it('should toggle HDR', () => {
      const onHDRChange = jest.fn();
      const props: CameraControllerProps = { onHDRChange };

      const { result } = renderHook(() => useCameraController(props));

      act(() => {
        result.current.toggleHDR();
      });

      expect(result.current.state.hdrEnabled).toBe(true);
      expect(onHDRChange).toHaveBeenCalledWith(true);
    });
  });

  describe('focus control', () => {
    it('should update focus mode', () => {
      const onFocusChange = jest.fn();
      const props: CameraControllerProps = { onFocusChange };

      const { result } = renderHook(() => useCameraController(props));

      act(() => {
        result.current.setFocus('manual', 0.7);
      });

      expect(result.current.state.focusMode).toBe('manual');
      expect(result.current.state.focusValue).toBe(0.7);
      expect(onFocusChange).toHaveBeenCalledWith('manual', 0.7);
    });

    it('should update only focus mode when value is not provided', () => {
      const { result } = renderHook(() => useCameraController(defaultProps));

      act(() => {
        result.current.setFocus('manual');
      });

      expect(result.current.state.focusMode).toBe('manual');
      expect(result.current.state.focusValue).toBe(0.5); // unchanged
    });
  });

  describe('exposure control', () => {
    it('should update exposure value', () => {
      const onExposureChange = jest.fn();
      const props: CameraControllerProps = { onExposureChange };

      const { result } = renderHook(() => useCameraController(props));

      act(() => {
        result.current.setExposure(1.5);
      });

      expect(result.current.state.exposure).toBe(1.5);
      expect(onExposureChange).toHaveBeenCalledWith(1.5);
    });

    it('should handle negative exposure values', () => {
      const { result } = renderHook(() => useCameraController(defaultProps));

      act(() => {
        result.current.setExposure(-1.5);
      });

      expect(result.current.state.exposure).toBe(-1.5);
    });
  });

  describe('expand control', () => {
    it('should expand a control', () => {
      const { result } = renderHook(() => useCameraController(defaultProps));

      act(() => {
        result.current.expandControl('zoom');
      });

      expect(result.current.state.expandedControl).toBe('zoom');
    });

    it('should collapse when expanding the same control', () => {
      const { result } = renderHook(() => useCameraController(defaultProps));

      act(() => {
        result.current.expandControl('zoom');
      });

      act(() => {
        result.current.expandControl('zoom');
      });

      expect(result.current.state.expandedControl).toBe(null);
    });

    it('should switch to different control', () => {
      const { result } = renderHook(() => useCameraController(defaultProps));

      act(() => {
        result.current.expandControl('zoom');
      });

      act(() => {
        result.current.expandControl('exposure');
      });

      expect(result.current.state.expandedControl).toBe('exposure');
    });

    it('should toggle expand control', () => {
      const { result } = renderHook(() => useCameraController(defaultProps));

      act(() => {
        result.current.toggleExpandControl('zoom');
      });
      expect(result.current.state.expandedControl).toBe('zoom');

      act(() => {
        result.current.toggleExpandControl('zoom');
      });
      expect(result.current.state.expandedControl).toBe(null);
    });
  });

  describe('onStateChange callback', () => {
    it('should call onStateChange when state changes', () => {
      const onStateChange = jest.fn();
      const props: CameraControllerProps = { onStateChange };

      const { result } = renderHook(() => useCameraController(props));

      act(() => {
        result.current.setFlash('on');
      });

      expect(onStateChange).toHaveBeenCalled();
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({ flash: 'on' })
      );
    });
  });
});
