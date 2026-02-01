import {
  calculateRollAngle,
  isWithinThreshold,
} from '../components/AngleLine/utils';

describe('calculateRollAngle', () => {
  it('returns 0 when device is level (x=0)', () => {
    // When x is 0 and y is positive (gravity in portrait), angle should be 0
    expect(calculateRollAngle(0, 1)).toBe(0);
    expect(calculateRollAngle(0, 0.5)).toBe(0);
  });

  it('returns positive angle when tilted right (positive x)', () => {
    // sin(30deg) ≈ 0.5, cos(30deg) ≈ 0.866
    const angle = calculateRollAngle(0.5, 0.866);
    expect(angle).toBeCloseTo(30, 0);
  });

  it('returns negative angle when tilted left (negative x)', () => {
    const angle = calculateRollAngle(-0.5, 0.866);
    expect(angle).toBeCloseTo(-30, 0);
  });

  it('returns ~45 degrees at 45 degree tilt', () => {
    // At 45 degrees, x and y components are equal
    const angle = calculateRollAngle(0.707, 0.707);
    expect(angle).toBeCloseTo(45, 0);
  });

  it('returns ~90 degrees when phone is on its side', () => {
    // When phone is completely on its side, x ≈ 1g, y ≈ 0
    // Using a very small y value gives close to but not exactly 90 degrees
    const angle = calculateRollAngle(1, 0.01);
    expect(angle).toBeGreaterThan(85);
    expect(angle).toBeLessThan(90);
  });

  it('handles tilted forward/backward orientation (negative y) consistently', () => {
    // Using Math.abs(y) should give same angle whether tilted forward or backward
    const tiltedBackAngle = calculateRollAngle(0.5, 0.866);
    const tiltedForwardAngle = calculateRollAngle(0.5, -0.866);
    expect(tiltedBackAngle).toBeCloseTo(tiltedForwardAngle, 5);
  });
});

describe('isWithinThreshold', () => {
  it('returns true when angle is exactly 0', () => {
    expect(isWithinThreshold(0, 1)).toBe(true);
  });

  it('returns true when angle is within positive threshold', () => {
    expect(isWithinThreshold(0.5, 1)).toBe(true);
    expect(isWithinThreshold(1, 1)).toBe(true);
  });

  it('returns true when angle is within negative threshold', () => {
    expect(isWithinThreshold(-0.5, 1)).toBe(true);
    expect(isWithinThreshold(-1, 1)).toBe(true);
  });

  it('returns false when angle exceeds positive threshold', () => {
    expect(isWithinThreshold(1.5, 1)).toBe(false);
    expect(isWithinThreshold(5, 1)).toBe(false);
  });

  it('returns false when angle exceeds negative threshold', () => {
    expect(isWithinThreshold(-1.5, 1)).toBe(false);
    expect(isWithinThreshold(-5, 1)).toBe(false);
  });

  it('works with different threshold values', () => {
    expect(isWithinThreshold(2, 3)).toBe(true);
    expect(isWithinThreshold(4, 3)).toBe(false);
    expect(isWithinThreshold(0.1, 0.5)).toBe(true);
    expect(isWithinThreshold(0.6, 0.5)).toBe(false);
  });
});
