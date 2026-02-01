import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linesContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  referenceLine: {
    position: 'absolute',
    width: '90%',
    opacity: 0.5,
  },
  rotatingLine: {
    position: 'absolute',
  },
  angleText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 20,
    fontVariant: ['tabular-nums'],
  },
  angleLine: {
    position: 'absolute',
  },
});
