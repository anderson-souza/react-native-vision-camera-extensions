// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const RN = jest.requireActual('react-native');
  return {
    __esModule: true,
    default: {
      View: RN.View,
      createAnimatedComponent: (component) => component,
    },
    useAnimatedSensor: jest.fn(() => ({
      sensor: { value: { x: 0, y: 0, z: 1 } },
    })),
    useAnimatedStyle: jest.fn((fn) => fn()),
    useAnimatedGestureHandler: jest.fn(() => ({})),
    useSharedValue: jest.fn((initial) => ({ value: initial })),
    SensorType: {
      ACCELEROMETER: 'ACCELEROMETER',
    },
    runOnJS: jest.fn((fn) => fn),
    withTiming: jest.fn((value) => value),
    withSpring: jest.fn((value) => value),
    createAnimatedComponent: (component) => component,
  };
});

// // Mock react-native-svg
// jest.mock('react-native-svg', () => {
//   const MockComponent = (name) => {
//     const component = ({ children }) => children || null;
//     component.displayName = name;
//     return component;
//   };
//   return {
//     __esModule: true,
//     default: MockComponent('Svg'),
//     Svg: MockComponent('Svg'),
//     Path: MockComponent('Path'),
//     Circle: MockComponent('Circle'),
//     Line: MockComponent('Line'),
//     Rect: MockComponent('Rect'),
//     Text: MockComponent('SvgText'),
//   };
// });

// // Mock react-native-gesture-handler
// jest.mock('react-native-gesture-handler', () => {
//   const RN = jest.requireActual('react-native');

//   // Create a chainable gesture mock
//   const createGestureMock = () => {
//     const gesture = {
//       onStart: jest.fn(() => gesture),
//       onUpdate: jest.fn(() => gesture),
//       onEnd: jest.fn(() => gesture),
//       onFinalize: jest.fn(() => gesture),
//       onBegin: jest.fn(() => gesture),
//       onChange: jest.fn(() => gesture),
//       onTouchesDown: jest.fn(() => gesture),
//       onTouchesMove: jest.fn(() => gesture),
//       onTouchesUp: jest.fn(() => gesture),
//       onTouchesCancelled: jest.fn(() => gesture),
//       enabled: jest.fn(() => gesture),
//       withTestId: jest.fn(() => gesture),
//       shouldCancelWhenOutside: jest.fn(() => gesture),
//       hitSlop: jest.fn(() => gesture),
//       minPointers: jest.fn(() => gesture),
//       maxPointers: jest.fn(() => gesture),
//       minDistance: jest.fn(() => gesture),
//       activeOffsetX: jest.fn(() => gesture),
//       activeOffsetY: jest.fn(() => gesture),
//       failOffsetX: jest.fn(() => gesture),
//       failOffsetY: jest.fn(() => gesture),
//     };
//     return gesture;
//   };

//   return {
//     __esModule: true,
//     PanGestureHandler: RN.View,
//     TapGestureHandler: RN.View,
//     State: {},
//     GestureHandlerRootView: RN.View,
//     GestureDetector: ({ children }) => children,
//     Gesture: {
//       Pan: () => createGestureMock(),
//       Tap: () => createGestureMock(),
//       Pinch: () => createGestureMock(),
//       Rotation: () => createGestureMock(),
//       Fling: () => createGestureMock(),
//       LongPress: () => createGestureMock(),
//       ForceTouch: () => createGestureMock(),
//       Native: () => createGestureMock(),
//       Manual: () => createGestureMock(),
//       Race: jest.fn((...gestures) => createGestureMock()),
//       Simultaneous: jest.fn((...gestures) => createGestureMock()),
//       Exclusive: jest.fn((...gestures) => createGestureMock()),
    // },
  // };
// });
