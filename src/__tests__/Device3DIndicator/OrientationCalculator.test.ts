/**
 * Unit tests for OrientationCalculator utility functions
 *
 * Tests cover:
 * - T008: Radian-to-degree conversion
 * - T009: Quaternion-to-Euler conversion
 * - T010: Angle normalization [-180, 180] range
 *
 * TDD Phase: RED - These tests define expected behavior
 */

import {
  radiansToDegrees,
  degreesToRadians,
  normalizeAngle,
  quaternionToEuler,
  quaternionDotProduct,
  quaternionAngularDistance,
  formatAngle,
  isNormalizedQuaternion,
  isValidSensorReading,
} from '../../components/Device3DIndicator/OrientationCalculator';
import type { Quaternion } from '../../components/Device3DIndicator/types';

// ============================================================================
// T008: Unit tests for radian-to-degree conversion
// ============================================================================
describe('T008: radiansToDegrees', () => {
  describe('standard conversions', () => {
    it('converts 0 radians to 0 degrees', () => {
      expect(radiansToDegrees(0)).toBe(0);
    });

    it('converts PI radians to 180 degrees', () => {
      expect(radiansToDegrees(Math.PI)).toBeCloseTo(180, 10);
    });

    it('converts PI/2 radians to 90 degrees', () => {
      expect(radiansToDegrees(Math.PI / 2)).toBeCloseTo(90, 10);
    });

    it('converts 2*PI radians to 360 degrees', () => {
      expect(radiansToDegrees(2 * Math.PI)).toBeCloseTo(360, 10);
    });

    it('converts -PI radians to -180 degrees', () => {
      expect(radiansToDegrees(-Math.PI)).toBeCloseTo(-180, 10);
    });

    it('converts -PI/2 radians to -90 degrees', () => {
      expect(radiansToDegrees(-Math.PI / 2)).toBeCloseTo(-90, 10);
    });
  });

  describe('edge cases', () => {
    it('handles very small positive values', () => {
      const smallRadian = 0.0001;
      const expected = (smallRadian * 180) / Math.PI;
      expect(radiansToDegrees(smallRadian)).toBeCloseTo(expected, 10);
    });

    it('handles very small negative values', () => {
      const smallRadian = -0.0001;
      const expected = (smallRadian * 180) / Math.PI;
      expect(radiansToDegrees(smallRadian)).toBeCloseTo(expected, 10);
    });

    it('handles very large positive values', () => {
      const largeRadian = 100 * Math.PI;
      expect(radiansToDegrees(largeRadian)).toBeCloseTo(18000, 5);
    });

    it('handles very large negative values', () => {
      const largeRadian = -100 * Math.PI;
      expect(radiansToDegrees(largeRadian)).toBeCloseTo(-18000, 5);
    });
  });

  describe('precision', () => {
    it('maintains precision for PI/4 (45 degrees)', () => {
      expect(radiansToDegrees(Math.PI / 4)).toBeCloseTo(45, 10);
    });

    it('maintains precision for PI/6 (30 degrees)', () => {
      expect(radiansToDegrees(Math.PI / 6)).toBeCloseTo(30, 10);
    });

    it('maintains precision for PI/3 (60 degrees)', () => {
      expect(radiansToDegrees(Math.PI / 3)).toBeCloseTo(60, 10);
    });
  });
});

describe('T008: degreesToRadians', () => {
  describe('standard conversions', () => {
    it('converts 0 degrees to 0 radians', () => {
      expect(degreesToRadians(0)).toBe(0);
    });

    it('converts 180 degrees to PI radians', () => {
      expect(degreesToRadians(180)).toBeCloseTo(Math.PI, 10);
    });

    it('converts 90 degrees to PI/2 radians', () => {
      expect(degreesToRadians(90)).toBeCloseTo(Math.PI / 2, 10);
    });

    it('converts 360 degrees to 2*PI radians', () => {
      expect(degreesToRadians(360)).toBeCloseTo(2 * Math.PI, 10);
    });

    it('converts -180 degrees to -PI radians', () => {
      expect(degreesToRadians(-180)).toBeCloseTo(-Math.PI, 10);
    });

    it('converts -90 degrees to -PI/2 radians', () => {
      expect(degreesToRadians(-90)).toBeCloseTo(-Math.PI / 2, 10);
    });
  });

  describe('roundtrip conversion', () => {
    it('roundtrip: radians -> degrees -> radians preserves value', () => {
      const original = 1.234;
      const degrees = radiansToDegrees(original);
      const result = degreesToRadians(degrees);
      expect(result).toBeCloseTo(original, 10);
    });

    it('roundtrip: degrees -> radians -> degrees preserves value', () => {
      const original = 45.678;
      const radians = degreesToRadians(original);
      const result = radiansToDegrees(radians);
      expect(result).toBeCloseTo(original, 10);
    });
  });
});

// ============================================================================
// T009: Unit tests for quaternion-to-Euler conversion
// ============================================================================
describe('T009: quaternionToEuler', () => {
  describe('identity quaternion', () => {
    it('converts identity quaternion (1,0,0,0) to zero Euler angles', () => {
      const identity: Quaternion = { w: 1, x: 0, y: 0, z: 0 };
      const result = quaternionToEuler(identity);

      expect(result.pitch).toBeCloseTo(0, 5);
      expect(result.roll).toBeCloseTo(0, 5);
      expect(result.yaw).toBeCloseTo(0, 5);
    });
  });

  describe('single-axis rotations', () => {
    it('converts 90 degree rotation around X-axis (roll)', () => {
      // Quaternion for 90 degree rotation around X: (cos(45), sin(45), 0, 0)
      const q: Quaternion = {
        w: Math.cos(Math.PI / 4),
        x: Math.sin(Math.PI / 4),
        y: 0,
        z: 0,
      };
      const result = quaternionToEuler(q);

      expect(result.roll).toBeCloseTo(90, 1);
      expect(result.pitch).toBeCloseTo(0, 1);
      expect(result.yaw).toBeCloseTo(0, 1);
    });

    it('converts 90 degree rotation around Y-axis (pitch)', () => {
      // Quaternion for 90 degree rotation around Y: (cos(45), 0, sin(45), 0)
      const q: Quaternion = {
        w: Math.cos(Math.PI / 4),
        x: 0,
        y: Math.sin(Math.PI / 4),
        z: 0,
      };
      const result = quaternionToEuler(q);

      expect(result.pitch).toBeCloseTo(90, 1);
    });

    it('converts 90 degree rotation around Z-axis (yaw)', () => {
      // Quaternion for 90 degree rotation around Z: (cos(45), 0, 0, sin(45))
      const q: Quaternion = {
        w: Math.cos(Math.PI / 4),
        x: 0,
        y: 0,
        z: Math.sin(Math.PI / 4),
      };
      const result = quaternionToEuler(q);

      expect(result.yaw).toBeCloseTo(90, 1);
    });

    it('converts -90 degree rotation around X-axis', () => {
      const q: Quaternion = {
        w: Math.cos(-Math.PI / 4),
        x: Math.sin(-Math.PI / 4),
        y: 0,
        z: 0,
      };
      const result = quaternionToEuler(q);

      expect(result.roll).toBeCloseTo(-90, 1);
    });
  });

  describe('gimbal lock handling', () => {
    it('handles gimbal lock at +90 degree pitch (device pointing straight up)', () => {
      // sinp = 2*(w*y - z*x) = 1 means pitch = 90 degrees
      // Quaternion for exactly 90 degree pitch
      const q: Quaternion = {
        w: Math.cos(Math.PI / 4),
        x: 0,
        y: Math.sin(Math.PI / 4),
        z: 0,
      };
      const result = quaternionToEuler(q);

      // Should clamp to +90 degrees, not produce NaN
      expect(result.pitch).toBeCloseTo(90, 1);
      expect(isFinite(result.pitch)).toBe(true);
      expect(isFinite(result.roll)).toBe(true);
      expect(isFinite(result.yaw)).toBe(true);
    });

    it('handles gimbal lock at -90 degree pitch (device pointing straight down)', () => {
      const q: Quaternion = {
        w: Math.cos(-Math.PI / 4),
        x: 0,
        y: Math.sin(-Math.PI / 4),
        z: 0,
      };
      const result = quaternionToEuler(q);

      expect(result.pitch).toBeCloseTo(-90, 1);
      expect(isFinite(result.pitch)).toBe(true);
    });
  });

  describe('combined rotations', () => {
    it('handles 45 degree pitch with 30 degree roll', () => {
      // Pre-computed quaternion for combined rotation
      const pitchRad = (45 * Math.PI) / 180;
      const rollRad = (30 * Math.PI) / 180;

      // ZYX rotation order quaternion construction
      const cy = Math.cos(0); // yaw = 0
      const sy = Math.sin(0);
      const cp = Math.cos(pitchRad / 2);
      const sp = Math.sin(pitchRad / 2);
      const cr = Math.cos(rollRad / 2);
      const sr = Math.sin(rollRad / 2);

      const q: Quaternion = {
        w: cr * cp * cy + sr * sp * sy,
        x: sr * cp * cy - cr * sp * sy,
        y: cr * sp * cy + sr * cp * sy,
        z: cr * cp * sy - sr * sp * cy,
      };

      const result = quaternionToEuler(q);

      // Allow some tolerance for combined rotations
      expect(result.pitch).toBeCloseTo(45, 0);
      expect(result.roll).toBeCloseTo(30, 0);
    });
  });

  describe('output format', () => {
    it('returns angles in degrees, not radians', () => {
      const q: Quaternion = {
        w: Math.cos(Math.PI / 4),
        x: Math.sin(Math.PI / 4),
        y: 0,
        z: 0,
      };
      const result = quaternionToEuler(q);

      // Roll should be ~90 degrees, not ~1.57 radians
      expect(Math.abs(result.roll)).toBeGreaterThan(45);
    });

    it('returns angles normalized to [-180, 180] range', () => {
      // Large rotation quaternion
      const q: Quaternion = {
        w: 0.1,
        x: 0.7,
        y: 0.5,
        z: 0.5,
      };
      // Normalize
      const mag = Math.sqrt(q.w * q.w + q.x * q.x + q.y * q.y + q.z * q.z);
      const normalized: Quaternion = {
        w: q.w / mag,
        x: q.x / mag,
        y: q.y / mag,
        z: q.z / mag,
      };
      const result = quaternionToEuler(normalized);

      expect(result.pitch).toBeGreaterThanOrEqual(-180);
      expect(result.pitch).toBeLessThanOrEqual(180);
      expect(result.roll).toBeGreaterThanOrEqual(-180);
      expect(result.roll).toBeLessThanOrEqual(180);
      expect(result.yaw).toBeGreaterThanOrEqual(-180);
      expect(result.yaw).toBeLessThanOrEqual(180);
    });

    it('includes timestamp in result', () => {
      const q: Quaternion = { w: 1, x: 0, y: 0, z: 0 };
      const before = Date.now();
      const result = quaternionToEuler(q);
      const after = Date.now();

      expect(result.timestamp).toBeGreaterThanOrEqual(before);
      expect(result.timestamp).toBeLessThanOrEqual(after);
    });
  });

  describe('edge cases', () => {
    it('handles unnormalized quaternion gracefully', () => {
      // Quaternion with magnitude != 1
      const q: Quaternion = { w: 2, x: 0, y: 0, z: 0 };
      const result = quaternionToEuler(q);

      // Should still produce finite values
      expect(isFinite(result.pitch)).toBe(true);
      expect(isFinite(result.roll)).toBe(true);
      expect(isFinite(result.yaw)).toBe(true);
    });

    it('handles near-zero magnitude quaternion', () => {
      const q: Quaternion = { w: 0.001, x: 0.001, y: 0.001, z: 0.001 };
      const result = quaternionToEuler(q);

      expect(isFinite(result.pitch)).toBe(true);
      expect(isFinite(result.roll)).toBe(true);
      expect(isFinite(result.yaw)).toBe(true);
    });
  });
});

// ============================================================================
// T010: Unit tests for angle normalization [-180, 180] range
// ============================================================================
describe('T010: normalizeAngle', () => {
  describe('values already in range', () => {
    it('returns 0 unchanged', () => {
      expect(normalizeAngle(0)).toBe(0);
    });

    it('returns 90 unchanged', () => {
      expect(normalizeAngle(90)).toBe(90);
    });

    it('returns -90 unchanged', () => {
      expect(normalizeAngle(-90)).toBe(-90);
    });

    it('returns 180 unchanged', () => {
      expect(normalizeAngle(180)).toBe(180);
    });

    it('returns -180 unchanged', () => {
      expect(normalizeAngle(-180)).toBe(-180);
    });

    it('returns 179.9 unchanged', () => {
      expect(normalizeAngle(179.9)).toBeCloseTo(179.9, 10);
    });

    it('returns -179.9 unchanged', () => {
      expect(normalizeAngle(-179.9)).toBeCloseTo(-179.9, 10);
    });
  });

  describe('positive overflow (> 180)', () => {
    it('normalizes 181 to -179', () => {
      expect(normalizeAngle(181)).toBeCloseTo(-179, 5);
    });

    it('normalizes 270 to -90', () => {
      expect(normalizeAngle(270)).toBeCloseTo(-90, 5);
    });

    it('normalizes 360 to 0', () => {
      expect(normalizeAngle(360)).toBeCloseTo(0, 5);
    });

    it('normalizes 450 to 90', () => {
      expect(normalizeAngle(450)).toBeCloseTo(90, 5);
    });

    it('normalizes 540 to 180 or -180', () => {
      const result = normalizeAngle(540);
      expect(Math.abs(result)).toBeCloseTo(180, 5);
    });

    it('normalizes 720 to 0', () => {
      expect(normalizeAngle(720)).toBeCloseTo(0, 5);
    });
  });

  describe('negative overflow (< -180)', () => {
    it('normalizes -181 to 179', () => {
      expect(normalizeAngle(-181)).toBeCloseTo(179, 5);
    });

    it('normalizes -270 to 90', () => {
      expect(normalizeAngle(-270)).toBeCloseTo(90, 5);
    });

    it('normalizes -360 to 0', () => {
      expect(normalizeAngle(-360)).toBeCloseTo(0, 5);
    });

    it('normalizes -450 to -90', () => {
      expect(normalizeAngle(-450)).toBeCloseTo(-90, 5);
    });

    it('normalizes -540 to 180 or -180', () => {
      const result = normalizeAngle(-540);
      expect(Math.abs(result)).toBeCloseTo(180, 5);
    });

    it('normalizes -720 to 0', () => {
      expect(normalizeAngle(-720)).toBeCloseTo(0, 5);
    });
  });

  describe('large values', () => {
    it('normalizes 3600 (10 full rotations) to 0', () => {
      expect(normalizeAngle(3600)).toBeCloseTo(0, 5);
    });

    it('normalizes -3600 to 0', () => {
      expect(normalizeAngle(-3600)).toBeCloseTo(0, 5);
    });

    it('normalizes 3645 (10 rotations + 45) to 45', () => {
      expect(normalizeAngle(3645)).toBeCloseTo(45, 5);
    });

    it('normalizes -3645 to -45', () => {
      expect(normalizeAngle(-3645)).toBeCloseTo(-45, 5);
    });
  });

  describe('decimal precision', () => {
    it('maintains decimal precision for 45.123', () => {
      expect(normalizeAngle(45.123)).toBeCloseTo(45.123, 10);
    });

    it('normalizes 360.123 to 0.123', () => {
      expect(normalizeAngle(360.123)).toBeCloseTo(0.123, 5);
    });

    it('normalizes -360.456 to -0.456', () => {
      expect(normalizeAngle(-360.456)).toBeCloseTo(-0.456, 5);
    });
  });

  describe('boundary conditions', () => {
    it('handles value just above 180', () => {
      expect(normalizeAngle(180.001)).toBeCloseTo(-179.999, 5);
    });

    it('handles value just below -180', () => {
      expect(normalizeAngle(-180.001)).toBeCloseTo(179.999, 5);
    });
  });
});

// ============================================================================
// Additional tests for supporting functions
// ============================================================================
describe('quaternionDotProduct', () => {
  it('returns 1 for identical quaternions', () => {
    const q: Quaternion = { w: 1, x: 0, y: 0, z: 0 };
    expect(quaternionDotProduct(q, q)).toBeCloseTo(1, 10);
  });

  it('returns correct dot product for orthogonal quaternions', () => {
    const q1: Quaternion = { w: 1, x: 0, y: 0, z: 0 };
    const q2: Quaternion = { w: 0, x: 1, y: 0, z: 0 };
    expect(quaternionDotProduct(q1, q2)).toBeCloseTo(0, 10);
  });

  it('returns -1 for opposite quaternions', () => {
    const q1: Quaternion = { w: 1, x: 0, y: 0, z: 0 };
    const q2: Quaternion = { w: -1, x: 0, y: 0, z: 0 };
    expect(quaternionDotProduct(q1, q2)).toBeCloseTo(-1, 10);
  });

  it('is commutative', () => {
    const q1: Quaternion = { w: 0.5, x: 0.5, y: 0.5, z: 0.5 };
    const q2: Quaternion = { w: 0.7, x: 0.3, y: 0.4, z: 0.5 };

    expect(quaternionDotProduct(q1, q2)).toBeCloseTo(
      quaternionDotProduct(q2, q1),
      10
    );
  });
});

describe('quaternionAngularDistance', () => {
  it('returns 0 for identical quaternions', () => {
    const q: Quaternion = { w: 1, x: 0, y: 0, z: 0 };
    expect(quaternionAngularDistance(q, q)).toBeCloseTo(0, 5);
  });

  it('returns 0 for opposite quaternions (same rotation)', () => {
    // q and -q represent the same rotation
    const q1: Quaternion = { w: 1, x: 0, y: 0, z: 0 };
    const q2: Quaternion = { w: -1, x: 0, y: 0, z: 0 };
    expect(quaternionAngularDistance(q1, q2)).toBeCloseTo(0, 5);
  });

  it('returns 90 for 90 degree rotation difference', () => {
    const identity: Quaternion = { w: 1, x: 0, y: 0, z: 0 };
    const rotated90: Quaternion = {
      w: Math.cos(Math.PI / 4),
      x: Math.sin(Math.PI / 4),
      y: 0,
      z: 0,
    };
    expect(quaternionAngularDistance(identity, rotated90)).toBeCloseTo(90, 1);
  });

  it('returns 180 for opposite orientations', () => {
    const identity: Quaternion = { w: 1, x: 0, y: 0, z: 0 };
    const rotated180: Quaternion = { w: 0, x: 1, y: 0, z: 0 };
    expect(quaternionAngularDistance(identity, rotated180)).toBeCloseTo(180, 1);
  });

  it('is symmetric', () => {
    const q1: Quaternion = { w: 0.9, x: 0.1, y: 0.2, z: 0.3 };
    const q2: Quaternion = { w: 0.8, x: 0.2, y: 0.3, z: 0.4 };
    // Normalize
    const mag1 = Math.sqrt(
      q1.w * q1.w + q1.x * q1.x + q1.y * q1.y + q1.z * q1.z
    );
    const mag2 = Math.sqrt(
      q2.w * q2.w + q2.x * q2.x + q2.y * q2.y + q2.z * q2.z
    );
    const n1: Quaternion = {
      w: q1.w / mag1,
      x: q1.x / mag1,
      y: q1.y / mag1,
      z: q1.z / mag1,
    };
    const n2: Quaternion = {
      w: q2.w / mag2,
      x: q2.x / mag2,
      y: q2.y / mag2,
      z: q2.z / mag2,
    };

    expect(quaternionAngularDistance(n1, n2)).toBeCloseTo(
      quaternionAngularDistance(n2, n1),
      10
    );
  });

  it('returns value in [0, 180] range', () => {
    const q1: Quaternion = { w: 0.5, x: 0.5, y: 0.5, z: 0.5 };
    const q2: Quaternion = { w: 0.1, x: 0.9, y: 0.3, z: 0.2 };
    // Normalize
    const mag2 = Math.sqrt(
      q2.w * q2.w + q2.x * q2.x + q2.y * q2.y + q2.z * q2.z
    );
    const n2: Quaternion = {
      w: q2.w / mag2,
      x: q2.x / mag2,
      y: q2.y / mag2,
      z: q2.z / mag2,
    };

    const distance = quaternionAngularDistance(q1, n2);
    expect(distance).toBeGreaterThanOrEqual(0);
    expect(distance).toBeLessThanOrEqual(180);
  });
});

describe('formatAngle', () => {
  describe('degrees format', () => {
    it('formats 45 degrees with default precision (1)', () => {
      expect(formatAngle(45)).toBe('45.0\u00B0');
    });

    it('formats with precision 0', () => {
      expect(formatAngle(45.678, 0)).toBe('46\u00B0');
    });

    it('formats with precision 2', () => {
      expect(formatAngle(45.678, 2)).toBe('45.68\u00B0');
    });

    it('formats with precision 3', () => {
      expect(formatAngle(45.6789, 3)).toBe('45.679\u00B0');
    });

    it('clamps precision to max 3', () => {
      expect(formatAngle(45.123456, 10)).toBe('45.123\u00B0');
    });

    it('clamps precision to min 0', () => {
      expect(formatAngle(45.678, -5)).toBe('46\u00B0');
    });
  });

  describe('radians format', () => {
    it('formats 180 degrees as PI radians', () => {
      const result = formatAngle(180, 2, 'radians');
      expect(result).toContain('rad');
      expect(parseFloat(result)).toBeCloseTo(Math.PI, 2);
    });

    it('formats 90 degrees as PI/2 radians', () => {
      const result = formatAngle(90, 3, 'radians');
      expect(parseFloat(result)).toBeCloseTo(Math.PI / 2, 3);
    });
  });

  describe('negative angles', () => {
    it('formats negative angles in degrees', () => {
      expect(formatAngle(-45.5, 1)).toBe('-45.5\u00B0');
    });

    it('formats negative angles in radians', () => {
      const result = formatAngle(-180, 2, 'radians');
      expect(parseFloat(result)).toBeCloseTo(-Math.PI, 2);
    });
  });
});

describe('isNormalizedQuaternion', () => {
  it('returns true for identity quaternion', () => {
    const q: Quaternion = { w: 1, x: 0, y: 0, z: 0 };
    expect(isNormalizedQuaternion(q)).toBe(true);
  });

  it('returns true for normalized non-identity quaternion', () => {
    const q: Quaternion = { w: 0.5, x: 0.5, y: 0.5, z: 0.5 };
    expect(isNormalizedQuaternion(q)).toBe(true);
  });

  it('returns false for unnormalized quaternion', () => {
    const q: Quaternion = { w: 2, x: 0, y: 0, z: 0 };
    expect(isNormalizedQuaternion(q)).toBe(false);
  });

  it('returns false for zero quaternion', () => {
    const q: Quaternion = { w: 0, x: 0, y: 0, z: 0 };
    expect(isNormalizedQuaternion(q)).toBe(false);
  });

  it('allows small tolerance (within 0.01)', () => {
    const q: Quaternion = { w: 1.005, x: 0, y: 0, z: 0 };
    expect(isNormalizedQuaternion(q)).toBe(true);
  });

  it('rejects values outside tolerance', () => {
    const q: Quaternion = { w: 1.02, x: 0, y: 0, z: 0 };
    expect(isNormalizedQuaternion(q)).toBe(false);
  });
});

describe('isValidSensorReading', () => {
  it('returns true for valid finite values', () => {
    expect(isValidSensorReading(45, -30, 120)).toBe(true);
  });

  it('returns true for zero values', () => {
    expect(isValidSensorReading(0, 0, 0)).toBe(true);
  });

  it('returns true for negative values', () => {
    expect(isValidSensorReading(-180, -90, -45)).toBe(true);
  });

  it('returns false when pitch is Infinity', () => {
    expect(isValidSensorReading(Infinity, 0, 0)).toBe(false);
  });

  it('returns false when roll is -Infinity', () => {
    expect(isValidSensorReading(0, -Infinity, 0)).toBe(false);
  });

  it('returns false when yaw is NaN', () => {
    expect(isValidSensorReading(0, 0, NaN)).toBe(false);
  });

  it('returns false when all values are NaN', () => {
    expect(isValidSensorReading(NaN, NaN, NaN)).toBe(false);
  });

  it('handles very large valid values', () => {
    expect(isValidSensorReading(1e10, -1e10, 1e10)).toBe(true);
  });

  it('handles very small valid values', () => {
    expect(isValidSensorReading(1e-10, -1e-10, 1e-10)).toBe(true);
  });
});
