
import React, { useRef } from 'react';
import { scrollToSection } from './scrollToSection';
import { motion, useScroll, useReducedMotion } from 'framer-motion';
import { useFocusPeak } from './useFocusPeak';

const services = [
  {
    code: 'SVC-01',
    name: 'Microscope Deburring',
    blurb: 'Manifolds, valve bodies, cross-drilled intersections.',
    anchor: 'service-microscope',
  },
  {
    code: 'SVC-02',
    name: 'Manual Deburring',
    blurb: 'Cut, radius, buff, inspect — by hand, every part.',
    anchor: 'service-manual',
  },
  {
    code: 'SVC-03',
    name: 'Blending',
    blurb: 'Tool marks erased. Surface continuous. Aerospace-grade.',
    anchor: 'service-blending',
  },
];

/* One service row. Same focus falloff as the service-area cards: it comes up
 * to full scale and full brightness as it crosses the middle of the viewport
 * and drops back as it leaves, so one trade reads as the subject at a time
 * instead of three flat rows competing. */
const ServiceRow: React.FC<{
  svc: (typeof services)[number];
  onJump: (anchor: string) => void;
  reduce: boolean;
}> = ({ svc, onJump, reduce }) => {
  const row = useRef<HTMLButtonElement>(null);
  // The row's own crossing of the viewport: 0 entering the bottom, 1 leaving
  // the top, so dead centre is 0.5.
  const { scrollYProgress } = useScroll({ target: row, offset: ['start end', 'end start'] });
  const { scale, opacity } = useFocusPeak(scrollYProgress, 0.5, {
    scaleSpan: 0.18, scaleMin: 0.95, opacitySpan: 0.22, opacityMin: 0.55,
  });

  return (
    <button
      ref={row}
      onClick={() => onJump(svc.anchor)}
      className="group w-full flex items-center justify-between gap-6 py-7 md:py-8 border-b border-white/[0.08] hover:border-[#CCFF00]/40 hover:bg-[#CCFF00]/[0.02] transition-all duration-500 text-left"
    >
      {/* The transform rides the CONTENT, not the row. Scaling the row itself
          drags its border-b along with it and leaves the list's dividing lines
          ragged all the way down as you scroll. */}
      <motion.div
        style={reduce ? undefined : { scale, opacity }}
        className="flex w-full items-center justify-between gap-6"
      >
        <div className="flex items-center gap-6 md:gap-10 flex-1 min-w-0">
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-400 group-hover:text-[#CCFF00]/90 transition-colors w-16 md:w-20 flex-shrink-0">
            {svc.code}
          </span>
          <div className="flex-1 min-w-0">
            <span className="block text-2xl md:text-4xl font-black text-white uppercase tracking-tight group-hover:text-[#CCFF00] transition-colors duration-300">
              {svc.name}
            </span>
            <span className="hidden md:block text-xs uppercase tracking-[0.2em] text-zinc-400 mt-1 group-hover:text-zinc-300 transition-colors">
              {svc.blurb}
            </span>
          </div>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-400 group-hover:text-[#CCFF00] transition-colors flex items-center gap-2 flex-shrink-0">
          <span className="hidden md:inline">View</span>
          <span className="block w-px h-4 bg-current" />
          <span className="text-lg leading-none translate-y-[-1px]">↓</span>
        </span>
      </motion.div>
    </button>
  );
};

export const ServicesIntro: React.FC = () => {
  const reduce = !!useReducedMotion();
  const scrollTo = (anchor: string) => {
    const el = document.getElementById(anchor);
    if (el) scrollToSection(el.id);
  };

  return (
    <section id="services-intro" className="relative min-h-screen bg-[#030305] overflow-hidden flex items-center justify-center py-24 md:py-32">

      {/* Atmosphere — pre-baked radial gradients (no 140px GPU blur layer) */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(204,255,0,0.10) 0%, rgba(204,255,0,0.04) 35%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(204,255,0,0.08) 0%, rgba(204,255,0,0.03) 35%, transparent 70%)' }}
        />
      </div>

      {/* GIANT outline SC — background flair */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none flex items-center justify-center select-none"
      >
        <span
          className="font-black text-transparent leading-none"
          style={{
            fontSize: 'clamp(20rem, 60vw, 50rem)',
            WebkitTextStroke: '1px rgba(204,255,0, 0.06)',
          }}
        >
          SC
        </span>
      </div>

      {/* Drafting corner ticks */}
      <span aria-hidden className="absolute top-10 left-10 w-6 h-px bg-[#CCFF00]" />
      <span aria-hidden className="absolute top-10 left-10 w-px h-6 bg-[#CCFF00]" />
      <span aria-hidden className="absolute top-10 right-10 w-6 h-px bg-[#CCFF00]" />
      <span aria-hidden className="absolute top-10 right-10 w-px h-6 bg-[#CCFF00]" />
      <span aria-hidden className="absolute bottom-10 left-10 w-6 h-px bg-[#CCFF00]" />
      <span aria-hidden className="absolute bottom-10 left-10 w-px h-6 bg-[#CCFF00]" />
      <span aria-hidden className="absolute bottom-10 right-10 w-6 h-px bg-[#CCFF00]" />
      <span aria-hidden className="absolute bottom-10 right-10 w-px h-6 bg-[#CCFF00]" />

      <div className="container mx-auto px-6 relative z-10 max-w-6xl w-full">

        {/* Top status bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 220, damping: 26, mass: 0.9 }}
          className="flex items-center justify-between mb-16 md:mb-24 pb-4 border-b border-[#CCFF00]/30"
        >
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[#CCFF00]/85">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 inline-flex h-full w-full rounded-full bg-[#CCFF00] opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#CCFF00]" />
            </span>
            <span>Our Services — Three Precision Trades</span>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-400 hidden sm:block">
            SC-PRECISION-DEBURRING
          </div>
        </motion.div>

        {/* Hero typography block */}
        <div className="grid md:grid-cols-12 gap-y-12 md:gap-x-12 mb-20 md:mb-28">

          {/* LEFT: stacked title */}
          <div className="md:col-span-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 220, damping: 26, mass: 0.9, delay:0.05  }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="block w-8 h-px bg-[#CCFF00]" />
              <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-[#CCFF00]">
                What We Do
              </span>
            </motion.div>

            <h2 className="font-normal text-white leading-[0.82] tracking-[-0.015em]">
              <motion.span
                initial={{ opacity: 0, y: 26, scale: 0.975 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 220, damping: 26, mass: 0.9, delay:0.1  }}
                className="block text-zinc-300"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
              >
                Our
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 26, scale: 0.975 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 220, damping: 26, mass: 0.9, delay:0.2  }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E4FF7A] to-[#CCFF00] pr-2 pb-2"
                style={{ fontSize: 'clamp(4rem, 11vw, 9rem)', overflow: 'visible' }}
              >
                Services.
              </motion.span>
            </h2>
          </div>

          {/* RIGHT: tagline + lockup */}
          <div className="md:col-span-4 flex md:items-end">
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 220, damping: 26, mass: 0.9, delay:0.4  }}
              className="md:pb-6 md:border-l md:border-[#CCFF00]/20 md:pl-6"
            >
              <p className="text-lg md:text-xl text-zinc-300 font-light leading-relaxed mb-6">
                Microscope work, manual finishing, and surface blending — three precision trades for the parts aerospace can't afford to get wrong.
              </p>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-400">
                Manifolds · Valve Bodies · Airfoils · Hydraulic Fittings
              </div>
            </motion.div>
          </div>
        </div>

        {/* Service ToC */}
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 220, damping: 26, mass: 0.9, delay:0.5  }}
          className="border-t border-white/[0.08]"
        >
          {services.map((svc) => (
            <ServiceRow key={svc.code} svc={svc} onJump={scrollTo} reduce={reduce} />
          ))}
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 220, damping: 26, mass: 0.9, delay:0.7  }}
          className="mt-16 md:mt-20 flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-400"
        >
          <span className="block w-12 h-px bg-zinc-700" />
          <span>Scroll to begin</span>
          <span className="block w-12 h-px bg-zinc-700" />
        </motion.div>
      </div>
    </section>
  );
};
