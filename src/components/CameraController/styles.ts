import { StyleSheet } from 'react-native';
import {
  BUTTON_SIZE,
  BAR_PADDING,
  DEFAULT_BACKGROUND_COLOR,
  PANEL_HEIGHT,
} from './constants';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  controlBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: BAR_PADDING,
    paddingHorizontal: BAR_PADDING * 2,
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
    borderRadius: 12,
  },
  controlButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BUTTON_SIZE / 2,
  },
  expandedPanel: {
    overflow: 'hidden',
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
    borderRadius: 12,
    marginTop: 8,
    paddingHorizontal: 16,
    width: '100%',
  },
  expandedPanelContent: {
    height: PANEL_HEIGHT,
    justifyContent: 'center',
    flex: 1,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    minWidth: 50,
    textAlign: 'center',
  },
  presetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  presetButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  presetButtonActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
  presetText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  presetTextActive: {
    color: '#FFD700',
    fontWeight: '600',
  },
});
