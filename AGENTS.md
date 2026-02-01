# Agent Development Guide

This guide provides coding agents with essential information for working effectively in this React Native Vision Camera Extensions repository.

## Project Structure

```
react-native-vision-camera-extensions/
├── src/                    # Library source code
│   ├── components/         # React Native components
│   ├── __tests__/          # Jest tests
│   └── index.tsx           # Main entry point
├── example/                # Expo example app (Yarn workspace)
├── lib/                    # Build output (ESM + TypeScript declarations)
├── android/                # Android native code
└── ios/                    # iOS native code
```

## Build, Lint, and Test Commands

### Installation

**CRITICAL**: Always use `yarn` - npm will NOT work due to Yarn workspaces.

```bash
yarn                        # Install dependencies (required first step)
```

### Build & Type Checking

```bash
yarn prepare                # Build library (runs bob build)
yarn typecheck              # Run TypeScript compiler
```

### Linting

```bash
yarn lint                   # Run ESLint on all files
yarn lint --fix             # Auto-fix linting issues
```

### Testing

```bash
yarn test                   # Run all Jest tests
yarn test --watch           # Run tests in watch mode
yarn test utils.test        # Run a single test file (pattern match)
yarn test -t "test name"    # Run specific test by name
```

### Example App (Expo)

```bash
yarn example start          # Start Metro bundler
yarn example android        # Run on Android device/emulator
yarn example ios            # Run on iOS simulator
yarn example web            # Run on web browser
```

### Release

```bash
yarn release                # Create new release (uses release-it)
```

## Code Style Guidelines

### Imports

- Use named imports/exports (no default exports except for components when necessary)
- Import order: external packages → React/React Native → local modules → types
- Use type-only imports where applicable: `import type { Foo } from './types'`

**Example:**

```typescript
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedSensor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import type { AngleLineProps } from './AngleLine.types';
import { calculateRollAngle, isWithinThreshold } from './utils';
```

### TypeScript

- **Strict mode enabled** - all strict TypeScript checks are ON
- Always define explicit types for props, function parameters, and return values
- Use `interface` for component props (exported as `ComponentNameProps`)
- Enable `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`
- Use `type` for unions, intersections, and utility types
- Place type definitions in separate `.types.ts` files for complex components

**Example:**

```typescript
export interface AngleLineProps {
  lineColor?: string;
  lineWidth?: number;
  onAngleChange?: (angle: number) => void;
}
```

### Formatting (Prettier)

- **Single quotes** for strings
- **2 spaces** for indentation (no tabs)
- **Trailing commas** in ES5-compatible locations (objects, arrays)
- **Consistent quote props** in objects
- Prettier runs automatically on pre-commit via lefthook

### Naming Conventions

- **Components**: PascalCase (e.g., `AngleLine`)
- **Files**: Match component name (e.g., `AngleLine.tsx`)
- **Props interfaces**: `ComponentNameProps` (e.g., `AngleLineProps`)
- **Functions/variables**: camelCase (e.g., `calculateRollAngle`)
- **Constants**: UPPER_SNAKE_CASE for module-level constants (e.g., `DEFAULT_LINE_COLOR`)
- **Test files**: `*.test.ts` or `*.test.tsx`

### Component Organization

- Organize components in folders: `components/ComponentName/`
- Structure: `ComponentName.tsx`, `ComponentName.types.ts`, `utils.ts`, `index.ts`
- Export from `index.ts` for clean imports: `export { AngleLine } from './AngleLine'`

### React Native Patterns

- Use functional components with hooks (no class components)
- Prefer `StyleSheet.create()` for styles
- Use Reanimated for animations (worklet functions marked with `'worklet'`)
- Use `runOnJS()` for callbacks from UI thread to JS thread
- Destructure props with default values in function parameters

**Example:**

```typescript
export function AngleLine({
  lineColor = DEFAULT_LINE_COLOR,
  lineWidth = DEFAULT_LINE_WIDTH,
  enabled = true,
}: AngleLineProps) {
  // Component implementation
}
```

### Error Handling

- Use optional chaining for callbacks: `onAngleChange?.(angle)`
- Provide sensible defaults for all optional props
- Validate edge cases in utility functions
- Write tests for error conditions

### Documentation

- Use JSDoc comments for public APIs and complex functions
- Document `@param`, `@returns`, and `@default` values
- Include usage examples in component documentation
- Document worklet functions: `'worklet'` directive + JSDoc

**Example:**

```typescript
/**
 * Calculate roll angle (horizontal tilt) from accelerometer data.
 * This is a worklet function that runs on the UI thread.
 *
 * @param x - X-axis acceleration in g-force (lateral tilt)
 * @param z - Z-axis acceleration in g-force (vertical/gravity)
 * @returns Roll angle in degrees (-90 to 90)
 */
export function calculateRollAngle(x: number, z: number): number {
  'worklet';
  const angleRadians = Math.atan2(x, Math.abs(z));
  return (angleRadians * 180) / Math.PI;
}
```

## Git Workflow

### Pre-commit Hooks

Lefthook automatically runs on staged files:

- ESLint with auto-fix
- TypeScript type checking

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `refactor:` - Code refactoring
- `docs:` - Documentation changes
- `test:` - Test additions/changes
- `chore:` - Build process, dependencies, etc.

**Examples:**

```
feat: add angle threshold configuration to AngleLine
fix: correct roll angle calculation for face-down orientation
refactor: extract sensor logic into custom hook
docs: update AngleLine API documentation
test: add edge cases for calculateRollAngle
```

## Best Practices for Agents

1. **Always run `yarn` first** if `node_modules/` is missing
2. **Run tests after changes** to ensure nothing breaks
3. **Use TypeScript strictly** - no `any` types unless absolutely necessary
4. **Follow existing patterns** - examine similar components before creating new ones
5. **Write tests** for new utility functions and component logic
6. **Keep Reanimated worklets pure** - use `runOnJS()` for side effects
7. **Update type definitions** when changing component props
8. **Respect the monorepo** - the example app is a separate workspace
9. **Build before testing native changes** - JS changes hot reload, native doesn't
10. **Use Context7 MCP** for Vision Camera & Reanimated documentation

## Common Pitfalls

- ❌ Using `npm` instead of `yarn`
- ❌ Forgetting `'worklet'` directive in Reanimated functions
- ❌ Calling JS functions directly from UI thread (use `runOnJS()`)
- ❌ Modifying `lib/` directory (it's generated - edit `src/` instead)
- ❌ Missing type exports in `index.tsx`
- ❌ Breaking changes without updating tests
