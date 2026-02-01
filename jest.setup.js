// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const View = require('react-native').View;
  return {
    __esModule: true,
    default: {
      View: View,
    },
    useAnimatedSensor: jest.fn(() => ({
      sensor: { value: { x: 0, y: 0, z: 1 } },
    })),
    useAnimatedStyle: jest.fn((fn) => fn()),
    SensorType: {
      ACCELEROMETER: 'ACCELEROMETER',
    },
    runOnJS: jest.fn((fn) => fn),
    withTiming: jest.fn((value) => value),
  };
});
