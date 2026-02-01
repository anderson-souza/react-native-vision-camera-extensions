# Vision Camera Extensions - Example App

This example app demonstrates the **AngleLine** component from `react-native-vision-camera-extensions` - a real-time camera overlay that shows your device's horizontal tilt angle using accelerometer data.

## Features

- 📸 Live camera preview with Vision Camera
- 📐 Real-time angle indicator overlay
- 🎯 Visual level indicator (turns green when device is level)
- 🔄 Toggle front/back camera
- 👁️ Show/hide AngleLine overlay
- ⚡ Smooth animations with Reanimated

## Getting Started

> **Important**: This app requires a **physical device** with a camera. iOS Simulator and some Android emulators do not support camera functionality.

### Prerequisites

Make sure you have completed the [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Installation

From the **root** of the repository, install all dependencies:

```sh
yarn
```

This will install dependencies for both the library and the example app (using Yarn workspaces).

## Running the Example App

### Step 1: Install iOS Dependencies (iOS only)

If building for iOS, you need to install CocoaPods dependencies:

```sh
cd example/ios
pod install
cd ../..
```

### Step 2: Run the App

From the **root** of the repository, use these commands:

**Android** (requires physical device or emulator with camera):

```sh
yarn example android
```

**iOS** (requires physical device - simulator doesn't have camera):

```sh
yarn example ios
```

> **Note**: On iOS, the app will only work on a physical device. Connect your iPhone/iPad via USB and select it as the build target in Xcode.

If everything is set up correctly, you should see the camera preview with an AngleLine overlay. Tilt your device to see the angle indicator rotate!

## Using the Demo

Once the app is running:

1. **Grant camera permission** - Tap "Grant Permission" when prompted
2. **Tilt your device** - Watch the white line rotate to match your device's angle
3. **Level your device** - When horizontal (within 1.5°), the line turns green and shows "LEVEL"
4. **Toggle controls**:
   - **"Hide/Show Level"** - Toggle the AngleLine overlay on/off
   - **"Flip Camera"** - Switch between front and back camera

## Customizing the AngleLine

The example app demonstrates most AngleLine features. To experiment, edit `example/src/App.tsx` and adjust the props:

```tsx
<AngleLine
  lineColor="#FFFFFF" // Change line color
  levelIndicatorColor="#00FF00" // Change level indicator color
  lineWidth={3} // Adjust line thickness
  lineLength="85%" // Adjust line length
  showAngleText={true} // Show/hide angle number
  levelThreshold={1.5} // Adjust level sensitivity (degrees)
  updateInterval={50} // Sensor update rate (ms)
/>
```

## Project Structure

```
example/
├── src/
│   ├── App.tsx                    # Main camera screen
│   └── hooks/
│       └── useCameraPermission.ts # Camera permission hook
├── android/                       # Android native code
├── ios/                           # iOS native code
└── package.json
```

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
