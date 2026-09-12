import { useRef } from 'react';
import { useTransform, MotionValue } from 'framer-motion';

/* ------------------------------------------------------------------ *
 * Focus falloff.
 *
 * An element scales and brightens as it approaches a point in a scroll
 * range and falls back as it leaves — so one thing is in focus at a time
 * and the eye is told where to look. A flat linear pan reads mechanical;
 * this gives a row depth.
 *
 * `at` is where in the 0-1 progress range this element peaks. It may sit
 * outside [0,1] on purpose: the first and last cards of a pan can never
 * reach the centre of the viewport, so their peak is off the end of the
 * range and they settle just under full scale rather than sitting at full
 * brightness while visibly off-centre.
 *
 * Written as a distance function rather than a framer offset array —
 * offsets must sit inside [0,1] and increase, and edge cards need values
 * like -0.03 and 1.04, which framer rejects at runtime.
 * ------------------------------------------------------------------ */

type Opts = {
  /** Progress distance over which scale falls from 1 to scaleMin. */
  scaleSpan?: number;
  scaleMin?: number;
  /** Progress distance over which opacity falls from 1 to opacityMin. */
  opacitySpan?: number;
  opacityMin?: number;
};

export const useFocusPeak = (
  progress: MotionValue<number>,
  at: number,
  { scaleSpan = 0.16, scaleMin = 0.9, opacitySpan = 0.2, opacityMin = 0.4 }: Opts = {},
) => {
  // `at` goes through a ref because useTransform holds on to the closure from
  // the render that created it. A measured `at` that changes later — resize,
  // orientation change, webfont swap — would otherwise never reach the
  // transform, and the element would keep peaking at its old position.
  const atRef = useRef(at);
  atRef.current = at;

  const falloff = (p: number, span: number, min: number) =>
    min + (1 - min) * (1 - Math.min(Math.abs(p - atRef.current) / span, 1));

  return {
    scale: useTransform(progress, (p: number) => falloff(p, scaleSpan, scaleMin)),
    opacity: useTransform(progress, (p: number) => falloff(p, opacitySpan, opacityMin)),
  };
};
