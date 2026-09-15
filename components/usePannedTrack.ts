import React, { RefObject, useEffect, useRef, useState } from 'react';
import {
  MotionValue, useInView, useReducedMotion, useScroll, useTransform,
} from 'framer-motion';

/* ------------------------------------------------------------------ *
 * Horizontal card track, in two modes.
 *
 * DESKTOP — pinned scroll-scrub. The section sticks and the row pans sideways
 * as you scroll down.
 *
 * MOBILE — a native horizontally-scrollable strip you swipe, with scroll-snap.
 *
 * The split is not cosmetic. A pinned pan is scroll-linked JavaScript: the
 * scroll itself is handled on the compositor thread while the transform is
 * computed on the main thread, so the row lands a frame or more behind the
 * finger and visibly stutters during a fling. It also fights the reader —
 * a horizontal row of cards invites a sideways swipe, and on a pinned pan a
 * sideways swipe does nothing. Native overflow scrolling is handled entirely
 * by the compositor: it cannot stutter, it snaps, and it is the gesture people
 * already expect. This is what the industries section originally did on mobile,
 * with a comment saying as much, before it was unified to the pinned pan.
 *
 * The focus falloff survives in both modes. Desktop drives it from this hook's
 * scroll progress; the strip drives it from CSS scroll-driven animation
 * (.swipe-focus in index.css), so on a phone no JavaScript runs per frame at
 * all and the highlight cannot lag the finger.
 *
 * Everything is measured rather than expressed as a percentage: a percentage
 * translate is a share of the track's own width, so the correct value changes
 * with card size, gap, count and viewport. Both sections had shipped with a
 * wrong one — the service area under-panned (two cities unreachable on a
 * phone), industries over-panned (a screenful of dead space).
 * ------------------------------------------------------------------ */

export type PannedTrack = {
  /** True at the phone breakpoint: render the native scroller branch. */
  mobile: boolean;
  /** MOBILE: the native overflow-x container. */
  scroller: RefObject<HTMLDivElement | null>;
  /** DESKTOP: tall element providing the scroll distance. Attach runwayStyle. */
  runway: RefObject<HTMLDivElement | null>;
  /** DESKTOP: the sticky, viewport-sized stage. */
  stage: RefObject<HTMLDivElement | null>;
  /** The flex row of cards. Attach in whichever branch renders. */
  track: RefObject<HTMLDivElement | null>;
  /** 0 at the start of the travel, 1 at the end — in both modes. */
  progress: MotionValue<number>;
  /** DESKTOP only: the translate. */
  x: MotionValue<number>;
  /** Where in 0-1 progress each child sits under the centre. */
  at: number[];
  /** Median distance between neighbouring peaks — feed to useFocusPeak. */
  spacing: number;
  panMax: number;
  active: boolean;
  reduce: boolean;
  runwayStyle: React.CSSProperties | undefined;
  /** MOBILE: put on the scroller to hide the native scrollbar. */
  scrollerStyle: React.CSSProperties;
};

export const usePannedTrack = (panRate = 1.25): PannedTrack => {
  const runway = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  const active = useInView(runway, { margin: '20% 0px 20% 0px' });

  // Resolved synchronously on the first render so the correct branch mounts
  // once, rather than mounting the pinned runway and swapping it out.
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    // Listen on resize as well as the media query. The change event is the
    // right signal but it does not fire everywhere the viewport actually
    // changes size, and a missed flip leaves the wrong branch mounted —
    // a swipe strip on a desktop, or a pinned pan on a phone. Re-reading
    // mq.matches is exact whenever it runs, so the extra listener costs a
    // boolean compare and removes the failure mode.
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    window.addEventListener('resize', update);
    return () => {
      mq.removeEventListener('change', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const [pan, setPan] = useState<{ max: number; at: number[] }>({ max: 0, at: [] });

  useEffect(() => {
    const measure = () => {
      const t = track.current;
      const box = mobile ? scroller.current : stage.current;
      if (!t || !box) return;
      const vw = box.clientWidth;
      const max = Math.max(0, t.scrollWidth - vw);
      // Deliberately unclamped — a card that cannot reach the centre peaks just
      // off the end of the range instead of pinning at full brightness while
      // sitting visibly off to one side. Children hidden at this breakpoint
      // measure as zero-width and never take focus.
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
  }, [mobile]);

  // ---- desktop: progress from the pinned runway ----
  const { scrollYProgress } = useScroll({ target: runway, offset: ['start start', 'end end'] });

  // No mobile progress value: on the strip the focus falloff is CSS
  // (.swipe-focus + animation-timeline: view(inline)), so nothing needs to
  // track scroll position in JavaScript there.
  const progress = scrollYProgress;

  // The distance is read from a ref at transform time, NOT passed as a
  // useTransform output range. framer captures the output array from the render
  // that created the transform and never picks up a later one, so the first
  // measurement would be permanent: resize, or let the webfont swap in, and the
  // runway height updates while the translate keeps the old distance.
  const panMax = useRef(0);
  panMax.current = pan.max;
  const x = useTransform(scrollYProgress, (p: number) => -p * panMax.current);

  // Median gap between neighbouring peaks, ignoring panels hidden at this
  // breakpoint (they share a position and would read as zero gaps).
  const spacing = (() => {
    const pts = pan.at.filter((v, i, a) => i === 0 || v !== a[i - 1]);
    if (pts.length < 2) return 0.09;
    const gaps = pts.slice(1).map((v, i) => Math.abs(v - pts[i])).sort((a, b) => a - b);
    return gaps[Math.floor(gaps.length / 2)] || 0.09;
  })();

  return {
    mobile,
    scroller, runway, stage, track,
    progress,
    x,
    at: pan.at,
    spacing,
    panMax: pan.max,
    active,
    reduce,
    runwayStyle: pan.max
      ? { height: `calc(100vh + ${Math.round(pan.max / panRate)}px)` }
      : undefined,
    scrollerStyle: { scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties,
  };
};
