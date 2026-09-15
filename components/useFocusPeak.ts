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
  /**
   * Typical progress distance between neighbouring peaks. Give this and the
   * spans scale themselves to it, so a row of 4 behaves like a row of 12.
   * Without it a wide-spaced row dims out completely between cards: 4 panels
   * sit 0.34 apart, the default span is 0.16, and halfway between two cards
   * every panel is at minimum scale and 40% opacity at once.
   */
  spacing?: number;
  /** Progress distance over which scale falls from 1 to scaleMin. */
  scaleSpan?: number;
  scaleMin?: number;
  /** Progress distance over which opacity falls from 1 to opacityMin. */
  opacitySpan?: number;
  opacityMin?: number;
};

/* Ratios taken from the 12-card service area, which is the reference feel:
 * peaks 0.091 apart with a 0.16 scale span and a 0.20 opacity span. Keeping
 * these multiples keeps neighbouring cards overlapping by the same amount at
 * any card count. */
const SCALE_RATIO = 1.78;
const OPACITY_RATIO = 2.2;

export const useFocusPeak = (
  progress: MotionValue<number>,
  at: number,
  { spacing, scaleSpan, scaleMin = 0.9, opacitySpan, opacityMin = 0.4 }: Opts = {},
) => {
  // Everything the transform reads goes through a ref, because useTransform
  // holds on to the closure from the render that created it. Measured values
  // that change later — resize, orientation change, webfont swap — would
  // otherwise never reach the transform, and the element would keep peaking at
  // its old position with its old spans.
  const cfg = useRef({ at, scaleSpan: 0, opacitySpan: 0 });
  cfg.current = {
    at,
    scaleSpan: scaleSpan ?? (spacing ? spacing * SCALE_RATIO : 0.16),
    opacitySpan: opacitySpan ?? (spacing ? spacing * OPACITY_RATIO : 0.2),
  };

  const falloff = (p: number, span: number, min: number) =>
    min + (1 - min) * (1 - Math.min(Math.abs(p - cfg.current.at) / Math.max(span, 1e-4), 1));

  return {
    scale: useTransform(progress, (p: number) => falloff(p, cfg.current.scaleSpan, scaleMin)),
    opacity: useTransform(progress, (p: number) => falloff(p, cfg.current.opacitySpan, opacityMin)),
  };
};
