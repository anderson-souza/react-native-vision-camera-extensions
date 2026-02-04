# Tasks: 3D Device Angle Indicator

**Input**: Design documents from `specs/001-3d-angle-indicator/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: MANDATORY - Constitution Principle II requires TDD workflow with 80% minimum coverage

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `src/__tests__/` at repository root
- This is a single library project (React Native component library)
- Test files mirror source structure under `src/__tests__/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create component directory structure at src/components/Device3DIndicator/
- [X] T002 Create test directory structure at src/__tests__/Device3DIndicator/
- [X] T003 Copy types contract from specs/001-3d-angle-indicator/contracts/Device3DIndicator.types.ts to src/components/Device3DIndicator/types.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities and types that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 [P] Create constants file with defaults at src/components/Device3DIndicator/constants.ts
- [X] T005 [P] Create OrientationCalculator utility for quaternion/Euler math at src/components/Device3DIndicator/OrientationCalculator.ts
- [X] T006 [P] Create AlignmentDetector utility for hysteresis logic at src/components/Device3DIndicator/AlignmentDetector.ts
- [X] T007 [P] Create base StyleSheet at src/components/Device3DIndicator/styles.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Real-Time 3D Orientation Visualization (Priority: P1) 🎯 MVP

**Goal**: Display a 3D device model that rotates in real-time to match device orientation

**Independent Test**: Mount component in example app, physically rotate device, verify 3D model rotates smoothly to match device orientation at 30 FPS

### Tests for User Story 1 (TDD - Write FIRST, ensure they FAIL) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T008 [P] [US1] Unit test for OrientationCalculator radian-to-degree conversion at src/__tests__/Device3DIndicator/OrientationCalculator.test.ts
- [X] T009 [P] [US1] Unit test for quaternion-to-Euler conversion at src/__tests__/Device3DIndicator/OrientationCalculator.test.ts
- [X] T010 [P] [US1] Unit test for angle normalization [-180,180] range at src/__tests__/Device3DIndicator/OrientationCalculator.test.ts
- [X] T011 [P] [US1] Unit test for useOrientationSensor hook sensor integration at src/__tests__/Device3DIndicator/useOrientationSensor.test.ts
- [X] T012 [P] [US1] Component test for Device3DIndicator basic rendering at src/__tests__/Device3DIndicator/Device3DIndicator.test.tsx
- [X] T013 [P] [US1] Component test for Device3DModel with transform props at src/__tests__/Device3DIndicator/Device3DModel.test.tsx

### Implementation for User Story 1

- [X] T014 [P] [US1] Implement quaternion-to-Euler conversion functions in src/components/Device3DIndicator/OrientationCalculator.ts
- [X] T015 [P] [US1] Implement radian-to-degree utility functions in src/components/Device3DIndicator/OrientationCalculator.ts
- [X] T016 [P] [US1] Implement angle normalization utilities in src/components/Device3DIndicator/OrientationCalculator.ts
- [X] T017 [US1] Implement useOrientationSensor hook with useAnimatedSensor(ROTATION) at src/components/Device3DIndicator/useOrientationSensor.ts
- [X] T018 [US1] Implement Device3DModel component with 3D transforms (front/back faces, edges) at src/components/Device3DIndicator/Device3DModel.tsx
- [X] T019 [US1] Implement main Device3DIndicator component wiring sensor to 3D model at src/components/Device3DIndicator/Device3DIndicator.tsx
- [X] T020 [US1] Create public exports index at src/components/Device3DIndicator/index.ts
- [X] T021 [US1] Export Device3DIndicator from library entry at src/index.tsx
- [X] T022 [US1] Add Device3DIndicator to example app at example/src/App.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional - 3D model rotates with device orientation at 30 FPS

---

## Phase 4: User Story 2 - Portrait Mode Alignment Detection (Priority: P2)

**Goal**: Add visual feedback (color change) when device is aligned to portrait orientation within 2° tolerance

**Independent Test**: Slowly rotate device around portrait orientation, verify color changes to alignedColor when within tolerance and back to modelColor when outside threshold, with no flickering

### Tests for User Story 2 (TDD - Write FIRST, ensure they FAIL) ⚠️

- [ ] T023 [P] [US2] Unit test for quaternion angular distance calculation at src/__tests__/Device3DIndicator/OrientationCalculator.test.ts
- [ ] T024 [P] [US2] Unit test for AlignmentDetector hysteresis logic (2°/4° thresholds) at src/__tests__/Device3DIndicator/AlignmentDetector.test.ts
- [ ] T025 [P] [US2] Unit test for AlignmentDetector time-based debouncing (150ms) at src/__tests__/Device3DIndicator/AlignmentDetector.test.ts
- [ ] T026 [P] [US2] Component test for Device3DIndicator alignment color change at src/__tests__/Device3DIndicator/Device3DIndicator.test.tsx
- [ ] T027 [P] [US2] Component test for onAlignmentChange callback invocation at src/__tests__/Device3DIndicator/Device3DIndicator.test.tsx

### Implementation for User Story 2

- [ ] T028 [P] [US2] Implement quaternion dot product and angular distance functions in src/components/Device3DIndicator/OrientationCalculator.ts
- [ ] T029 [P] [US2] Implement portrait/landscape reference quaternions in src/components/Device3DIndicator/constants.ts
- [ ] T030 [US2] Implement AlignmentDetector class with hysteresis in src/components/Device3DIndicator/AlignmentDetector.ts
- [ ] T031 [US2] Extend useOrientationSensor to calculate alignment state in src/components/Device3DIndicator/useOrientationSensor.ts
- [ ] T032 [US2] Add alignment-based color animation to Device3DIndicator component in src/components/Device3DIndicator/Device3DIndicator.tsx
- [ ] T033 [US2] Implement onAlignmentChange callback with runOnJS in src/components/Device3DIndicator/Device3DIndicator.tsx
- [ ] T034 [US2] Add alignment detection props (targetOrientation, alignmentTolerance) to component in src/components/Device3DIndicator/Device3DIndicator.tsx
- [ ] T035 [US2] Update example app to demonstrate alignment detection at example/src/App.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - color changes when aligned, no flicker

---

## Phase 5: User Story 3 - Numeric Angle Display (Priority: P3)

**Goal**: Display numeric pitch/roll/yaw values alongside 3D visualization for technical users

**Independent Test**: Enable showAngles prop, rotate device, verify numeric values display and update in real-time matching device orientation with configured precision

### Tests for User Story 3 (TDD - Write FIRST, ensure they FAIL) ⚠️

- [ ] T036 [P] [US3] Component test for angle text rendering when showAngles=true at src/__tests__/Device3DIndicator/Device3DIndicator.test.tsx
- [ ] T037 [P] [US3] Component test for angle text hidden when showAngles=false at src/__tests__/Device3DIndicator/Device3DIndicator.test.tsx
- [ ] T038 [P] [US3] Component test for angle precision formatting (0-3 decimals) at src/__tests__/Device3DIndicator/Device3DIndicator.test.tsx
- [ ] T039 [P] [US3] Component test for degrees vs radians format at src/__tests__/Device3DIndicator/Device3DIndicator.test.tsx
- [ ] T040 [P] [US3] Component test for onOrientationChange callback with throttling at src/__tests__/Device3DIndicator/Device3DIndicator.test.tsx

### Implementation for User Story 3

- [ ] T041 [P] [US3] Implement angle formatting utility (precision, degrees/radians) in src/components/Device3DIndicator/OrientationCalculator.ts
- [ ] T042 [US3] Add angle text display to Device3DIndicator component with conditional rendering in src/components/Device3DIndicator/Device3DIndicator.tsx
- [ ] T043 [US3] Implement onOrientationChange callback with throttling logic in src/components/Device3DIndicator/useOrientationSensor.ts
- [ ] T044 [US3] Add angle display styling (default monospace font) to styles in src/components/Device3DIndicator/styles.ts
- [ ] T045 [US3] Add showAngles, anglePrecision, angleFormat props to component in src/components/Device3DIndicator/Device3DIndicator.tsx
- [ ] T046 [US3] Update example app to demonstrate numeric angle display at example/src/App.tsx

**Checkpoint**: All user stories should now be independently functional - P1 (3D rotation) + P2 (alignment) + P3 (numeric display)

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories, documentation, and final validation

- [ ] T047 [P] Add TSDoc comments to all exported functions in src/components/Device3DIndicator/OrientationCalculator.ts
- [ ] T048 [P] Add TSDoc comments to Device3DIndicator component props in src/components/Device3DIndicator/Device3DIndicator.tsx
- [ ] T049 [P] Integration test for sensor error handling (ROTATION unavailable) at src/__tests__/Device3DIndicator/integration.test.tsx
- [ ] T050 [P] Integration test for edge case: upside-down orientation detection at src/__tests__/Device3DIndicator/integration.test.tsx
- [ ] T051 [P] Integration test for edge case: gimbal lock (device flat) at src/__tests__/Device3DIndicator/integration.test.tsx
- [ ] T052 [P] Performance test for 30 FPS maintenance during continuous rotation at src/__tests__/Device3DIndicator/performance.test.tsx
- [ ] T053 Update README.md with Device3DIndicator documentation (props table, examples) at README.md
- [ ] T054 Add React.memo optimization to Device3DIndicator component in src/components/Device3DIndicator/Device3DIndicator.tsx
- [ ] T055 Add React.memo optimization to Device3DModel component in src/components/Device3DIndicator/Device3DModel.tsx
- [ ] T056 Run ESLint and fix any violations across all new files
- [ ] T057 Run TypeScript compiler in strict mode and fix any type errors
- [ ] T058 Verify test coverage is ≥80% using Jest coverage report
- [ ] T059 Run example app on physical iOS device and verify all 3 user stories
- [ ] T060 Run example app on physical Android device and verify all 3 user stories
- [ ] T061 Validate quickstart.md examples work as documented

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if multiple developers)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Extends US1 but can be developed independently (both can run in parallel)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Extends US1 but can be developed independently (all 3 can run in parallel)

### Within Each User Story

- Tests (T008-T013, T023-T027, T036-T040) MUST be written and FAIL before implementation
- Utility functions (OrientationCalculator, AlignmentDetector) before hooks (useOrientationSensor)
- Hooks before components (Device3DIndicator, Device3DModel)
- Component implementation before example app integration
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 1 (Setup)**: All tasks can run in parallel
- T001, T002, T003 (different directories/files)

**Phase 2 (Foundational)**: All tasks can run in parallel
- T004, T005, T006, T007 (different files, no dependencies)

**Phase 3 (US1 Tests)**: All can run in parallel
- T008, T009, T010, T011, T012, T013 (different test files)

**Phase 3 (US1 Implementation)**: T014, T015, T016 parallel; then T017; then T018, T019 parallel
- T014, T015, T016 (all in OrientationCalculator.ts, can be done together)
- T017 (depends on T014-T016 for utilities)
- T018, T019 (different components, depend on T017)
- T020, T021, T022 (sequential: exports → library → example)

**Phase 4 (US2 Tests)**: All can run in parallel
- T023, T024, T025, T026, T027 (different test aspects)

**Phase 4 (US2 Implementation)**: T028, T029, T030 parallel; then T031; then T032-T034 parallel
- T028, T029 (different functions/constants)
- T030 (new file AlignmentDetector)
- T031 (depends on T028, T030)
- T032, T033, T034 (component updates, can be done together)
- T035 (example update)

**Phase 5 (US3 Tests)**: All can run in parallel
- T036, T037, T038, T039, T040 (different test scenarios)

**Phase 5 (US3 Implementation)**: T041, T042 parallel; then T043-T045 together
- T041 (utility function)
- T042 (component rendering)
- T043, T044, T045 (related feature additions)
- T046 (example update)

**Phase 6 (Polish)**: Most tasks can run in parallel
- T047, T048, T049, T050, T051, T052 (all different files)
- T053, T054, T055 (different concerns)
- T056, T057, T058 (validation tasks)
- T059, T060, T061 (testing tasks, can be parallel across devices)

---

## Parallel Example: User Story 1 Implementation

```bash
# Write all tests in parallel (TDD - tests first):
Task T008: "Unit test for OrientationCalculator radian-to-degree conversion"
Task T009: "Unit test for quaternion-to-Euler conversion"
Task T010: "Unit test for angle normalization"
Task T011: "Unit test for useOrientationSensor hook"
Task T012: "Component test for Device3DIndicator"
Task T013: "Component test for Device3DModel"

# Verify tests FAIL (no implementation yet)

# Implement utilities in parallel:
Task T014: "Implement quaternion-to-Euler conversion"
Task T015: "Implement radian-to-degree utilities"
Task T016: "Implement angle normalization"

# Then hook (depends on utilities):
Task T017: "Implement useOrientationSensor hook"

# Then components in parallel:
Task T018: "Implement Device3DModel component"
Task T019: "Implement Device3DIndicator component"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T007) - CRITICAL
3. Complete Phase 3: User Story 1 (T008-T022)
   - Write tests FIRST (T008-T013)
   - Verify tests FAIL
   - Implement code to pass tests (T014-T022)
4. **STOP and VALIDATE**: Test User Story 1 on physical device
5. Verify 30 FPS performance, sensor responsiveness <50ms
6. MVP Complete! (3D orientation visualization working)

### Incremental Delivery

1. Complete Setup + Foundational → **Foundation ready**
2. Add User Story 1 → Test independently → **MVP Deploy** (basic 3D rotation)
3. Add User Story 2 → Test independently → **v1.1 Deploy** (+ alignment detection)
4. Add User Story 3 → Test independently → **v1.2 Deploy** (+ numeric angles)
5. Polish phase → **v1.3 Deploy** (production-ready)

Each story adds value without breaking previous stories!

### Parallel Team Strategy

With multiple developers:

1. **Team completes Setup + Foundational together** (T001-T007)
2. Once Foundational is done, split work:
   - **Developer A**: User Story 1 (T008-T022) - Core 3D visualization
   - **Developer B**: User Story 2 (T023-T035) - Alignment detection
   - **Developer C**: User Story 3 (T036-T046) - Numeric display
3. Stories complete and merge independently
4. **Team completes Polish together** (T047-T061)

---

## TDD Workflow Reminder (Constitution Required)

**Constitution Principle II: Testing Discipline is NON-NEGOTIABLE**

For each user story:

1. **Red Phase**: Write failing tests first
   - Tests describe desired behavior
   - Run tests → verify they FAIL
   - DO NOT proceed until tests fail for the right reasons

2. **Green Phase**: Implement minimum code to pass tests
   - Write simplest implementation that makes tests pass
   - Run tests → verify they PASS
   - DO NOT add features beyond test requirements

3. **Refactor Phase**: Clean up while keeping tests green
   - Extract duplicated code
   - Improve naming and structure
   - Run tests after each refactor → must stay PASS

4. **Verify Coverage**: Check ≥80% coverage requirement
   - Run `yarn test --coverage`
   - Identify uncovered lines
   - Add tests for edge cases

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- **TDD is mandatory**: Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Performance target: 30 FPS, <50ms sensor response, <2% battery impact
- Test coverage target: ≥80% (constitution requirement)

---

## Task Summary

**Total Tasks**: 61
- **Phase 1 (Setup)**: 3 tasks
- **Phase 2 (Foundational)**: 4 tasks
- **Phase 3 (US1)**: 15 tasks (6 tests + 9 implementation)
- **Phase 4 (US2)**: 13 tasks (5 tests + 8 implementation)
- **Phase 5 (US3)**: 11 tasks (5 tests + 6 implementation)
- **Phase 6 (Polish)**: 15 tasks

**Parallel Opportunities**: 39 tasks can run in parallel with other tasks (marked with [P])

**Independent Test Criteria**:
- **US1**: Mount component, rotate device physically, 3D model rotates smoothly at 30 FPS
- **US2**: Rotate device around portrait, color changes at 2° threshold without flicker
- **US3**: Enable showAngles, verify numeric values update in real-time with configured precision

**Suggested MVP Scope**: Phase 1 + Phase 2 + Phase 3 (User Story 1 only) = 22 tasks

**Test Coverage Target**: ≥80% (Constitution Principle II requirement)
