/** Keep CSS --motion-ease in sync with native Web Animations. */
export const MOTION_EASING = "cubic-bezier(0.45, 0, 0.55, 1)";

/** Zero velocity and acceleration at both ends, with no overshoot. */
export function smootherstep(value: number) {
  const p = Math.min(1, Math.max(0, value));
  return Math.min(1, Math.max(0, p * p * p * (10 + p * (-15 + 6 * p))));
}
