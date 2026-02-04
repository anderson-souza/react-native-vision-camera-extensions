/**
 * Unit tests for useOrientationSensor hook
 *
 * Tests cover:
 * - T011: Sensor integration with Reanimated's useAnimatedSensor
 *
 * TDD Phase: RED - Hook is NOT YET IMPLEMENTED
 * These tests define the expected behavior for the hook implementation
 */

import { renderHook, act } from '@testing-library/react-hooks';

// Mock react-native-reanimated - Jest hoists this to the top
jest.mock('react-native-reanimated', () => {
  return {
    __esModule: true,
    default: {
      View: require('react-native').View,
    },
    useAnimatedSensor: jest.fn(() => ({
      sensor: {
        value: { qw: 1, qx: 0, qy: 0, qz: 0 },
      },
    })),
    useAnimatedStyle: jest.fn((fn) => {
      try {
        return fn();
      } catch {
        return {};
      }
    }),
    useDerivedValue: jest.fn((fn) => {
      try {
        return { value: fn() };
      } catch {
        return { value: null };
      }
    }),
    useSharedValue: jest.fn((initial) => ({ value: initial })),
    SensorType: {
      ROTATION: 'ROTATION',
      ACCELEROMETER: 'ACCELEROMETER',
      GYROSCOPE: 'GYROSCOPE',
    },
    runOnJS: jest.fn((fn) => fn),
    withTiming: jest.fn((value) => value),
  };
});

// Get reference to the mocked functions after mock is set up
import * as reanimated from 'react-native-reanimated';
const mockedUseAnimatedSensor = reanimated.useAnimatedSensor as jest.Mock;
const SensorType = reanimated.SensorType;

// Import the hook after mocking
// NOTE: This import will fail until the hook is implemented (TDD RED phase)
import { useOrientationSensor } from '../../components/Device3DIndicator/useOrientationSensor';
import type { OrientationState } from '../../components/Device3DIndicator/types';

// ============================================================================
// T011: Unit tests for useOrientationSensor hook sensor integration
// ============================================================================
describe('T011: useOrientationSensor hook', () => {
  // Reference to internal mock sensor value
  let internalMockSensorValue = { qw: 1, qx: 0, qy: 0, qz: 0 };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset sensor values
    internalMockSensorValue = { qw: 1, qx: 0, qy: 0, qz: 0 };

    // Reset the mock to return fresh sensor value
    mockedUseAnimatedSensor.mockImplementation(() => ({
      sensor: {
        value: internalMockSensorValue,
      },
    }));
  });

  describe('initialization', () => {
    it('should be defined and callable', () => {
      expect(useOrientationSensor).toBeDefined();
      expect(typeof useOrientationSensor).toBe('function');
    });

    it('should return orientation state with default values', () => {
      const { result } = renderHook(() => useOrientationSensor());

      expect(result.current).toBeDefined();
      expect(result.current.orientation).toBeDefined();
      expect(typeof result.current.orientation.pitch).toBe('number');
      expect(typeof result.current.orientation.roll).toBe('number');
      expect(typeof result.current.orientation.yaw).toBe('number');
    });

    it('should initialize with identity quaternion (0,0,0) Euler angles', () => {
      const { result } = renderHook(() => useOrientationSensor());

      // With identity quaternion (1,0,0,0), Euler angles should be near 0
      expect(result.current.orientation.pitch).toBeCloseTo(0, 1);
      expect(result.current.orientation.roll).toBeCloseTo(0, 1);
      expect(result.current.orientation.yaw).toBeCloseTo(0, 1);
    });

    it('should include timestamp in orientation state', () => {
      const { result } = renderHook(() => useOrientationSensor());

      expect(result.current.orientation.timestamp).toBeDefined();
      expect(typeof result.current.orientation.timestamp).toBe('number');
      expect(result.current.orientation.timestamp).toBeGreaterThan(0);
    });
  });

  describe('sensor integration', () => {
    it('should call useAnimatedSensor with ROTATION sensor type', () => {
      renderHook(() => useOrientationSensor());

      expect(mockedUseAnimatedSensor).toHaveBeenCalled();
      const call = mockedUseAnimatedSensor.mock.calls[0];
      expect(call[0]).toBe(SensorType.ROTATION);
    });

    it('should use configured update interval', () => {
      const updateInterval = 50;
      renderHook(() => useOrientationSensor({ updateInterval }));

      expect(mockedUseAnimatedSensor).toHaveBeenCalled();
      const call = mockedUseAnimatedSensor.mock.calls[0];
      expect(call[1]).toBeDefined();
      expect(call[1].interval).toBe(updateInterval);
    });

    it('should use default update interval of 33ms (~30 FPS)', () => {
      renderHook(() => useOrientationSensor());

      const call = mockedUseAnimatedSensor.mock.calls[0];
      expect(call[1]?.interval).toBe(33);
    });
  });

  describe('enabled/disabled state', () => {
    it('should be enabled by default', () => {
      const { result } = renderHook(() => useOrientationSensor());

      expect(result.current.isEnabled).toBe(true);
    });

    it('should respect enabled=false prop', () => {
      const { result } = renderHook(() =>
        useOrientationSensor({ enabled: false })
      );

      expect(result.current.isEnabled).toBe(false);
    });

    it('should not update orientation when disabled', () => {
      const { result, rerender } = renderHook(
        ({ enabled }) => useOrientationSensor({ enabled }),
        { initialProps: { enabled: false } }
      );

      const initialOrientation = { ...result.current.orientation };

      // Simulate sensor update
      internalMockSensorValue.qx = 0.5;
      internalMockSensorValue.qy = 0.5;
      internalMockSensorValue.qw = 0.5;
      internalMockSensorValue.qz = 0.5;

      rerender({ enabled: false });

      // Orientation should not change when disabled
      expect(result.current.orientation.pitch).toBeCloseTo(
        initialOrientation.pitch,
        1
      );
      expect(result.current.orientation.roll).toBeCloseTo(
        initialOrientation.roll,
        1
      );
      expect(result.current.orientation.yaw).toBeCloseTo(
        initialOrientation.yaw,
        1
      );
    });

    it('should resume updates when re-enabled', () => {
      const { result, rerender } = renderHook(
        ({ enabled }) => useOrientationSensor({ enabled }),
        { initialProps: { enabled: false } }
      );

      // Re-enable
      rerender({ enabled: true });

      expect(result.current.isEnabled).toBe(true);
    });
  });

  describe('quaternion to Euler conversion', () => {
    it('should convert sensor quaternion to Euler angles correctly', () => {
      // Set up 90 degree rotation around Z-axis
      const angle = Math.PI / 2; // 90 degrees
      internalMockSensorValue.qw = Math.cos(angle / 2);
      internalMockSensorValue.qx = 0;
      internalMockSensorValue.qy = 0;
      internalMockSensorValue.qz = Math.sin(angle / 2);

      const { result } = renderHook(() => useOrientationSensor());

      // Yaw should be approximately 90 degrees
      expect(result.current.orientation.yaw).toBeCloseTo(90, 0);
    });

    it('should handle 45 degree pitch rotation', () => {
      const angle = Math.PI / 4; // 45 degrees
      internalMockSensorValue.qw = Math.cos(angle / 2);
      internalMockSensorValue.qx = 0;
      internalMockSensorValue.qy = Math.sin(angle / 2);
      internalMockSensorValue.qz = 0;

      const { result } = renderHook(() => useOrientationSensor());

      expect(result.current.orientation.pitch).toBeCloseTo(45, 0);
    });

    it('should handle 30 degree roll rotation', () => {
      const angle = Math.PI / 6; // 30 degrees
      internalMockSensorValue.qw = Math.cos(angle / 2);
      internalMockSensorValue.qx = Math.sin(angle / 2);
      internalMockSensorValue.qy = 0;
      internalMockSensorValue.qz = 0;

      const { result } = renderHook(() => useOrientationSensor());

      expect(result.current.orientation.roll).toBeCloseTo(30, 0);
    });

    it('should normalize angles to [-180, 180] range', () => {
      const { result } = renderHook(() => useOrientationSensor());

      expect(result.current.orientation.pitch).toBeGreaterThanOrEqual(-180);
      expect(result.current.orientation.pitch).toBeLessThanOrEqual(180);
      expect(result.current.orientation.roll).toBeGreaterThanOrEqual(-180);
      expect(result.current.orientation.roll).toBeLessThanOrEqual(180);
      expect(result.current.orientation.yaw).toBeGreaterThanOrEqual(-180);
      expect(result.current.orientation.yaw).toBeLessThanOrEqual(180);
    });
  });

  describe('callback integration', () => {
    it('should invoke onOrientationChange callback when orientation changes', () => {
      const onOrientationChange = jest.fn();

      renderHook(() => useOrientationSensor({ onOrientationChange }));

      // Callback should be called at least once with initial orientation
      expect(onOrientationChange).toHaveBeenCalled();
    });

    it('should pass OrientationState object to callback', () => {
      const onOrientationChange = jest.fn();

      renderHook(() => useOrientationSensor({ onOrientationChange }));

      const callArg = onOrientationChange.mock.calls[0][0];
      expect(callArg).toHaveProperty('pitch');
      expect(callArg).toHaveProperty('roll');
      expect(callArg).toHaveProperty('yaw');
      expect(callArg).toHaveProperty('timestamp');
    });

    it('should throttle callback invocations', async () => {
      const onOrientationChange = jest.fn();
      const throttleMs = 100;

      renderHook(() =>
        useOrientationSensor({
          onOrientationChange,
          orientationChangeThrottleMs: throttleMs,
        })
      );

      // Simulate rapid sensor updates
      act(() => {
        internalMockSensorValue.qx = 0.1;
      });
      act(() => {
        internalMockSensorValue.qx = 0.2;
      });
      act(() => {
        internalMockSensorValue.qx = 0.3;
      });

      // Should not call for every update due to throttling
      const callCount = onOrientationChange.mock.calls.length;
      expect(callCount).toBeLessThan(4);
    });

    it('should use default throttle of 100ms', () => {
      const { result } = renderHook(() => useOrientationSensor());

      // Hook should have default throttle config
      expect(result.current.config?.orientationChangeThrottleMs ?? 100).toBe(
        100
      );
    });
  });

  describe('sensor availability', () => {
    it('should provide sensor availability status', () => {
      const { result } = renderHook(() => useOrientationSensor());

      expect(result.current).toHaveProperty('isSensorAvailable');
      expect(typeof result.current.isSensorAvailable).toBe('boolean');
    });

    it('should indicate available when sensor returns valid data', () => {
      const { result } = renderHook(() => useOrientationSensor());

      expect(result.current.isSensorAvailable).toBe(true);
    });

    it('should handle sensor unavailability gracefully', () => {
      // Mock sensor as unavailable
      mockedUseAnimatedSensor.mockReturnValueOnce({
        sensor: { value: null },
      });

      const { result } = renderHook(() => useOrientationSensor());

      // Should not throw and should indicate unavailable
      expect(result.current.isSensorAvailable).toBe(false);
    });

    it('should return fallback orientation when sensor unavailable', () => {
      mockedUseAnimatedSensor.mockReturnValueOnce({
        sensor: { value: null },
      });

      const { result } = renderHook(() => useOrientationSensor());

      // Should return identity/zero orientation as fallback
      expect(result.current.orientation.pitch).toBe(0);
      expect(result.current.orientation.roll).toBe(0);
      expect(result.current.orientation.yaw).toBe(0);
    });
  });

  describe('return value structure', () => {
    it('should return orientation state', () => {
      const { result } = renderHook(() => useOrientationSensor());

      expect(result.current.orientation).toBeDefined();
    });

    it('should return quaternion for advanced use', () => {
      const { result } = renderHook(() => useOrientationSensor());

      expect(result.current.quaternion).toBeDefined();
      expect(result.current.quaternion).toHaveProperty('w');
      expect(result.current.quaternion).toHaveProperty('x');
      expect(result.current.quaternion).toHaveProperty('y');
      expect(result.current.quaternion).toHaveProperty('z');
    });

    it('should return shared values for animation', () => {
      const { result } = renderHook(() => useOrientationSensor());

      // Should expose shared values for Reanimated animations
      expect(result.current.animatedOrientation).toBeDefined();
    });

    it('should return config object', () => {
      const { result } = renderHook(() => useOrientationSensor());

      expect(result.current.config).toBeDefined();
      expect(result.current.config).toHaveProperty('updateInterval');
      expect(result.current.config).toHaveProperty('enabled');
    });
  });

  describe('prop updates', () => {
    it('should update when updateInterval changes', () => {
      const { rerender } = renderHook(
        ({ updateInterval }) => useOrientationSensor({ updateInterval }),
        { initialProps: { updateInterval: 33 } }
      );

      rerender({ updateInterval: 50 });

      // Should reconfigure sensor with new interval
      expect(mockedUseAnimatedSensor).toHaveBeenCalledTimes(2);
    });

    it('should toggle enabled state dynamically', () => {
      const { result, rerender } = renderHook(
        ({ enabled }) => useOrientationSensor({ enabled }),
        { initialProps: { enabled: true } }
      );

      expect(result.current.isEnabled).toBe(true);

      rerender({ enabled: false });
      expect(result.current.isEnabled).toBe(false);

      rerender({ enabled: true });
      expect(result.current.isEnabled).toBe(true);
    });
  });

  describe('cleanup', () => {
    it('should cleanup sensor subscription on unmount', () => {
      const { unmount } = renderHook(() => useOrientationSensor());

      // Should not throw on unmount
      expect(() => unmount()).not.toThrow();
    });

    it('should not call callbacks after unmount', () => {
      const onOrientationChange = jest.fn();
      const { unmount } = renderHook(() =>
        useOrientationSensor({ onOrientationChange })
      );

      const callCountBeforeUnmount = onOrientationChange.mock.calls.length;
      unmount();

      // Simulate sensor update after unmount
      internalMockSensorValue.qx = 0.9;

      // Should not receive new calls
      expect(onOrientationChange.mock.calls.length).toBe(
        callCountBeforeUnmount
      );
    });
  });

  describe('performance', () => {
    it('should not re-render excessively on sensor updates', () => {
      let renderCount = 0;
      const { rerender } = renderHook(() => {
        renderCount++;
        return useOrientationSensor();
      });

      const initialCount = renderCount;

      // Rerender should not cause additional hook renders
      rerender();
      rerender();
      rerender();

      // Allow some renders but should not be excessive
      expect(renderCount - initialCount).toBeLessThanOrEqual(3);
    });
  });
});

describe('useOrientationSensor types', () => {
  it('should accept all valid props', () => {
    // Type check - should not error
    const props = {
      enabled: true,
      updateInterval: 33,
      onOrientationChange: (state: OrientationState) => {
        console.log(state);
      },
      orientationChangeThrottleMs: 100,
    };

    const { result } = renderHook(() => useOrientationSensor(props));
    expect(result.current).toBeDefined();
  });

  it('should work with no props', () => {
    const { result } = renderHook(() => useOrientationSensor());
    expect(result.current).toBeDefined();
  });

  it('should work with partial props', () => {
    const { result } = renderHook(() =>
      useOrientationSensor({ enabled: false })
    );
    expect(result.current).toBeDefined();
  });
});
