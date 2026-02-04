# Feature Specification: 3D Device Angle Indicator

**Feature Branch**: `001-3d-angle-indicator`
**Created**: 2026-02-02
**Status**: Draft
**Input**: User description: "Build a new tool for React Native Vision Camera that will show the device angle in a 3D aspect. The feature must show if the phone is aligned in portrait mode, or if is tilted to any angle."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Real-Time 3D Orientation Visualization (Priority: P1)

A camera app developer integrates the 3D angle indicator component into their camera view. Users can see a 3D visual representation that rotates in real-time to match the device's current orientation, making it immediately clear whether the phone is held in portrait orientation or tilted at any angle.

**Why this priority**: This is the core functionality that delivers the primary value - a visual 3D representation of device orientation. Without this, the feature doesn't exist.

**Independent Test**: Can be fully tested by mounting the component in a camera view, physically rotating the device in different orientations (portrait, landscape, tilted), and verifying that the 3D visualization updates smoothly to reflect the actual device angle in real-time.

**Acceptance Scenarios**:

1. **Given** the camera is active with the 3D angle indicator visible, **When** the device is held in standard portrait orientation (vertical, 0° tilt), **Then** the 3D visualization displays the device representation in an upright position
2. **Given** the camera is active with the 3D angle indicator visible, **When** the device is tilted 45° to the right, **Then** the 3D visualization rotates to match the 45° tilt in real-time
3. **Given** the camera is active with the 3D angle indicator visible, **When** the device is rotated from portrait to landscape, **Then** the 3D visualization smoothly animates the rotation to reflect the new orientation
4. **Given** the camera is active with the 3D angle indicator visible, **When** the device is tilted forward or backward (pitch), **Then** the 3D visualization accurately reflects the forward/backward tilt angle

---

### User Story 2 - Portrait Mode Alignment Detection (Priority: P2)

A user needs to know when their device is perfectly aligned in portrait mode for taking straight photos. The 3D angle indicator provides visual feedback (color change or highlight) when the device is within acceptable alignment tolerances of portrait orientation.

**Why this priority**: This adds practical utility by helping users achieve perfect alignment, which is a common use case for camera applications (similar to the existing AngleLine component's level detection).

**Independent Test**: Can be tested by slowly rotating the device around portrait orientation and verifying that visual feedback (highlight/color change) appears when within tolerance threshold and disappears when outside the threshold.

**Acceptance Scenarios**:

1. **Given** the device is within 2° of perfect portrait orientation, **When** the user views the 3D indicator, **Then** the visualization changes color or displays a highlight to indicate proper alignment
2. **Given** the device is tilted more than 2° from portrait orientation, **When** the user views the 3D indicator, **Then** the visualization shows the normal state without alignment confirmation
3. **Given** the device transitions from misaligned to aligned, **When** the orientation crosses the alignment threshold, **Then** the visual feedback activates smoothly without flickering

---

### User Story 3 - Numeric Angle Display (Priority: P3)

Power users or technical applications need precise numeric angle readings alongside the visual 3D representation. The component displays the current pitch, roll, and yaw angles in degrees for precise orientation measurement.

**Why this priority**: This is valuable for technical use cases but not essential for the core user experience. The 3D visualization provides sufficient feedback for most users.

**Independent Test**: Can be tested by comparing displayed numeric values against the device's actual orientation angles, verifying accuracy and real-time updates as the device is rotated.

**Acceptance Scenarios**:

1. **Given** the device is rotated to various orientations, **When** the user views the angle display, **Then** numeric values for pitch, roll, and yaw are shown and update in real-time with device movement
2. **Given** the device is in portrait orientation, **When** the user views the angle display, **Then** the roll angle shows approximately 0° and other angles reflect the device's position
3. **Given** the numeric display is enabled, **When** angles update rapidly during device movement, **Then** values are readable and update smoothly without excessive jitter

---

### Edge Cases

- What happens when the device is held upside down (180° rotation)?
- How does the system handle rapid device movement or shaking?
- What happens when accelerometer data is unavailable or unreliable?
- How does the component behave when the device is laid flat on a surface?
- What happens during the transition between different orientation states?
- How does performance degrade on older/slower devices?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Component MUST render a 3D visual representation of the device that updates in real-time based on accelerometer/gyroscope data
- **FR-002**: Component MUST accurately reflect device orientation across all three axes (pitch, roll, yaw)
- **FR-003**: Component MUST detect when device is aligned in portrait orientation within a configurable tolerance threshold (default 2°)
- **FR-004**: Component MUST provide visual feedback (color change or highlight) when portrait alignment is achieved
- **FR-005**: Component MUST support optional display of numeric angle values for pitch, roll, and yaw
- **FR-006**: Component MUST update orientation visualization smoothly at 30 FPS (frames per second) to balance smoothness and performance
- **FR-007**: Component MUST work as an overlay on camera views without blocking camera functionality
- **FR-008**: Component MUST allow customization of colors, size, and position through props
- **FR-009**: Component MUST provide callbacks for orientation change events and alignment state changes
- **FR-010**: Component MUST handle sensor unavailability gracefully with appropriate fallback or error state
- **FR-011**: Component MUST allow developers to configure alignment tolerance threshold
- **FR-012**: Component MUST support both portrait and landscape base orientations
- **FR-013**: Component MUST minimize battery impact by efficiently processing sensor data

### Key Entities

- **Device Orientation State**: Represents the current 3D orientation of the device, including pitch (forward/backward tilt), roll (left/right tilt), and yaw (rotation around vertical axis) angles
- **Alignment State**: Boolean state indicating whether device is within tolerance of target orientation (portrait mode), includes tolerance threshold value
- **3D Visualization Model**: Visual representation of a device/phone that mirrors the physical device's orientation in 3D space
- **Sensor Update**: Real-time accelerometer and gyroscope readings that drive orientation calculations

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can see real-time 3D orientation changes that respond within 50ms of physical device rotation
- **SC-002**: Alignment detection accurately identifies portrait orientation within 2° tolerance with 99% accuracy
- **SC-003**: Component renders smoothly at 30 FPS on modern devices (iPhone 8+ equivalent) during continuous device rotation without dropped frames
- **SC-004**: 90% of users can determine current device tilt angle by viewing the 3D visualization without numeric displays
- **SC-005**: Component integration adds less than 5% to camera view render time
- **SC-006**: Battery consumption increases by less than 2% when component is actively running compared to camera-only usage
- **SC-007**: Component size and position can be customized to fit different camera UI layouts without code changes (prop-based configuration)

## Assumptions

- Device has functional accelerometer and gyroscope sensors (standard on all modern iOS/Android devices)
- React Native Reanimated is available for UI thread animations (consistent with existing AngleLine component requirements)
- Target frame rate of 30 FPS provides good balance between smooth animations and battery efficiency
- Default alignment tolerance of 2° matches existing AngleLine component behavior
- Portrait orientation is defined as device vertical with screen facing user (0° roll)
- Component will follow the same architecture patterns as the existing AngleLine component (Reanimated worklets for performance)
