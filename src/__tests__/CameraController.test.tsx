import { render, fireEvent } from '@testing-library/react-native';
import { CameraController } from '../components/CameraController';
import type { CameraControllerProps } from '../components/CameraController/types';

// Mock the ControlSlider to avoid Text component issues in tests
jest.mock('../components/CameraController/controls/ControlSlider', () => ({
  ControlSlider: () => null,
}));

describe('CameraController', () => {
  const defaultProps: CameraControllerProps = {};

  describe('rendering', () => {
    it('should render without crashing', () => {
      const { getByLabelText } = render(
        <CameraController {...defaultProps} controls={['flash', 'hdr']} />
      );

      expect(getByLabelText('Flash off')).toBeTruthy();
    });

    it('should render basic controls', () => {
      const { getByLabelText } = render(
        <CameraController controls={['flash', 'angleLine', 'hdr']} />
      );

      expect(getByLabelText('Flash off')).toBeTruthy();
      expect(getByLabelText('Angle indicator off')).toBeTruthy();
      expect(getByLabelText('HDR off')).toBeTruthy();
    });

    it('should render only specified controls', () => {
      const { getByLabelText, queryByLabelText } = render(
        <CameraController controls={['flash', 'hdr']} />
      );

      expect(getByLabelText('Flash off')).toBeTruthy();
      expect(getByLabelText('HDR off')).toBeTruthy();
      expect(queryByLabelText('Angle indicator off')).toBeNull();
    });
  });

  describe('flash control', () => {
    it('should cycle flash modes on press', () => {
      const onFlashChange = jest.fn();
      const { getByLabelText } = render(
        <CameraController onFlashChange={onFlashChange} controls={['flash']} />
      );

      const flashButton = getByLabelText('Flash off');
      fireEvent.press(flashButton);

      expect(onFlashChange).toHaveBeenCalledWith('on');
    });
  });

  describe('angle line control', () => {
    it('should toggle angle line on press', () => {
      const onAngleLineToggle = jest.fn();
      const { getByLabelText } = render(
        <CameraController
          onAngleLineToggle={onAngleLineToggle}
          controls={['angleLine']}
        />
      );

      const angleButton = getByLabelText('Angle indicator off');
      fireEvent.press(angleButton);

      expect(onAngleLineToggle).toHaveBeenCalledWith(true);
    });
  });

  describe('HDR control', () => {
    it('should toggle HDR on press', () => {
      const onHDRChange = jest.fn();
      const { getByLabelText } = render(
        <CameraController onHDRChange={onHDRChange} controls={['hdr']} />
      );

      const hdrButton = getByLabelText('HDR off');
      fireEvent.press(hdrButton);

      expect(onHDRChange).toHaveBeenCalledWith(true);
    });
  });

  describe('initial state', () => {
    it('should respect initial state', () => {
      const { getByLabelText } = render(
        <CameraController
          initialState={{
            flash: 'on',
            hdrEnabled: true,
          }}
          controls={['flash', 'hdr']}
        />
      );

      expect(getByLabelText('Flash on')).toBeTruthy();
      expect(getByLabelText('HDR on')).toBeTruthy();
    });
  });

  describe('state change callback', () => {
    it('should call onStateChange when state changes', () => {
      const onStateChange = jest.fn();
      const { getByLabelText } = render(
        <CameraController onStateChange={onStateChange} controls={['flash']} />
      );

      const flashButton = getByLabelText('Flash off');
      fireEvent.press(flashButton);

      expect(onStateChange).toHaveBeenCalled();
    });
  });

  describe('custom styling', () => {
    it('should accept custom icon colors', () => {
      const { getByLabelText } = render(
        <CameraController
          iconColor="#FF0000"
          activeIconColor="#00FF00"
          controls={['flash']}
        />
      );

      expect(getByLabelText('Flash off')).toBeTruthy();
    });

    it('should accept custom background color', () => {
      const { getByLabelText } = render(
        <CameraController
          backgroundColor="rgba(0,0,0,0.8)"
          controls={['flash']}
        />
      );

      expect(getByLabelText('Flash off')).toBeTruthy();
    });
  });
});
