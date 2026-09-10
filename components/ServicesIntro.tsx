
import React from 'react';
import { scrollToSection } from './scrollToSection';
import { motion } from 'framer-motion';

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

export const ServicesIntro: React.FC = () => {
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
          style={{ background: 'radial-gradient(circle, rgba(180,154,102,0.10) 0%, rgba(180,154,102,0.04) 35%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(180,154,102,0.08) 0%, rgba(180,154,102,0.03) 35%, transparent 70%)' }}
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
            WebkitTextStroke: '1px rgba(180,154,102, 0.06)',
          }}
        >
          SC
        </span>
      </div>

      {/* Drafting corner ticks */}
      <span aria-hidden className="absolute top-10 left-10 w-6 h-px bg-[#B49A66]" />
      <span aria-hidden className="absolute top-10 left-10 w-px h-6 bg-[#B49A66]" />
      <span aria-hidden className="absolute top-10 right-10 w-6 h-px bg-[#B49A66]" />
      <span aria-hidden className="absolute top-10 right-10 w-px h-6 bg-[#B49A66]" />
      <span aria-hidden className="absolute bottom-10 left-10 w-6 h-px bg-[#B49A66]" />
      <span aria-hidden className="absolute bottom-10 left-10 w-px h-6 bg-[#B49A66]" />
      <span aria-hidden className="absolute bottom-10 right-10 w-6 h-px bg-[#B49A66]" />
      <span aria-hidden className="absolute bottom-10 right-10 w-px h-6 bg-[#B49A66]" />

      <div className="container mx-auto px-6 relative z-10 max-w-6xl w-full">

        {/* Top status bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-16 md:mb-24 pb-4 border-b border-[#B49A66]/30"
        >
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[#B49A66]/85">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 inline-flex h-full w-full rounded-full bg-[#B49A66] opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#B49A66]" />
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
              transition={{ duration: 0.6, delay: 0.05 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="block w-8 h-px bg-[#B49A66]" />
              <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-[#B49A66]">
                What We Do
              </span>
            </motion.div>

            <h2 className="font-black text-white uppercase leading-[0.82] tracking-tight">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="block text-zinc-300"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
              >
                Our
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-[#D9C89E] to-[#B49A66] pr-2 pb-2"
                style={{ fontSize: 'clamp(4rem, 11vw, 9rem)', overflow: 'visible' }}
              >
                Services.
              </motion.span>
            </h2>
          </div>

          {/* RIGHT: tagline + lockup */}
          <div className="md:col-span-4 flex md:items-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="md:pb-6 md:border-l md:border-[#B49A66]/20 md:pl-6"
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="border-t border-white/[0.08]"
        >
          {services.map((svc) => (
            <button
              key={svc.code}
              onClick={() => scrollTo(svc.anchor)}
              className="group w-full flex items-center justify-between gap-6 py-7 md:py-8 border-b border-white/[0.08] hover:border-[#B49A66]/40 hover:bg-[#B49A66]/[0.02] transition-all duration-500 text-left"
            >
              <div className="flex items-center gap-6 md:gap-10 flex-1 min-w-0">
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-400 group-hover:text-[#B49A66]/90 transition-colors w-16 md:w-20 flex-shrink-0">
                  {svc.code}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="block text-2xl md:text-4xl font-black text-white uppercase tracking-tight group-hover:text-[#B49A66] transition-colors duration-300">
                    {svc.name}
                  </span>
                  <span className="hidden md:block text-xs uppercase tracking-[0.2em] text-zinc-400 mt-1 group-hover:text-zinc-300 transition-colors">
                    {svc.blurb}
                  </span>
                </div>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-400 group-hover:text-[#B49A66] transition-colors flex items-center gap-2 flex-shrink-0">
                <span className="hidden md:inline">View</span>
                <span className="block w-px h-4 bg-current" />
                <span className="text-lg leading-none translate-y-[-1px]">↓</span>
              </span>
            </button>
          ))}
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.7 }}
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
