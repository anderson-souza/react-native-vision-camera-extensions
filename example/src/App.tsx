import { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { AngleLine } from 'react-native-vision-camera-extensions';

export default function App() {
  const [isLevel, setIsLevel] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.cameraPlaceholder}>
        <Text style={styles.placeholderText}>Camera Preview Area</Text>

        <AngleLine
          lineColor="#FFFFFF"
          levelIndicatorColor="#00FF00"
          levelThreshold={1}
          showAngleText={true}
          showReferenceLine={true}
          onLevelReached={() => setIsLevel(true)}
          onLevelLost={() => setIsLevel(false)}
        />

        {isLevel && (
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>LEVEL</Text>
          </View>
        )}
      </View>

      <Text style={styles.instructions}>
        Tilt your device to see the angle indicator
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cameraPlaceholder: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: '#333',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
  levelBadge: {
    position: 'absolute',
    top: 20,
    backgroundColor: '#00FF00',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
  },
  levelText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  instructions: {
    color: '#888',
    marginTop: 20,
    fontSize: 14,
  },
});
