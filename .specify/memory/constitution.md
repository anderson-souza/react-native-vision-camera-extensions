<!--
Sync Impact Report:
- Version change: Initial (undefined) → 1.0.0
- Modified principles: N/A (initial creation)
- Added sections: All core principles, Development Workflow, Governance
- Removed sections: None
- Templates requiring updates:
  ✅ plan-template.md - Constitution Check section aligns with principles
  ✅ spec-template.md - User scenarios and testing requirements align
  ✅ tasks-template.md - Test-first approach and task structure align
- Follow-up TODOs: None
-->

# React Native Vision Camera Extensions Constitution

## Core Principles

### I. Code Quality Standards

**MUST**: All code must follow TypeScript strict mode with explicit typing. No `any` types except where absolutely required by external library interfaces.

**MUST**: All code must pass ESLint and Prettier checks before commit. Use the project's configured linting rules without exceptions.

**MUST**: Every component and utility function must have a single, well-defined responsibility. Avoid multi-purpose functions or components that handle unrelated concerns.

**RATIONALE**: React Native libraries are consumed by diverse applications. Clear, type-safe code reduces integration issues, improves IDE support, and makes the library trustworthy for production use.

### II. Testing Discipline (NON-NEGOTIABLE)

**MUST**: All public APIs (components, hooks, utilities) must have unit tests with minimum 80% coverage.

**MUST**: Integration tests required for: accelerometer interactions, Reanimated worklet behavior, platform-specific functionality (iOS/Android differences).

**MUST**: Example app must demonstrate all component features and serve as a live integration test.

**RATIONALE**: React Native bridges native and JavaScript - bugs manifest across platforms and runtime environments. Comprehensive testing catches cross-platform issues, worklet thread bugs, and performance regressions before users encounter them.

### III. User Experience Consistency

**MUST**: All visual components must support full customization through props (colors, sizes, styles) while providing sensible defaults.

**MUST**: Components must work correctly on both iOS and Android without platform-specific code paths visible to consumers.

**MUST**: All callbacks and event handlers must be optional. Components must function in a standalone mode without requiring callback implementation.

**MUST**: Props must follow React Native naming conventions: `onEventName` for callbacks, `style` for StyleSheet compatibility, boolean flags as `isActive`/`enabled`.

**RATIONALE**: Developers using this library expect React Native standards. Consistency reduces learning curve, improves adoption, and enables drop-in usage across different apps.

### IV. Performance Requirements

**MUST**: Sensor-driven animations (accelerometer, gestures) must run on the UI thread using Reanimated worklets. No JS thread blocking for real-time updates.

**MUST**: All animations must target 60 FPS on modern devices (iPhone 8+, equivalent Android). Measure frame drops in profiling before release.

**MUST**: Component re-renders must be minimized: Use `React.memo`, `useMemo`, `useCallback` appropriately. Verify with React DevTools Profiler.

**MUST**: Bundle size impact must be measured. Each new feature must justify its KB cost. Prefer tree-shakeable exports.

**RATIONALE**: Camera applications are performance-critical. Jank during camera usage breaks user experience. React Native performance depends on minimizing bridge crossings and keeping UI thread responsive.

### V. API Design & Documentation

**MUST**: Every exported component, hook, or utility must have TSDoc comments with `@param`, `@returns`, `@example`.

**MUST**: README must include working code examples for every component. Examples must be copy-paste ready.

**MUST**: Props must be documented in a table format with: Prop name, Type, Default value, Description.

**MUST**: Breaking changes require MAJOR version bump. New props/components are MINOR. Bug fixes are PATCH (semantic versioning strictly enforced).

**RATIONALE**: Open-source library adoption depends on discoverability and ease of use. Developers evaluate libraries by documentation quality before installing.

### VI. Dependency Management

**MUST**: Minimize dependencies. Every new dependency must be justified: Does it solve a non-trivial problem we cannot reasonably implement ourselves?

**MUST**: `react-native-reanimated` is a peer dependency (required for animation features). Mark as `peerDependencies` not `dependencies` to avoid version conflicts.

**MUST**: Support React Native versions from 0.70+ (2 years backward compatibility). Test on minimum supported version before release.

**MUST**: Native modules (iOS/Android) are prohibited unless absolutely necessary. Prefer pure JavaScript/TypeScript solutions.

**RATIONALE**: React Native dependency management is fragile. Version mismatches cause cryptic build errors. Keeping dependencies minimal reduces maintenance burden and integration friction.

## Development Workflow

### Pull Request Requirements

**MUST**: Every PR must include tests for new functionality or regression tests for bug fixes.

**MUST**: Example app must demonstrate the PR's changes (new component usage, bug fix verification).

**MUST**: Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`.

**MUST**: PR description must include: What changed, Why it changed, How to test it.

### Code Review Standards

**MUST**: At least one maintainer approval required before merge.

**MUST**: CI must pass: linting, type checking, unit tests, build verification.

**MUST**: Breaking changes require discussion in issues before PR submission.

### Release Process

**MUST**: Version bumps follow semantic versioning (see Principle V).

**MUST**: CHANGELOG.md must be updated with all user-facing changes before release.

**MUST**: Release tags must match `package.json` version: `v1.2.3` format.

**MUST**: Test release on example app on both iOS and Android simulators before publishing to npm.

## Governance

### Amendment Procedure

1. Propose constitution change in GitHub issue with `constitution` label
2. Discuss rationale and impact on existing codebase
3. Require maintainer consensus (majority approval)
4. Update constitution with version bump (MAJOR for principle removal/redefinition, MINOR for additions, PATCH for clarifications)
5. Update dependent templates (plan, spec, tasks) to reflect changes
6. Document changes in Sync Impact Report (HTML comment at top of file)

### Versioning Policy

Constitution follows semantic versioning:

- **MAJOR (X.0.0)**: Backward-incompatible governance changes, principle removals, redefined requirements
- **MINOR (1.X.0)**: New principles added, expanded guidance, new sections
- **PATCH (1.2.X)**: Clarifications, wording improvements, typo fixes

### Compliance Review

**MUST**: All PRs must verify compliance with applicable constitution principles in review comments.

**MUST**: Complexity violations (e.g., introducing new native modules) must be explicitly justified in PR description and approved by maintainers.

**MUST**: Constitution takes precedence over individual preferences. When in doubt, constitution wins.

**Version**: 1.0.0 | **Ratified**: 2026-02-02 | **Last Amended**: 2026-02-02
