# react-native-vision-camera-extensions

A set of tools to extend Vision Camera with useful camera overlays and utilities.

## Installation

```sh
npm install react-native-vision-camera-extensions
# or
yarn add react-native-vision-camera-extensions
```

**Required peer dependencies:**

- `react-native-reanimated` (for accelerometer-based features and animations)
- `react-native-svg` (for CameraController icons)
- `react-native-gesture-handler` (for CameraController sliders)

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

---

### CameraController

A comprehensive camera controls bar that groups common camera settings like flash, zoom, HDR, focus, exposure, and white balance into a single, animated horizontal bar.

#### Basic Usage

```tsx
import { CameraController } from 'react-native-vision-camera-extensions';

function CameraScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} />
      <View style={{ position: 'absolute', bottom: 100, left: 16, right: 16 }}>
        <CameraController />
      </View>
    </View>
  );
}
```

#### Advanced Usage

```tsx
import { CameraController } from 'react-native-vision-camera-extensions';

function CameraScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} />
      <View style={{ position: 'absolute', bottom: 100, left: 16, right: 16 }}>
        <CameraController
          controls={['flash', 'angleLine', 'zoom', 'hdr']}
          initialState={{
            flash: 'auto',
            zoom: 1,
          }}
          zoomRange={{ min: 1, max: 10 }}
          exposureRange={{ min: -2, max: 2 }}
          iconColor="#FFFFFF"
          activeIconColor="#FFD700"
          backgroundColor="rgba(0, 0, 0, 0.6)"
          onFlashChange={(mode) => console.log('Flash:', mode)}
          onZoomChange={(level) => console.log('Zoom:', level)}
          onAngleLineToggle={(enabled) => console.log('AngleLine:', enabled)}
          onHDRChange={(enabled) => console.log('HDR:', enabled)}
          onFocusChange={(mode, value) => console.log('Focus:', mode, value)}
          onExposureChange={(value) => console.log('Exposure:', value)}
          onWhiteBalanceChange={(preset) => console.log('WB:', preset)}
          onStateChange={(state) => console.log('State changed:', state)}
        />
      </View>
    </View>
  );
}
```

#### Props

| Prop                  | Type                                            | Default                                                                           | Description                                 |
| --------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------- |
| `controls`            | `ControlName[]`                                 | `['flash', 'angleLine', 'zoom', 'hdr', 'focus', 'exposure', 'whiteBalance']`      | Which controls to display                   |
| `initialState`        | `Partial<CameraControllerState>`                | `undefined`                                                                       | Initial state values                        |
| `zoomRange`           | `{ min: number; max: number }`                  | `{ min: 1, max: 10 }`                                                             | Zoom range configuration                    |
| `exposureRange`       | `{ min: number; max: number }`                  | `{ min: -2, max: 2 }`                                                             | Exposure range configuration                |
| `style`               | `ViewStyle`                                     | `undefined`                                                                       | Container style                             |
| `barStyle`            | `ViewStyle`                                     | `undefined`                                                                       | Control bar style                           |
| `iconColor`           | `string`                                        | `'#FFFFFF'`                                                                       | Icon color for inactive state               |
| `activeIconColor`     | `string`                                        | `'#FFD700'`                                                                       | Icon color for active state                 |
| `backgroundColor`     | `string`                                        | `'rgba(0, 0, 0, 0.6)'`                                                            | Background color of the control bar         |
| `onFlashChange`       | `(mode: FlashMode) => void`                     | `undefined`                                                                       | Callback when flash mode changes            |
| `onAngleLineToggle`   | `(enabled: boolean) => void`                    | `undefined`                                                                       | Callback when angle line is toggled         |
| `onZoomChange`        | `(level: number) => void`                       | `undefined`                                                                       | Callback when zoom level changes            |
| `onHDRChange`         | `(enabled: boolean) => void`                    | `undefined`                                                                       | Callback when HDR is toggled                |
| `onFocusChange`       | `(mode: FocusMode, value?: number) => void`     | `undefined`                                                                       | Callback when focus mode/value changes      |
| `onExposureChange`    | `(value: number) => void`                       | `undefined`                                                                       | Callback when exposure changes              |
| `onWhiteBalanceChange`| `(preset: WhiteBalancePreset) => void`          | `undefined`                                                                       | Callback when white balance preset changes  |
| `onStateChange`       | `(state: CameraControllerState) => void`        | `undefined`                                                                       | Callback when any state changes             |

#### Types

```typescript
type FlashMode = 'off' | 'on' | 'auto';
type FocusMode = 'auto' | 'manual';
type WhiteBalancePreset = 'auto' | 'daylight' | 'cloudy' | 'tungsten' | 'fluorescent';
type ControlName = 'flash' | 'angleLine' | 'zoom' | 'hdr' | 'focus' | 'exposure' | 'whiteBalance';
```

#### Features

- **7 Camera Controls**: Flash, Angle Line, Zoom, HDR, Focus, Exposure, White Balance
- **Configurable**: Choose which controls to display
- **Animated UI**: Smooth spring animations using Reanimated
- **Expandable Panels**: Sliders and options expand with animation
- **Internal State Management**: Component manages its own state with callbacks
- **Customizable Appearance**: Control colors, background, and styling
- **TypeScript Support**: Full type definitions included

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
