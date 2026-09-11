import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, MotionValue } from 'framer-motion';
import { scrollToSection } from './scrollToSection';

/* ------------------------------------------------------------------ *
 * Service area.
 *
 * Pinned horizontal scroll: the section sticks while the route track pans
 * sideways, then releases. Each card also scales and brightens as it crosses
 * the middle of the viewport — a flat linear pan reads mechanical, and the
 * focus falloff gives the row depth and tells the eye where to look.
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
  city: string; i: number; total: number; progress: MotionValue<number>; reduce: boolean;
}> = ({ city, i, total, progress, reduce }) => {
  // Roughly where in the pan this card sits under the viewport centre.
  // Computed as a function of progress rather than an offset array: the first
  // and last cards would need offsets of -0.16 and 1.16, which framer rejects
  // (offsets must sit inside [0,1] and increase) and which crashed the section.
  const at = i / (total - 1);
  const falloff = (p: number, span: number, min: number) =>
    min + (1 - min) * (1 - Math.min(Math.abs(p - at) / span, 1));
  const scale   = useTransform(progress, (p: number) => falloff(p, 0.16, 0.9));
  const opacity = useTransform(progress, (p: number) => falloff(p, 0.2, 0.4));

  return (
    <motion.div
      style={reduce ? undefined : { scale, opacity }}
      className="flex-none w-[190px] md:w-[280px] h-[200px] md:h-[280px] rounded-2xl bg-[#06080a] border border-white/[0.07] p-6 md:p-8 flex flex-col justify-between will-change-transform"
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
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: runway, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], ['2%', '-58%']);

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
      <div ref={runway} className="relative h-[220vh] md:h-[260vh]">
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">

          <span className="block text-center font-mono text-[10px] uppercase tracking-[0.34em] text-zinc-500 mb-10">
            Shops we deliver to
          </span>

          <motion.div
            style={{ x: reduce ? '-28%' : x }}
            className="flex gap-4 md:gap-5 w-max items-center will-change-transform"
          >
            {ROUTE.map((city, i) => (
              <RouteCard
                key={city}
                city={city}
                i={i}
                total={ROUTE.length}
                progress={scrollYProgress}
                reduce={reduce}
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
