
import React from 'react';
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
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative min-h-screen bg-[#030305] overflow-hidden flex items-center justify-center py-24 md:py-32">

      {/* Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-[#00FFBD]/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-[#00FFBD]/8 blur-[140px] rounded-full" />
      </div>

      {/* GIANT outline 03 — background flair */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none flex items-center justify-center select-none"
      >
        <span
          className="font-black text-transparent leading-none"
          style={{
            fontSize: 'clamp(20rem, 60vw, 50rem)',
            WebkitTextStroke: '1px rgba(0, 255, 189, 0.06)',
          }}
        >
          03
        </span>
      </div>

      {/* Drafting corner ticks */}
      <span aria-hidden className="absolute top-10 left-10 w-6 h-px bg-[#00FFBD]" />
      <span aria-hidden className="absolute top-10 left-10 w-px h-6 bg-[#00FFBD]" />
      <span aria-hidden className="absolute top-10 right-10 w-6 h-px bg-[#00FFBD]" />
      <span aria-hidden className="absolute top-10 right-10 w-px h-6 bg-[#00FFBD]" />
      <span aria-hidden className="absolute bottom-10 left-10 w-6 h-px bg-[#00FFBD]" />
      <span aria-hidden className="absolute bottom-10 left-10 w-px h-6 bg-[#00FFBD]" />
      <span aria-hidden className="absolute bottom-10 right-10 w-6 h-px bg-[#00FFBD]" />
      <span aria-hidden className="absolute bottom-10 right-10 w-px h-6 bg-[#00FFBD]" />

      <div className="container mx-auto px-6 relative z-10 max-w-6xl w-full">

        {/* Top status bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-16 md:mb-24 pb-4 border-b border-[#00FFBD]/30"
        >
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[#00FFBD]/85">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 inline-flex h-full w-full rounded-full bg-[#00FFBD] opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00FFBD]" />
            </span>
            <span>Section 03 — Trades of the Bench</span>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 hidden sm:block">
            SC-PRECISION-DEBURRING
          </div>
        </motion.div>

        {/* Hero typography block */}
        <div className="grid md:grid-cols-12 gap-y-12 md:gap-x-12 mb-20 md:mb-28">

          {/* LEFT: stacked title */}
          <div className="md:col-span-7">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="block w-8 h-px bg-[#00FFBD]" />
              <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-[#00FFBD]">
                Section 03
              </span>
            </motion.div>

            <h2 className="font-black text-white uppercase leading-[0.82] tracking-tight">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="block text-zinc-400"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
              >
                Our
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-[#9affde] to-[#00FFBD]"
                style={{ fontSize: 'clamp(5.5rem, 14vw, 12rem)' }}
              >
                Services.
              </motion.span>
            </h2>
          </div>

          {/* RIGHT: tagline + lockup */}
          <div className="md:col-span-5 flex md:items-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="md:pb-6 md:border-l md:border-[#00FFBD]/20 md:pl-6"
            >
              <p className="text-lg md:text-xl text-zinc-300 font-light leading-relaxed mb-6">
                Microscope work, manual finishing, and surface blending — three precision trades for the parts aerospace can't afford to get wrong.
              </p>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
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
              className="group w-full flex items-center justify-between gap-6 py-7 md:py-8 border-b border-white/[0.08] hover:border-[#00FFBD]/40 hover:bg-[#00FFBD]/[0.02] transition-all duration-500 text-left"
            >
              <div className="flex items-center gap-6 md:gap-10 flex-1 min-w-0">
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500 group-hover:text-[#00FFBD]/70 transition-colors w-16 md:w-20 flex-shrink-0">
                  {svc.code}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="block text-2xl md:text-4xl font-black text-white uppercase tracking-tight group-hover:text-[#00FFBD] transition-colors duration-300">
                    {svc.name}
                  </span>
                  <span className="hidden md:block text-xs uppercase tracking-[0.2em] text-zinc-500 mt-1 group-hover:text-zinc-400 transition-colors">
                    {svc.blurb}
                  </span>
                </div>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500 group-hover:text-[#00FFBD] transition-colors flex items-center gap-2 flex-shrink-0">
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
          className="mt-16 md:mt-20 flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500"
        >
          <span className="block w-12 h-px bg-zinc-700" />
          <span>Scroll to begin</span>
          <span className="block w-12 h-px bg-zinc-700" />
        </motion.div>
      </div>
    </section>
  );
};
