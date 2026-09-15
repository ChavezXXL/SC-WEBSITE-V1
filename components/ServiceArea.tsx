import React from 'react';
import { motion, MotionValue } from 'framer-motion';
import { scrollToSection } from './scrollToSection';
import { usePannedTrack } from './usePannedTrack';
import { useFocusPeak } from './useFocusPeak';

/* ------------------------------------------------------------------ *
 * Service area.
 *
 * Pinned horizontal scroll: the section sticks while the route track pans
 * sideways, then releases. Each card scales and brightens as it crosses the
 * middle of the viewport (see useFocusPeak).
 *
 * The pan distance and runway length are measured by usePannedTrack, shared
 * with the industries section. They used to be a hardcoded -58%, which at the
 * phone breakpoint covered 1424px of a 2456px track: Santa Clarita and
 * Valencia could not be reached by scrolling at all.
 *
 * Kern County was dropped — Central Valley, not Southern California.
 * ------------------------------------------------------------------ */

const ROUTE = [
  'Pacoima', 'Sun Valley', 'Sylmar', 'San Fernando', 'Van Nuys', 'North Hollywood',
  'Burbank', 'Glendale', 'Chatsworth', 'Northridge', 'Santa Clarita', 'Valencia',
];

const COUNTIES = ['Los Angeles', 'Orange', 'Ventura', 'San Bernardino', 'Riverside', 'San Diego'];

/** One card. Peaks as it passes the centre of the viewport. */
const RouteCard: React.FC<{
  city: string; i: number; at: number; spacing: number; progress: MotionValue<number>;
  still: boolean; active: boolean; snap?: boolean;
}> = ({ city, i, at, spacing, progress, still, active, snap }) => {
  const { scale, opacity } = useFocusPeak(progress, at, { spacing });

  return (
    <motion.div
      // On the swipe strip the falloff is CSS (.swipe-focus, scroll-driven), so
      // no inline style, no motion values and no promoted layers — the
      // compositor runs it and it cannot lag behind the finger.
      style={(still || snap) ? undefined : { scale, opacity, willChange: active ? 'transform, opacity' : 'auto' }}
      className={`flex-none w-[190px] md:w-[280px] h-[200px] md:h-[280px] rounded-2xl bg-[#06080a] border border-white/[0.07] p-6 md:p-8 flex flex-col justify-between ${snap ? 'snap-center' : ''}`}
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
  const pan = usePannedTrack();

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

      {/* ── the route row ────────────────────────────────────────── */}
      {/* Mobile swipes a native scroller; desktop pins and pans. See
          usePannedTrack for why the two modes are not the same code. */}
      {pan.mobile ? (
        <div className="pt-14 pb-16">
          <span className="block text-center font-mono text-[10px] uppercase tracking-[0.34em] text-zinc-500 mb-8">
            Shops we deliver to
          </span>

          <div className="relative">
            <div
              ref={pan.scroller}
              style={pan.scrollerStyle}
              className="no-scrollbar overflow-x-auto overscroll-x-contain snap-x snap-mandatory"
            >
              <div ref={pan.track} className="swipe-focus flex gap-4 w-max items-center px-6 pb-2">
                {ROUTE.map((city, i) => (
                  <RouteCard
                    key={city}
                    city={city}
                    i={i}
                    at={pan.at[i] ?? 0}
                    spacing={pan.spacing}
                    progress={pan.progress}
                    still={pan.reduce || !pan.panMax}
                    active={pan.active}
                    snap
                  />
                ))}
              </div>
            </div>

            <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#030305] to-transparent" />
            <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#030305] to-transparent" />
          </div>

          <p className="px-6 mt-5 font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-500 text-center">
            Swipe to explore →
          </p>
        </div>
      ) : (
        <div
          ref={pan.runway}
          className={pan.panMax ? 'relative' : 'relative h-[260vh]'}
          style={pan.runwayStyle}
        >
          <div ref={pan.stage} className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">

            <span className="block text-center font-mono text-[10px] uppercase tracking-[0.34em] text-zinc-500 mb-10">
              Shops we deliver to
            </span>

            <motion.div
              ref={pan.track}
              style={{ x: pan.reduce ? 0 : pan.x, willChange: pan.active && !pan.reduce ? 'transform' : 'auto' }}
              className="flex gap-5 w-max items-center px-16"
            >
              {ROUTE.map((city, i) => (
                <RouteCard
                  key={city}
                  city={city}
                  i={i}
                  at={pan.at[i] ?? 0}
                  spacing={pan.spacing}
                  progress={pan.progress}
                  still={pan.reduce || !pan.panMax}
                  active={pan.active}
                />
              ))}
            </motion.div>

            <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-[#030305] via-[#030305]/70 to-transparent" />
            <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-[#030305] via-[#030305]/70 to-transparent" />
          </div>
        </div>
      )}

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
