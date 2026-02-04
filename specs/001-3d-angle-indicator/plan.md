# Implementation Plan: 3D Device Angle Indicator

**Branch**: `001-3d-angle-indicator` | **Date**: 2026-02-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/001-3d-angle-indicator/spec.md`

## Summary

Build a React Native component that displays a real-time 3D visual representation of device orientation using accelerometer and gyroscope data. The component will show pitch, roll, and yaw rotations, detect portrait alignment within configurable tolerance, provide visual feedback when aligned, and optionally display numeric angle values. Performance target is 30 FPS with minimal battery impact (<2%). Component follows existing AngleLine architecture pattern using Reanimated worklets for UI thread execution.

## Technical Context

**Language/Version**: TypeScript 5.9+ (strict mode)
**Primary Dependencies**: React Native 0.81+, React Native Reanimated 3.16+ (peer dependency)
**Storage**: N/A (stateless component, sensor-driven)
**Testing**: Jest (unit tests), React Native Testing Library (component tests), Example app (integration/manual testing)
**Target Platform**: iOS 15+ and Android (cross-platform, no native modules)
**Project Type**: Single library project (React Native component library)
**Performance Goals**: 30 FPS animation updates, <50ms sensor response time, <5% camera render overhead, <2% battery impact
**Constraints**: Pure JavaScript/TypeScript (no native modules per constitution), UI thread execution via Reanimated worklets, minimum 80% test coverage, React Native 0.70+ backward compatibility
**Scale/Scope**: Single exportable component with ~8-12 props, 3 user stories (P1 MVP + P2/P3 enhancements), reusable across multiple camera applications

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Code Quality Standards
- ✅ **TypeScript strict mode**: Component will use explicit typing throughout
- ✅ **ESLint/Prettier**: Existing project configuration will be followed
- ✅ **Single responsibility**: Component focused solely on 3D orientation visualization
- **Status**: COMPLIANT

### Principle II: Testing Discipline (NON-NEGOTIABLE)
- ✅ **80% test coverage**: Unit tests for orientation calculations, component rendering, prop variations
- ✅ **Integration tests**: Accelerometer/gyroscope integration, Reanimated worklet behavior, alignment detection
- ✅ **Example app demo**: 3D indicator will be added to example app with all customization options showcased
- **Status**: COMPLIANT - TDD workflow required during implementation

### Principle III: User Experience Consistency
- ✅ **Full customization**: Props for colors, size, position, tolerance, callbacks (following AngleLine pattern)
- ✅ **iOS/Android parity**: Pure JS/TS implementation ensures identical behavior
- ✅ **Optional callbacks**: All event handlers (onOrientationChange, onAlignmentChange) are optional
- ✅ **React Native conventions**: Props named `onEventName`, `enabled`, `style` matching platform standards
- **Status**: COMPLIANT

### Principle IV: Performance Requirements
- ⚠️ **UI thread execution**: MUST use Reanimated worklets (same as AngleLine)
- ⚠️ **60 FPS target**: Constitution specifies 60 FPS, but spec approved 30 FPS for battery balance
- ✅ **Minimize re-renders**: Use React.memo, useMemo, useCallback for optimization
- ✅ **Bundle size**: Component reuses existing Reanimated dependency, minimal KB addition
- **Status**: MINOR VARIANCE - 30 FPS approved vs constitution's 60 FPS (justified by battery concerns in spec SC-003, SC-006)

### Principle V: API Design & Documentation
- ✅ **TSDoc comments**: All exports require @param, @returns, @example
- ✅ **README examples**: Copy-paste ready code for basic + advanced usage
- ✅ **Props table**: Standard format with Type, Default, Description columns
- ✅ **Semantic versioning**: New component = MINOR version bump (0.1.0 → 0.2.0)
- **Status**: COMPLIANT

### Principle VI: Dependency Management
- ✅ **Minimize dependencies**: Reuses existing react-native-reanimated peer dependency
- ✅ **No new dependencies**: 3D rendering via React Native Views/Animated transforms (no 3D libraries needed)
- ✅ **No native modules**: Pure TypeScript implementation
- ✅ **Backward compatibility**: Support React Native 0.70+
- **Status**: COMPLIANT

### Overall Constitution Compliance: ✅ PASS with justified variance
- **Variance Justification**: 30 FPS target approved in spec (FR-006) balances smoothness vs battery impact. Success criteria SC-003 explicitly validates 30 FPS without dropped frames. Constitution Principle IV states "60 FPS on modern devices" as ideal, but spec's measurable battery constraint (SC-006: <2% increase) takes precedence for this sensor-intensive feature.

## Project Structure

### Documentation (this feature)

```text
specs/001-3d-angle-indicator/
├── plan.md              # This file
├── spec.md              # Feature specification (complete)
├── research.md          # Phase 0: 3D rendering approaches, orientation math
├── data-model.md        # Phase 1: Orientation state, alignment detection
├── quickstart.md        # Phase 1: Developer integration guide
└── contracts/           # Phase 1: Component API contract (TypeScript types)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── AngleLine/           # Existing component (reference architecture)
│   │   ├── AngleLine.tsx
│   │   ├── useAngleSensor.ts
│   │   ├── types.ts
│   │   ├── constants.ts
│   │   ├── styles.ts
│   │   └── utils.ts
│   └── Device3DIndicator/   # New component (this feature)
│       ├── Device3DIndicator.tsx       # Main component
│       ├── useOrientationSensor.ts     # Sensor hook (pitch/roll/yaw)
│       ├── Device3DModel.tsx           # 3D visual representation
│       ├── OrientationCalculator.ts    # Quaternion/Euler math utilities
│       ├── types.ts                    # TypeScript interfaces
│       ├── constants.ts                # Defaults (colors, thresholds, FPS)
│       ├── styles.ts                   # StyleSheet definitions
│       └── index.ts                    # Public exports
├── index.tsx                # Library entry (export Device3DIndicator)
└── __tests__/
    └── Device3DIndicator/
        ├── Device3DIndicator.test.tsx
        ├── useOrientationSensor.test.ts
        ├── OrientationCalculator.test.ts
        └── integration.test.tsx

example/
└── src/
    └── App.tsx              # Demo 3D indicator with customization UI
```

**Structure Decision**: Single library project structure (Option 1). Component follows existing AngleLine pattern: main component file + custom hook + utilities + types. No backend/frontend split needed. Testing mirrors src structure under `__tests__/`.

## Complexity Tracking

> **No violations requiring justification**

The 30 FPS variance is documented above in Constitution Check and justified by battery efficiency requirements (SC-006).

## Phase 0: Research & Unknowns Resolution

### Research Tasks

1. **3D Orientation Representation Approaches**
   - **Question**: How to render a 3D device model using only React Native primitives (no native 3D libraries)?
   - **Research**: Investigate CSS-like 3D transforms via Animated.View's `transform` property (rotateX, rotateY, rotateZ, perspective)
   - **Alternatives**: SVG path manipulation, pre-rendered sprite sheets, external 3D library (rejected per constitution)

2. **Orientation Calculation from Sensors**
   - **Question**: How to convert accelerometer/gyroscope raw data to pitch/roll/yaw angles?
   - **Research**: Sensor fusion algorithms, quaternion math, Euler angle conversion, gimbal lock handling
   - **Existing Reference**: AngleLine component uses `useAnimatedSensor` from Reanimated - can this be extended for 3-axis orientation?

3. **Alignment Detection Algorithm**
   - **Question**: How to detect portrait orientation within 2° tolerance across all 3 axes?
   - **Research**: Define portrait reference quaternion, calculate angular distance, threshold comparison
   - **Edge Cases**: Upside-down detection (180° roll), landscape vs portrait base orientation (FR-012)

4. **Performance Optimization for 30 FPS**
   - **Question**: How to ensure consistent 30 FPS with sensor processing + 3D rendering on UI thread?
   - **Research**: Reanimated worklet optimization patterns, frame skip strategies, throttling vs debouncing
   - **Reference**: AngleLine achieves 60 FPS with 2D rotation - assess 3D transform performance overhead

5. **React Native 3D Transform Limitations**
   - **Question**: Can React Native's `transform` property handle realistic 3D device visualization?
   - **Research**: Test `perspective`, `rotateX/Y/Z` combinations, layering for depth perception, shadow/highlight effects
   - **Fallback**: If transforms insufficient, design simplified 3D representation (wireframe, abstract shape)

### Research Outputs Expected

- **research.md** containing:
  - Decision: Use React Native Animated transforms with perspective for 3D rendering
  - Decision: Sensor fusion algorithm (complementary filter or quaternion-based)
  - Decision: Alignment detection using quaternion dot product or Euler angle ranges
  - Code samples: Sensor data → Euler angles conversion
  - Performance benchmarks: 3D transform render cost on target devices

## Phase 1: Design & Contracts

### Data Model (data-model.md)

**OrientationState**
- pitch: number (degrees, -180 to 180)
- roll: number (degrees, -180 to 180)
- yaw: number (degrees, -180 to 180)
- timestamp: number (ms)
- Relationships: Drives 3D model rotation via transform props

**AlignmentState**
- isAligned: boolean
- targetOrientation: 'portrait' | 'landscape'
- tolerance: number (degrees, default 2°)
- deviationAngle: number (degrees from target)
- Relationships: Triggers visual feedback color change (FR-004)

**SensorReading** (internal)
- accelerometer: { x, y, z } (m/s²)
- gyroscope: { x, y, z } (rad/s)
- Transformation: Raw sensor → OrientationState via fusion algorithm

### API Contracts (contracts/)

**Device3DIndicatorProps** (TypeScript interface)

```typescript
export interface Device3DIndicatorProps {
  // Visual customization
  modelColor?: string;              // Default: '#FFFFFF'
  alignedColor?: string;            // Default: '#00FF00'
  modelSize?: number | string;      // Default: 120 (pixels or '30%')
  showShadow?: boolean;             // Default: true

  // Alignment detection
  targetOrientation?: 'portrait' | 'landscape'; // Default: 'portrait'
  alignmentTolerance?: number;      // Default: 2 (degrees)

  // Numeric display
  showAngles?: boolean;             // Default: false (P3 feature)
  angleTextStyle?: TextStyle;

  // Performance tuning
  updateInterval?: number;          // Default: 33ms (~30 FPS)
  enabled?: boolean;                // Default: true

  // Callbacks (all optional)
  onOrientationChange?: (orientation: OrientationState) => void;
  onAlignmentChange?: (isAligned: boolean) => void;
  orientationChangeThrottleMs?: number; // Default: 100ms

  // Layout
  style?: ViewStyle;
}
```

**Public Exports**
```typescript
export { Device3DIndicator } from './components/Device3DIndicator';
export type {
  Device3DIndicatorProps,
  OrientationState,
  AlignmentState
} from './components/Device3DIndicator';
```

### Quickstart Guide (quickstart.md)

**Basic Integration** (30 seconds)
```tsx
import { Device3DIndicator } from 'react-native-vision-camera-extensions';

<Camera device={device} isActive={true}>
  <Device3DIndicator />
</Camera>
```

**With Alignment Detection** (P2 feature)
```tsx
<Device3DIndicator
  alignedColor="#00FF00"
  onAlignmentChange={(aligned) => {
    if (aligned) console.log('Device is level!');
  }}
/>
```

**Full Customization** (P3 feature)
```tsx
<Device3DIndicator
  modelColor="#4A90E2"
  modelSize={150}
  showAngles={true}
  targetOrientation="portrait"
  alignmentTolerance={3}
  onOrientationChange={({ pitch, roll, yaw }) => {
    console.log(`P: ${pitch}° R: ${roll}° Y: ${yaw}°`);
  }}
/>
```

### Re-evaluation of Constitution Check Post-Design

**Principle IV Performance Requirements** - Reassessed after Phase 1:
- ✅ 3D transforms via Reanimated worklets confirmed feasible (research.md)
- ✅ 30 FPS target validated by performance benchmarks
- ✅ No additional bridge crossings beyond existing Reanimated sensor API
- **Final Status**: COMPLIANT with justified 30 FPS target

**No new violations introduced in Phase 1 design.**

## Next Steps

After completing `/speckit.plan`:
1. Run `/speckit.tasks` to generate Phase 2 task breakdown
2. Tasks will be organized by user story (P1 → P2 → P3) for incremental delivery
3. Implementation follows TDD: tests first, then code to pass tests
4. Example app integration after each user story for validation

---

## Phase 0 & Phase 1 Status: ✅ COMPLETE

### Phase 0 Deliverables (Research)

- ✅ **research.md**: All technical unknowns resolved
  - 3D rendering approach: Native transforms confirmed
  - Sensor fusion: ROTATION sensor type chosen
  - Alignment detection: Quaternion distance with hysteresis
  - Performance validation: 30 FPS achievable

### Phase 1 Deliverables (Design & Contracts)

- ✅ **data-model.md**: Complete entity definitions
  - OrientationState (pitch, roll, yaw)
  - AlignmentState (isAligned, deviationAngle)
  - Quaternion (internal representation)
  - State flow diagrams

- ✅ **contracts/Device3DIndicator.types.ts**: Full TypeScript API contract
  - Device3DIndicatorProps interface (all 20+ props documented)
  - OrientationState type
  - Default values and validation constraints
  - TSDoc comments for IDE autocomplete

- ✅ **quickstart.md**: Developer integration guide
  - 30-second basic usage
  - Examples for all 3 user stories
  - Performance tips and troubleshooting
  - Common use cases (AR, camera level, games)

### Constitution Re-Check: ✅ PASS

No new violations introduced. 30 FPS variance remains justified by battery efficiency requirements.

---

**Plan Status**: ✅ COMPLETE - Ready for `/speckit.tasks`
