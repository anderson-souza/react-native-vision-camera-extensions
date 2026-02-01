import { useEffect, useState } from 'react';
import type { CameraPermissionStatus } from 'react-native-vision-camera';
import { Camera } from 'react-native-vision-camera';

export interface UseCameraPermissionReturn {
  hasPermission: boolean;
  permissionStatus: CameraPermissionStatus;
  requestPermission: () => Promise<void>;
  isLoading: boolean;
}

/**
 * Hook to manage camera permissions using Vision Camera API
 * Provides permission status and request function
 */
export function useCameraPermission(): UseCameraPermissionReturn {
  const [permissionStatus, setPermissionStatus] =
    useState<CameraPermissionStatus>('not-determined');
  const [isLoading, setIsLoading] = useState(true);

  const checkPermission = async () => {
    try {
      const status = Camera.getCameraPermissionStatus();
      setPermissionStatus(status);
    } catch (error) {
      console.error('Error checking camera permission:', error);
      setPermissionStatus('denied');
    } finally {
      setIsLoading(false);
    }
  };

  const requestPermission = async () => {
    try {
      setIsLoading(true);
      const status = await Camera.requestCameraPermission();
      setPermissionStatus(status);
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      setPermissionStatus('denied');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkPermission();
  }, []);

  return {
    hasPermission: permissionStatus === 'granted',
    permissionStatus,
    requestPermission,
    isLoading,
  };
}
