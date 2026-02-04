# Quickstart Guide: Device3DIndicator

**Component**: Device3DIndicator
**Purpose**: Display real-time 3D device orientation visualization with alignment detection
**Time to integrate**: 2 minutes

---

## Installation

```bash
# Install the library (if not already installed)
npm install react-native-vision-camera-extensions

# Required peer dependency
npm install react-native-reanimated
```

**Configuration**: Ensure React Native Reanimated is configured in your app:

```javascript
// babel.config.js
module.exports = {
  plugins: [
    'react-native-reanimated/plugin', // Must be last
  ],
};
```

---

## Basic Usage (30 seconds)

Drop into any view to display device orientation:

```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Camera } from 'react-native-vision-camera';
import { Device3DIndicator } from 'react-native-vision-camera-extensions';

function CameraScreen() {
  const device = useCameraDevice('back');

  if (!device) return null;

  return (
    <View style={styles.container}>
      {/* Camera view */}
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
      />

      {/* 3D orientation indicator - overlays camera */}
      <Device3DIndicator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CameraScreen;
```

**Result**: A 3D phone model appears on screen that rotates in real-time to match device orientation.

---

## User Story 1: Real-Time 3D Orientation Visualization (P1 - MVP)

### Positioned in Corner

```tsx
<Device3DIndicator
  style={{
    position: 'absolute',
    top: 60,
    right: 20,
  }}
  modelSize={100}
/>
```

### Custom Colors

```tsx
<Device3DIndicator
  modelColor="#4A90E2"  // iOS blue when not aligned
  alignedColor="#32CD32" // Lime green when aligned
  showShadow={true}
/>
```

### Larger Model

```tsx
<Device3DIndicator
  modelSize={180}  // Pixels
  // or
  modelSize="50%"  // Percentage of container width
/>
```

---

## User Story 2: Portrait Mode Alignment Detection (P2)

### Detect Portrait Alignment

```tsx
function CameraWithAlignment() {
  const [isAligned, setIsAligned] = useState(false);

  return (
    <>
      <Camera device={device} isActive={true} />

      <Device3DIndicator
        targetOrientation="portrait"
        alignmentTolerance={2}  // Within 2 degrees
        alignedColor="#00FF00"
        onAlignmentChange={(aligned) => {
          setIsAligned(aligned);
          if (aligned) {
            console.log('Device is level!');
            // Could trigger haptic feedback here
          }
        }}
      />

      {isAligned && (
        <Text style={styles.alignedText}>
          ✓ Device Aligned
        </Text>
      )}
    </>
  );
}
```

### Detect Landscape Alignment

```tsx
<Device3DIndicator
  targetOrientation="landscape"
  alignmentTolerance={3}  // More lenient
  onAlignmentChange={(aligned) => {
    if (aligned) {
      console.log('Device is in landscape mode');
    }
  }}
/>
```

### Custom Tolerance

```tsx
<Device3DIndicator
  alignmentTolerance={1}  // Strict: must be within 1°
  // or
  alignmentTolerance={5}  // Lenient: within 5° is okay
/>
```

---

## User Story 3: Numeric Angle Display (P3)

### Show Angle Values

```tsx
<Device3DIndicator
  showAngles={true}
  anglePrecision={1}  // One decimal place
  angleTextStyle={{
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'monospace',
  }}
/>
```

**Output**: Displays "P: 12.5° R: -3.2° Y: 45.1°" on screen

### Track Orientation Changes

```tsx
function OrientationTracker() {
  const [orientation, setOrientation] = useState<OrientationState | null>(null);

  return (
    <>
      <Device3DIndicator
        onOrientationChange={(orient) => {
          setOrientation(orient);
        }}
        orientationChangeThrottleMs={100}  // Update at most every 100ms
      />

      <View style={styles.debugPanel}>
        <Text>Pitch: {orientation?.pitch.toFixed(1)}°</Text>
        <Text>Roll: {orientation?.roll.toFixed(1)}°</Text>
        <Text>Yaw: {orientation?.yaw.toFixed(1)}°</Text>
      </View>
    </>
  );
}
```

---

## Full Customization Example

All features combined:

```tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Device3DIndicator, OrientationState } from 'react-native-vision-camera-extensions';

function AdvancedOrientationDemo() {
  const [orientation, setOrientation] = useState<OrientationState | null>(null);
  const [isAligned, setIsAligned] = useState(false);

  return (
    <View style={styles.container}>
      <Device3DIndicator
        // Visual
        modelColor="#4A90E2"
        alignedColor="#00FF00"
        modelSize={150}
        showShadow={true}
        shadowColor="#000000"

        // Alignment
        targetOrientation="portrait"
        alignmentTolerance={2}

        // Numeric display
        showAngles={true}
        angleTextStyle={styles.angleText}
        anglePrecision={1}

        // Performance
        updateInterval={33}  // 30 FPS
        enabled={true}

        // Callbacks
        onOrientationChange={(orient) => {
          setOrientation(orient);
        }}
        onAlignmentChange={(aligned) => {
          setIsAligned(aligned);
          if (aligned) {
            console.log('Aligned!');
          } else {
            console.log('Not aligned');
          }
        }}
        orientationChangeThrottleMs={100}

        // Layout
        style={styles.indicator}
      />

      {/* Status display */}
      <View style={styles.statusPanel}>
        <Text style={styles.statusText}>
          Status: {isAligned ? '✓ Aligned' : '○ Not Aligned'}
        </Text>
        {orientation && (
          <>
            <Text style={styles.statusText}>
              Pitch: {orientation.pitch.toFixed(1)}°
            </Text>
            <Text style={styles.statusText}>
              Roll: {orientation.roll.toFixed(1)}°
            </Text>
            <Text style={styles.statusText}>
              Yaw: {orientation.yaw.toFixed(1)}°
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  indicator: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
  },
  angleText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  statusPanel: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 10,
  },
  statusText: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 5,
  },
});

export default AdvancedOrientationDemo;
```

---

## Performance Tips

### Pause When Off-Screen

```tsx
function CameraTab() {
  const isFocused = useIsFocused(); // React Navigation hook

  return (
    <Device3DIndicator
      enabled={isFocused}  // Disable when tab is not focused
    />
  );
}
```

### Adjust Update Rate

```tsx
// Higher FPS (smoother but more battery)
<Device3DIndicator updateInterval={16} />  // 60 FPS

// Default (balanced)
<Device3DIndicator updateInterval={33} />  // 30 FPS

// Lower FPS (more efficient)
<Device3DIndicator updateInterval={50} />  // 20 FPS
```

### Throttle Callbacks

```tsx
<Device3DIndicator
  onOrientationChange={handleOrientationChange}
  orientationChangeThrottleMs={200}  // At most 5 times per second
/>
```

---

## Common Use Cases

### 1. Camera Level Indicator

Help users take straight photos:

```tsx
<Device3DIndicator
  targetOrientation="portrait"
  alignmentTolerance={2}
  alignedColor="#00FF00"
  style={{ position: 'absolute', top: 20, alignSelf: 'center' }}
/>
```

### 2. AR/VR Orientation Tracking

Track device rotation for AR experiences:

```tsx
<Device3DIndicator
  showAngles={false}
  onOrientationChange={({ pitch, roll, yaw }) => {
    // Update AR scene camera rotation
    updateARCamera(pitch, roll, yaw);
  }}
  updateInterval={16}  // 60 FPS for smooth AR
/>
```

### 3. Tilt-Controlled Game

Use device tilt as game input:

```tsx
<Device3DIndicator
  enabled={isGameActive}
  onOrientationChange={({ roll, pitch }) => {
    // Move game character based on tilt
    moveCharacter(roll, pitch);
  }}
  updateInterval={16}  // Low latency for gameplay
  style={{ display: 'none' }}  // Hide visual indicator
/>
```

### 4. Scientific Measurement Tool

Precise angle measurement:

```tsx
<Device3DIndicator
  showAngles={true}
  anglePrecision={2}  // Two decimal places
  angleFormat="degrees"
  onOrientationChange={saveToMeasurementLog}
/>
```

---

## Troubleshooting

### Component Not Visible

**Issue**: Component renders but nothing appears.

**Solutions**:
- Ensure `enabled={true}` (default)
- Check that `modelSize` is reasonable (default: 120)
- Verify container has sufficient space
- Check `style` prop isn't hiding component

### Orientation Not Updating

**Issue**: 3D model doesn't rotate.

**Solutions**:
- **iOS**: Check that motion permissions are granted
- **Android**: Verify accelerometer/gyroscope sensors are available
- Test on physical device (simulators may not have sensors)
- Check console for sensor error messages

### Alignment Never Triggers

**Issue**: `onAlignmentChange` never fires.

**Solutions**:
- Verify `alignmentTolerance` is reasonable (default: 2°)
- Check device is actually reaching target orientation
- Increase tolerance temporarily to test: `alignmentTolerance={10}`
- Ensure `targetOrientation` matches intended orientation

### Performance Issues / Lag

**Issue**: Animation is choppy or app feels slow.

**Solutions**:
- Reduce `updateInterval` (increase from 33ms to 50ms)
- Disable shadow: `showShadow={false}`
- Reduce model size: `modelSize={80}`
- Increase callback throttle: `orientationChangeThrottleMs={200}`
- Test in release build (dev mode adds overhead)

### Battery Drain

**Issue**: Excessive battery usage.

**Solutions**:
- Disable when not needed: `enabled={false}`
- Increase update interval: `updateInterval={50}` (20 FPS)
- Pause when app is backgrounded
- Increase callback throttle

---

## API Reference

For complete prop documentation, see:
- [Device3DIndicatorProps](./contracts/Device3DIndicator.types.ts)
- [OrientationState](./contracts/Device3DIndicator.types.ts)

---

## Next Steps

- **Example App**: See `example/src/App.tsx` for interactive demo
- **Testing**: Run example app on physical device to test all features
- **Customization**: Experiment with different colors, sizes, and thresholds
- **Integration**: Add to your camera screen or AR application

---

## Support

- **Issues**: [GitHub Issues](https://github.com/anderson-souza/react-native-vision-camera-extensions/issues)
- **Documentation**: [README.md](../../../README.md)
- **Examples**: [Example App](../../../example/)

---

**Quick Reference Card**:

| Feature | Prop | Example |
|---------|------|---------|
| Change color | `modelColor` | `"#4A90E2"` |
| Detect alignment | `onAlignmentChange` | `(aligned) => {...}` |
| Show angles | `showAngles` | `true` |
| Position | `style` | `{{ top: 50 }}` |
| Performance | `updateInterval` | `50` (20 FPS) |
| Tolerance | `alignmentTolerance` | `2` (degrees) |

**That's it!** You now have a fully functional 3D orientation indicator.
