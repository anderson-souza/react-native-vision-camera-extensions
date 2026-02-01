# react-native-vision-camera-extensions

A set of tools to extend Vision Camera with useful camera overlays and utilities.

## Installation

```sh
npm install react-native-vision-camera-extensions
# or
yarn add react-native-vision-camera-extensions
```

**Required peer dependencies:**

- `react-native-reanimated` (for accelerometer-based features)

## Components

### AngleLine

A real-time visual indicator that displays your device's horizontal tilt angle using accelerometer data. Perfect for leveling shots, alignment guides, or horizontal reference overlays in camera applications.

#### Basic Usage

```tsx
import { AngleLine } from 'react-native-vision-camera-extensions';

function CameraScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} />
      <AngleLine />
    </View>
  );
}
```

#### Advanced Usage

```tsx
import { AngleLine } from 'react-native-vision-camera-extensions';

function CameraScreen() {
  const handleAngleChange = (angle: number) => {
    console.log('Current angle:', angle);
  };

  const handleLevelReached = () => {
    console.log('Device is level!');
  };

  return (
    <View style={{ flex: 1 }}>
      <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} />
      <AngleLine
        lineColor="#FFFFFF"
        levelIndicatorColor="#00FF00"
        lineWidth={3}
        lineLength="90%"
        showAngleText={true}
        showReferenceLine={true}
        levelThreshold={2}
        updateInterval={50}
        angleChangeThrottleMs={100}
        onAngleChange={handleAngleChange}
        onLevelReached={handleLevelReached}
        onLevelLost={() => console.log('No longer level')}
        style={{ position: 'absolute', top: 100 }}
      />
    </View>
  );
}
```

#### Props

| Prop                    | Type                      | Default                   | Description                                          |
| ----------------------- | ------------------------- | ------------------------- | ---------------------------------------------------- |
| `lineColor`             | `string`                  | `'#FFFFFF'`               | Color of the rotating indicator line                 |
| `lineWidth`             | `number`                  | `2`                       | Width/thickness of the lines in pixels               |
| `lineLength`            | `number \| string`        | `'80%'`                   | Length of the rotating line (pixels or percentage)   |
| `levelIndicatorColor`   | `string`                  | `'#00FF00'`               | Color when device is level (within threshold)        |
| `referenceLineColor`    | `string`                  | `'rgba(255,255,255,0.3)'` | Color of the static reference line                   |
| `showReferenceLine`     | `boolean`                 | `true`                    | Whether to show the static horizontal reference line |
| `levelThreshold`        | `number`                  | `1`                       | Degrees tolerance to consider device "level"         |
| `updateInterval`        | `number`                  | `50`                      | Sensor update interval in milliseconds               |
| `showAngleText`         | `boolean`                 | `false`                   | Whether to show the numeric angle value              |
| `angleTextStyle`        | `TextStyle`               | `undefined`               | Custom style for the angle text                      |
| `enabled`               | `boolean`                 | `true`                    | Whether the sensor is enabled                        |
| `style`                 | `ViewStyle`               | `undefined`               | Style for the container view                         |
| `angleChangeThrottleMs` | `number`                  | `100`                     | Throttle interval for `onAngleChange` callback       |
| `onAngleChange`         | `(angle: number) => void` | `undefined`               | Callback when angle changes                          |
| `onLevelReached`        | `() => void`              | `undefined`               | Callback when device becomes level                   |
| `onLevelLost`           | `() => void`              | `undefined`               | Callback when device is no longer level              |

#### Features

- **Real-time accelerometer tracking**: Updates at configurable intervals (default 50ms)
- **Visual feedback**: Line rotates to match device tilt, changes color when level
- **Callbacks**: Get notified when angle changes or level state changes
- **Customizable appearance**: Control colors, sizes, and visibility
- **Performance optimized**: Runs on UI thread using Reanimated worklets
- **TypeScript support**: Full type definitions included

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
