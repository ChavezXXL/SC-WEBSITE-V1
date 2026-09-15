import React, { RefObject, useEffect, useRef, useState } from 'react';
import { MotionValue, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';

/* ------------------------------------------------------------------ *
 * Pinned horizontal track.
 *
 * The section sticks while a row of cards pans sideways, then releases.
 * Everything here is MEASURED from layout rather than expressed as a
 * percentage, because a percentage translate is a share of the track's own
 * width — so the right number changes with card size, gap, card count and
 * viewport, and there is no single value that is correct at every breakpoint.
 * Both sections that use this shipped with a wrong one: the service area
 * under-panned (two cities could not be reached by scrolling at all on a
 * phone) and industries over-panned (a screenful of empty space at the end).
 *
 * Returns the refs to attach, the scroll progress, the translate, and each
 * child's peak position for useFocusPeak.
 * ------------------------------------------------------------------ */

export type PannedTrack = {
  /** Tall element that provides the scroll distance. Attach `runwayStyle`. */
  runway: RefObject<HTMLDivElement | null>;
  /** The sticky, viewport-sized stage. */
  stage: RefObject<HTMLDivElement | null>;
  /** The flex row that actually moves. */
  track: RefObject<HTMLDivElement | null>;
  progress: MotionValue<number>;
  x: MotionValue<number>;
  /** Where in 0-1 progress each child sits under the viewport centre. */
  at: number[];
  /** Median distance between neighbouring peaks — feed to useFocusPeak. */
  spacing: number;
  panMax: number;
  /** True while the section is near the viewport — gate will-change on this. */
  active: boolean;
  reduce: boolean;
  /** Height that walks the whole track at `panRate`; undefined until measured. */
  runwayStyle: React.CSSProperties | undefined;
};

export const usePannedTrack = (panRate = 1.25): PannedTrack => {
  const runway = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  const active = useInView(runway, { margin: '20% 0px 20% 0px' });

  const [pan, setPan] = useState<{ max: number; at: number[] }>({ max: 0, at: [] });

  useEffect(() => {
    const measure = () => {
      const t = track.current, s = stage.current;
      if (!t || !s) return;
      const vw = s.clientWidth;
      const max = Math.max(0, t.scrollWidth - vw);
      // Deliberately unclamped — a card that cannot reach the centre peaks just
      // off the end of the range instead of pinning at full brightness while
      // sitting visibly off to one side. Children hidden at this breakpoint
      // measure as zero-width and simply never take focus.
      const at = Array.from(t.children).map((el) => {
        const c = el as HTMLElement;
        return max > 0 ? (c.offsetLeft + c.offsetWidth / 2 - vw / 2) / max : 0;
      });
      setPan((prev) =>
        prev.max === max && prev.at.length === at.length && prev.at.every((v, i) => v === at[i])
          ? prev
          : { max, at },
      );
    };

    measure();
    window.addEventListener('resize', measure);
    // Card widths move once the webfont swaps in, which lands after the first
    // measurement — remeasure rather than pan to a stale number.
    if (document.fonts?.ready) document.fonts.ready.then(measure).catch(() => {});
    return () => window.removeEventListener('resize', measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: runway, offset: ['start start', 'end end'] });

  // The distance is read from a ref at transform time, NOT passed as a
  // useTransform output range. framer captures the output array from the render
  // that created the transform and never picks up a later one, so the first
  // measurement would be permanent: resize the window, or let the webfont swap
  // in, and the runway height updates while the translate keeps the old
  // distance — under-panning by exactly the difference.
  const panMax = useRef(0);
  panMax.current = pan.max;
  const x = useTransform(scrollYProgress, (p: number) => -p * panMax.current);

  // Median gap between neighbouring peaks, ignoring panels hidden at this
  // breakpoint (they all report the same position and would read as zero gaps).
  const spacing = (() => {
    const pts = pan.at.filter((v, i, a) => i === 0 || v !== a[i - 1]);
    if (pts.length < 2) return 0.09;
    const gaps = pts.slice(1).map((v, i) => Math.abs(v - pts[i])).sort((a, b) => a - b);
    return gaps[Math.floor(gaps.length / 2)] || 0.09;
  })();

  return {
    runway, stage, track,
    progress: scrollYProgress,
    x,
    at: pan.at,
    spacing,
    panMax: pan.max,
    active,
    reduce,
    runwayStyle: pan.max
      ? { height: `calc(100vh + ${Math.round(pan.max / panRate)}px)` }
      : undefined,
  };
};
