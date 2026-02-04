# Data Model: 3D Device Angle Indicator

**Feature**: 3D Device Angle Indicator
**Date**: 2026-02-02
**Purpose**: Define data structures and state management for orientation tracking

---

## Entity Definitions

### 1. OrientationState

**Purpose**: Represents the current 3D orientation of the device in space.

**Structure**:
```typescript
interface OrientationState {
  pitch: number;      // Rotation around X-axis (forward/backward tilt) in degrees [-180, 180]
  roll: number;       // Rotation around Y-axis (left/right tilt) in degrees [-180, 180]
  yaw: number;        // Rotation around Z-axis (compass heading) in degrees [-180, 180]
  timestamp: number;  // Milliseconds since epoch (Date.now())
}
```

**Field Descriptions**:

| Field | Type | Range | Description |
|-------|------|-------|-------------|
| `pitch` | number | -180 to 180° | Forward/backward tilt. 0° = vertical, +90° = tilted forward, -90° = tilted backward |
| `roll` | number | -180 to 180° | Left/right tilt. 0° = upright, +90° = tilted right, -90° = tilted left |
| `yaw` | number | -180 to 180° | Rotation around vertical axis. May drift without magnetometer calibration |
| `timestamp` | number | 0 to ∞ | Time when orientation was measured. Used for time-based debouncing |

**Relationships**:
- **Drives**: `Device3DModel` component transform properties (rotateX, rotateY, rotateZ)
- **Consumed by**: `AlignmentDetector` to determine if device is aligned to target orientation
- **Callback**: Optional `onOrientationChange` prop receives this state

**Validation Rules**:
- All angle values must be finite numbers (not NaN or Infinity)
- Angles outside [-180, 180] range should be normalized using modulo 360
- Timestamp must be monotonically increasing (detect sensor pause/resume)

**State Transitions**:
```
Sensor Update → Raw Quaternion → Euler Conversion → OrientationState → UI Update
```

---

### 2. AlignmentState

**Purpose**: Tracks whether device is aligned to a target orientation within tolerance.

**Structure**:
```typescript
interface AlignmentState {
  isAligned: boolean;                    // Current alignment status
  targetOrientation: 'portrait' | 'landscape'; // Target to align to
  tolerance: number;                     // Alignment threshold in degrees (default: 2°)
  deviationAngle: number;                // Angular distance from target in degrees [0, 180]
  lastTransitionTime: number;            // Milliseconds since last alignment state change
}
```

**Field Descriptions**:

| Field | Type | Range/Values | Description |
|-------|------|--------------|-------------|
| `isAligned` | boolean | true / false | Whether device is currently within tolerance of target orientation |
| `targetOrientation` | enum | 'portrait' \| 'landscape' | Target orientation to detect alignment for |
| `tolerance` | number | 0.1 to 45° | Maximum angular distance (degrees) to consider "aligned" |
| `deviationAngle` | number | 0 to 180° | Absolute angular distance from target orientation |
| `lastTransitionTime` | number | 0 to ∞ | Timestamp when alignment state last changed (for debouncing) |

**Relationships**:
- **Input**: Receives `OrientationState` and compares to target orientation
- **Output**: Triggers visual feedback changes (color, highlight)
- **Callbacks**: Triggers `onAlignmentChange` when `isAligned` transitions

**Validation Rules**:
- `tolerance` must be positive (> 0°)
- `deviationAngle` must be in range [0°, 180°]
- State transitions must be debounced (minimum 150ms between changes)

**State Machine**:
```
┌─────────────┐  deviation ≤ enterThreshold   ┌──────────┐
│ Misaligned  │ ──────────────────────────────> │ Aligned  │
│isAligned=false                                │isAligned=true
└─────────────┘ <────────────────────────────── └──────────┘
                 deviation > exitThreshold
```

**Hysteresis Parameters**:
- `enterThreshold`: `tolerance` (default: 2°)
- `exitThreshold`: `tolerance × 2` (default: 4°)
- Prevents flicker by requiring larger angle to exit than to enter

---

### 3. Quaternion (Internal)

**Purpose**: Intermediate representation for rotation calculations. Avoids gimbal lock.

**Structure**:
```typescript
interface Quaternion {
  w: number;  // Real/scalar component [-1, 1]
  x: number;  // Imaginary i component [-1, 1]
  y: number;  // Imaginary j component [-1, 1]
  z: number;  // Imaginary k component [-1, 1]
}
```

**Usage**:
- **Source**: Provided directly by `useAnimatedSensor(SensorType.ROTATION)`
- **Conversion**: Converted to Euler angles (`OrientationState`) for UI display
- **Alignment Calculation**: Used for precise angular distance via dot product

**Normalization Invariant**:
```
Math.sqrt(w² + x² + y² + z²) = 1
```

**Identity Quaternion** (no rotation):
```typescript
{ w: 1, x: 0, y: 0, z: 0 }
```

---

### 4. SensorReading (Internal)

**Purpose**: Raw sensor data from device motion sensors.

**Structure**:
```typescript
interface SensorReading {
  accelerometer: Vector3;  // Linear acceleration in m/s²
  gyroscope: Vector3;      // Angular velocity in rad/s
  rotation: {              // Pre-fused orientation from platform
    pitch: number;         // Radians
    roll: number;          // Radians
    yaw: number;           // Radians
    qw: number;            // Quaternion w
    qx: number;            // Quaternion x
    qy: number;            // Quaternion y
    qz: number;            // Quaternion z
  };
}

interface Vector3 {
  x: number;
  y: number;
  z: number;
}
```

**Transformation Pipeline**:
```
Hardware Sensors → Platform Sensor Fusion → SensorReading (ROTATION) → OrientationState
```

**Notes**:
- ROTATION sensor type provides pre-fused data (accelerometer + gyroscope combined by OS)
- Fallback to manual fusion if ROTATION unavailable (rare on modern devices)

---

## State Management Architecture

### Component State Hierarchy

```
Device3DIndicator (React Component)
├── useOrientationSensor (Hook)
│   ├── useAnimatedSensor(ROTATION) → SensorReading
│   ├── Shared Values (Reanimated)
│   │   ├── currentOrientation: SharedValue<OrientationState>
│   │   ├── alignmentState: SharedValue<AlignmentState>
│   │   └── lastUpdateTime: SharedValue<number>
│   └── useAnimatedStyle → Transform Styles
├── Device3DModel (Visual Component)
│   └── Animated.View with transform styles
└── Optional Angle Text Display
```

### Shared Values (Reanimated)

All state managed via `SharedValue<T>` for UI thread execution:

```typescript
const pitch = useSharedValue(0);
const roll = useSharedValue(0);
const yaw = useSharedValue(0);
const isAligned = useSharedValue(false);
const deviationAngle = useSharedValue(0);
```

**Why Shared Values**:
- Enable worklet execution (runs on UI thread)
- Avoid JavaScript bridge for sensor updates
- Ensure 30 FPS performance target

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Device Hardware Sensors                      │
│              (Accelerometer + Gyroscope + Magnetometer)          │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│              Platform Sensor Fusion (iOS/Android OS)             │
│         Combines sensors, handles calibration, drift             │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│      React Native Reanimated: useAnimatedSensor(ROTATION)        │
│        Returns: { pitch, roll, yaw, qw, qx, qy, qz }            │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│              useOrientationSensor Hook (UI Thread)               │
│                                                                   │
│  1. Convert radians → degrees                                    │
│  2. Calculate quaternion angular distance to target              │
│  3. Apply hysteresis + debouncing to alignment detection         │
│  4. Update SharedValues (pitch, roll, yaw, isAligned)           │
└───────────────────┬──────────────────────┬──────────────────────┘
                    │                      │
                    ▼                      ▼
┌──────────────────────────────┐  ┌────────────────────────────┐
│   useAnimatedStyle           │  │   Callbacks (JS Thread)    │
│                              │  │                            │
│  Returns:                    │  │  runOnJS(() => {          │
│  {                           │  │    onOrientationChange()  │
│    transform: [              │  │    onAlignmentChange()    │
│      { perspective: 1200 },  │  │  })                       │
│      { rotateX: pitch },     │  │                            │
│      { rotateY: yaw },       │  └────────────────────────────┘
│      { rotateZ: roll }       │
│    ],                        │
│    backgroundColor: aligned  │
│      ? alignedColor          │
│      : modelColor            │
│  }                           │
└──────────────┬───────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   Device3DModel Visual Component        │
│   - Front/back faces                    │
│   - Edge views                          │
│   - Shadow (dynamic based on tilt)      │
│   - Highlight/glare effect              │
└─────────────────────────────────────────┘
```

---

## Persistence and Lifetime

### Component Lifecycle

**Mount**:
1. Initialize sensor with `useAnimatedSensor`
2. Set default `SharedValue` states (0° for all angles)
3. Create alignment detector with hysteresis config

**Active**:
1. Sensor updates at 33ms intervals (30 FPS)
2. Worklets process each update on UI thread
3. Animated styles re-calculate transforms
4. Callbacks throttled to JS thread (100ms default)

**Unmount**:
1. Sensor automatically cleaned up by Reanimated
2. SharedValues garbage collected
3. No persistence needed (stateless component)

### No Persistent Storage

Component is **fully stateless**:
- No AsyncStorage
- No state restoration needed
- Orientation recalculated from live sensors on each mount

---

## Edge Cases and Error States

### Sensor Unavailable

```typescript
interface SensorErrorState {
  hasError: boolean;
  errorMessage: string;
}

// Example: ROTATION sensor not available on device
{
  hasError: true,
  errorMessage: 'ROTATION sensor not available on this device'
}
```

**Handling**:
- Display fallback message to user
- Hide 3D visualization
- Graceful degradation (component doesn't crash)

### Invalid Sensor Data

```typescript
function isValidSensorReading(sensor: SensorReading): boolean {
  'worklet';
  return (
    isFinite(sensor.rotation.pitch) &&
    isFinite(sensor.rotation.roll) &&
    isFinite(sensor.rotation.yaw) &&
    Math.abs(sensor.rotation.qw**2 + sensor.rotation.qx**2 +
             sensor.rotation.qy**2 + sensor.rotation.qz**2 - 1) < 0.01
  );
}
```

**Recovery**: Skip invalid frames, continue with previous valid state.

### Gimbal Lock (Device Flat)

When device is face-up or face-down (pitch ≈ ±90°), yaw becomes ambiguous.

**Detection**:
```typescript
const isNearGimbalLock = Math.abs(Math.abs(pitch) - 90) < 5;
```

**Handling**: Continue displaying orientation, but note that yaw may jump discontinuously.

---

## Performance Considerations

### Memory Footprint

| Entity | Size | Count | Total |
|--------|------|-------|-------|
| OrientationState | ~64 bytes | 1 | 64 bytes |
| AlignmentState | ~80 bytes | 1 | 80 bytes |
| Quaternion | ~64 bytes | 2 (current + reference) | 128 bytes |
| SharedValues | ~32 bytes | 8 | 256 bytes |
| **Total** | | | **~528 bytes** |

**Negligible memory impact** - all state fits in L1 cache.

### Update Frequency

- **Sensor updates**: 30 Hz (every 33ms)
- **Visual updates**: 30 FPS (every 33ms)
- **JS callbacks**: Throttled to 10 Hz (every 100ms)

**Rationale**: Visual updates need 30 FPS for smooth animation, but callback logic can be slower to reduce JS thread overhead.

---

## Validation and Testing

### Unit Test Cases

```typescript
describe('OrientationState', () => {
  it('converts radians to degrees correctly', () => {
    const radians = { pitch: Math.PI / 4, roll: 0, yaw: Math.PI / 2 };
    const degrees = convertToDegrees(radians);
    expect(degrees.pitch).toBeCloseTo(45);
    expect(degrees.roll).toBeCloseTo(0);
    expect(degrees.yaw).toBeCloseTo(90);
  });

  it('normalizes angles to [-180, 180] range', () => {
    expect(normalizeAngle(270)).toBeCloseTo(-90);
    expect(normalizeAngle(-270)).toBeCloseTo(90);
  });
});

describe('AlignmentState', () => {
  it('detects portrait alignment within 2° tolerance', () => {
    const detector = createAlignmentDetector({ tolerance: 2 });
    const result = detector.check({ roll: 1.5, pitch: 0 });
    expect(result.isAligned).toBe(true);
  });

  it('applies hysteresis to prevent flicker', () => {
    const detector = createAlignmentDetector({ tolerance: 2 });

    // Enter aligned state
    detector.check({ roll: 1 }, 0);
    expect(detector.isAligned).toBe(true);

    // Stay aligned at 3° (within 4° exit threshold)
    detector.check({ roll: 3 }, 200);
    expect(detector.isAligned).toBe(true);

    // Exit at 5°
    detector.check({ roll: 5 }, 400);
    expect(detector.isAligned).toBe(false);
  });
});
```

---

## Summary

The data model is designed for:
- **Simplicity**: Minimal state, no persistence
- **Performance**: Shared values for UI thread execution
- **Reliability**: Validation, error handling, hysteresis
- **Testability**: Pure functions, deterministic state transitions

All entities map directly to component props and sensor data, creating a clean unidirectional data flow from hardware → platform → Reanimated → UI.

**Status**: ✅ Ready for implementation
