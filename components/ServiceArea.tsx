import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView, useReducedMotion, MotionValue } from 'framer-motion';
import { scrollToSection } from './scrollToSection';
import { useFocusPeak } from './useFocusPeak';

/* ------------------------------------------------------------------ *
 * Service area.
 *
 * Pinned horizontal scroll: the section sticks while the route track pans
 * sideways, then releases. Each card scales and brightens as it crosses the
 * middle of the viewport (see useFocusPeak).
 *
 * The pan distance and the runway length are both MEASURED, not guessed.
 * They used to be hardcoded percentages, and a percentage translate is a
 * share of the track's own width — so the correct value changes with card
 * size, gap, card count and viewport. At the phone breakpoint -58% covered
 * 1424px of a 2456px track: Santa Clarita and Valencia could not be reached
 * by scrolling at all. Desktop clipped the last card by 64px. Measuring the
 * track also lets the runway be sized so the row moves at a sane rate
 * against the scroll instead of 2.1x faster than the reader's thumb.
 *
 * Kern County was dropped — Central Valley, not Southern California.
 * ------------------------------------------------------------------ */

const ROUTE = [
  'Pacoima', 'Sun Valley', 'Sylmar', 'San Fernando', 'Van Nuys', 'North Hollywood',
  'Burbank', 'Glendale', 'Chatsworth', 'Northridge', 'Santa Clarita', 'Valencia',
];

const COUNTIES = ['Los Angeles', 'Orange', 'Ventura', 'San Bernardino', 'Riverside', 'San Diego'];

/** How far the row travels per pixel of scroll. Above 1 the row outruns the
 *  thumb, which is what made the pan feel like it was skipping frames. */
const PAN_RATE = 1.25;

/** One card. Peaks as it passes the centre of the viewport. */
const RouteCard: React.FC<{
  city: string; i: number; at: number; progress: MotionValue<number>; still: boolean; active: boolean;
}> = ({ city, i, at, progress, still, active }) => {
  const { scale, opacity } = useFocusPeak(progress, at);

  return (
    <motion.div
      style={still ? undefined : { scale, opacity, willChange: active ? 'transform, opacity' : 'auto' }}
      className="flex-none w-[190px] md:w-[280px] h-[200px] md:h-[280px] rounded-2xl bg-[#06080a] border border-white/[0.07] p-6 md:p-8 flex flex-col justify-between"
    >
      <span className="font-mono text-[10px] tracking-[0.24em] text-[#CCFF00]/70 tabular-nums">
        {String(i + 1).padStart(2, '0')}
      </span>
      <span className="font-space text-xl md:text-3xl font-normal tracking-[-0.02em] text-white leading-tight">
        {city}
      </span>
    </motion.div>
  );
};

export const ServiceArea: React.FC = () => {
  const runway = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  const active = useInView(runway, { margin: '20% 0px 20% 0px' });

  // Measured pan: how far the track must travel for its right edge to land on
  // the viewport's right edge, and where in that travel each card is centred.
  const [pan, setPan] = useState<{ max: number; at: number[] }>({ max: 0, at: [] });

  useEffect(() => {
    const measure = () => {
      const t = track.current, s = stage.current;
      if (!t || !s) return;
      const vw = s.clientWidth;
      const max = Math.max(0, t.scrollWidth - vw);
      // Deliberately unclamped — a card that cannot reach the centre peaks
      // just off the end of the range instead of pinning at full brightness
      // while sitting visibly off to one side.
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

  // The pan distance is read from a ref at transform time, NOT passed as a
  // useTransform output range. framer captures the output array from the render
  // that created the transform and does not pick up a later one, so the first
  // measurement was permanent: resize the window, or let the webfont swap in,
  // and the runway height updated to the new measurement while the translate
  // kept using the old distance — under-panning by exactly the difference and
  // pushing the last card back off the right edge.
  const panMax = useRef(0);
  panMax.current = pan.max;
  const x = useTransform(scrollYProgress, (p: number) => -p * panMax.current);

  return (
    <section id="service-area" className="relative bg-[#030305] border-t border-white/[0.05]">

      <div className="container mx-auto px-6 max-w-3xl pt-24 md:pt-32 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="block w-8 h-px bg-[#CCFF00]" />
          <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#CCFF00] whitespace-nowrap">
            Where We Work
          </h2>
          <span className="block w-8 h-px bg-[#CCFF00]" />
        </div>

        <p className="text-2xl md:text-4xl font-light tracking-[-0.02em] text-white leading-[1.15] mb-6">
          We pick up and deliver to machine shops across
          <span className="text-[#CCFF00]"> Southern California.</span>
        </p>
        <p className="text-[14.5px] md:text-base font-light leading-relaxed text-zinc-400 max-w-xl mx-auto">
          Our shop is in Pacoima. Most of our work comes from the San Fernando Valley
          and the aerospace corridor around it — for regular customers on that run we
          collect the lot and bring it back ourselves, so parts are not sitting on a
          freight dock waiting for a carrier.
        </p>
      </div>

      {/* ── pinned horizontal scroll ─────────────────────────────── */}
      {/* Runway = one stage plus the scroll needed to walk the whole track.
          Falls back to the old fixed heights until the measurement lands. */}
      <div
        ref={runway}
        className={pan.max ? 'relative' : 'relative h-[220vh] md:h-[260vh]'}
        style={pan.max ? { height: `calc(100vh + ${Math.round(pan.max / PAN_RATE)}px)` } : undefined}
      >
        <div ref={stage} className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">

          <span className="block text-center font-mono text-[10px] uppercase tracking-[0.34em] text-zinc-500 mb-10">
            Shops we deliver to
          </span>

          <motion.div
            ref={track}
            style={{ x: reduce ? 0 : x, willChange: active && !reduce ? 'transform' : 'auto' }}
            className="flex gap-4 md:gap-5 w-max items-center px-6 md:px-16"
          >
            {ROUTE.map((city, i) => (
              <RouteCard
                key={city}
                city={city}
                i={i}
                at={pan.at[i] ?? 0}
                progress={scrollYProgress}
                still={reduce || !pan.max}
                active={active}
              />
            ))}
          </motion.div>

          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-20 md:w-48 bg-gradient-to-r from-[#030305] via-[#030305]/70 to-transparent" />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-20 md:w-48 bg-gradient-to-l from-[#030305] via-[#030305]/70 to-transparent" />
        </div>
      </div>

      {/* ── counties ─────────────────────────────────────────────── */}
      <div className="container mx-auto px-6 max-w-4xl pb-24 md:pb-32 text-center">
        <span className="block font-mono text-[10px] uppercase tracking-[0.34em] text-zinc-500 mb-6">
          Counties served
        </span>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {COUNTIES.map((c, i) => (
            <motion.div
              key={c}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ type: 'spring', stiffness: 230, damping: 27, mass: 0.9, delay: i * 0.05 }}
              className="group bg-[#06080a] hover:bg-[#0a0e12] border border-white/[0.07] hover:border-[#CCFF00]/30 transition-[background-color,border-color] duration-500 ease-out rounded-2xl px-6 py-5 md:py-6"
            >
              <span className="block text-[15px] md:text-[17px] font-light text-zinc-100">
                {c} <span className="text-zinc-500">County</span>
              </span>
            </motion.div>
          ))}
        </div>

        <a
          href="#contact"
          onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
          className="group inline-flex items-center gap-2 min-h-[44px] mt-10 py-3 text-[#CCFF00] font-mono text-xs uppercase tracking-[0.3em] hover:text-white transition-colors duration-300"
        >
          <span className="relative">
            Ask if we run your way
            <span className="absolute -bottom-1 left-0 right-0 h-px bg-[#CCFF00] group-hover:bg-white transition-colors" />
          </span>
          <span className="text-base translate-y-[-1px]">→</span>
        </a>
      </div>
    </section>
  );
};
