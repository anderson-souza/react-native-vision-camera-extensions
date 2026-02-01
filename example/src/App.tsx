import { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import {
  AngleLine,
  CameraController,
} from 'react-native-vision-camera-extensions';
import { useCameraPermission } from './hooks/useCameraPermission';

export default function App() {
  const [cameraPosition, setCameraPosition] = useState<'back' | 'front'>(
    'back',
  );
  const [angleLineEnabled, setAngleLineEnabled] = useState(true);
  const [isLevel, setIsLevel] = useState(false);

  const { hasPermission, permissionStatus, requestPermission, isLoading } =
    useCameraPermission();
  const device = useCameraDevice(cameraPosition);

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Checking camera permissions...</Text>
      </View>
    );
  }

  // Permission not granted
  if (!hasPermission) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.permissionTitle}>Camera Permission Required</Text>
        <Text style={styles.permissionMessage}>
          This app needs camera access to demonstrate the AngleLine component
          overlay on live camera preview.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
        {permissionStatus === 'denied' && (
          <Text style={styles.deniedText}>
            Permission denied. Please enable camera access in Settings.
          </Text>
        )}
      </View>
    );
  }

  // No camera device available
  if (!device) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No camera device found</Text>
        <Text style={styles.errorSubtext}>
          Make sure you're running on a physical device with a camera.
        </Text>
      </View>
    );
  }

  const toggleCamera = () => {
    setCameraPosition(prev => (prev === 'back' ? 'front' : 'back'));
  };

  const toggleAngleLine = () => {
    setAngleLineEnabled(prev => !prev);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Camera Preview */}
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={false}
        video={false}
      />

      {/* AngleLine Overlay */}
      {angleLineEnabled && (
        <AngleLine
          lineColor="#FFFFFF"
          levelIndicatorColor="#00FF00"
          lineWidth={1}
          lineLength="50%"
          showAngleText={true}
          showReferenceLine={false}
          levelThreshold={2}
          updateInterval={50}
          angleChangeThrottleMs={100}
          onLevelReached={() => setIsLevel(true)}
          onLevelLost={() => setIsLevel(false)}
          style={styles.angleLine}
        />
      )}

      {/* Level Status Badge */}
      {isLevel && angleLineEnabled && (
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>LEVEL</Text>
        </View>
      )}

      <View>
        <CameraController />
      </View>

      {/* Control Buttons */}
      <View style={styles.controls}>
        {/* Toggle AngleLine Button */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={toggleAngleLine}
          activeOpacity={0.7}
        >
          <Text style={styles.controlButtonText}>
            {angleLineEnabled ? 'Hide Level' : 'Show Level'}
          </Text>
        </TouchableOpacity>

        {/* Flip Camera Button */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={toggleCamera}
          activeOpacity={0.7}
        >
          <Text style={styles.controlButtonText}>Flip Camera</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 12,
    fontSize: 16,
  },
  permissionTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionMessage: {
    color: '#AAAAAA',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  deniedText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 16,
    textAlign: 'center',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorSubtext: {
    color: '#888888',
    fontSize: 14,
    textAlign: 'center',
  },
  angleLine: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  levelBadge: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    backgroundColor: '#00FF00',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  levelText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
