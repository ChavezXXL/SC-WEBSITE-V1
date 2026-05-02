
import React from 'react';
import { motion } from 'framer-motion';

const services = [
  { code: 'SVC-01', name: 'Microscope Deburring', anchor: 'service-microscope' },
  { code: 'SVC-02', name: 'Manual Deburring', anchor: 'service-manual' },
  { code: 'SVC-03', name: 'Blending', anchor: 'service-blending' },
];

export const ServicesIntro: React.FC = () => {
  const scrollTo = (anchor: string) => {
    const el = document.getElementById(anchor);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative min-h-screen bg-[#030305] overflow-hidden flex items-center justify-center py-32">

      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute top-[15%] left-[-10%] w-[600px] h-[600px] bg-[#00FFBD]/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-[#00FFBD]/8 blur-[140px] rounded-full" />
      </div>

      {/* Drafting corner ticks at viewport corners */}
      <span aria-hidden className="absolute top-10 left-10 w-5 h-px bg-[#00FFBD]" />
      <span aria-hidden className="absolute top-10 left-10 w-px h-5 bg-[#00FFBD]" />
      <span aria-hidden className="absolute top-10 right-10 w-5 h-px bg-[#00FFBD]" />
      <span aria-hidden className="absolute top-10 right-10 w-px h-5 bg-[#00FFBD]" />
      <span aria-hidden className="absolute bottom-10 left-10 w-5 h-px bg-[#00FFBD]" />
      <span aria-hidden className="absolute bottom-10 left-10 w-px h-5 bg-[#00FFBD]" />
      <span aria-hidden className="absolute bottom-10 right-10 w-5 h-px bg-[#00FFBD]" />
      <span aria-hidden className="absolute bottom-10 right-10 w-px h-5 bg-[#00FFBD]" />

      <div className="container mx-auto px-6 relative z-10 max-w-5xl">

        {/* Top status bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-16 md:mb-20 pb-4 border-b border-[#00FFBD]/20"
        >
          <div className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.3em] text-[#00FFBD]/85">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 inline-flex h-full w-full rounded-full bg-[#00FFBD] opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00FFBD]" />
            </span>
            <span>Service Spec — Section 04</span>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 hidden sm:block">
            SC-PRECISION-DEBURRING
          </div>
        </motion.div>

        {/* Kicker */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-mono text-[11px] uppercase tracking-[0.4em] text-[#00FFBD] mb-6"
        >
          ※ What We Do — 03 Capabilities
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl lg:text-9xl font-black text-white uppercase leading-[0.92] tracking-tight mb-8"
        >
          Our{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#9affde] to-[#00FFBD]">
            Services.
          </span>
        </motion.h2>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-lg md:text-2xl text-zinc-400 font-light leading-relaxed max-w-3xl mb-16 md:mb-20"
        >
          Three precision finishes — broken down step-by-step. Scroll through each capability to see what we do, how we do it, and the tolerance we hold.
        </motion.p>

        {/* Service roster — clickable, like a ToC */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="border-t border-white/[0.08]"
        >
          {services.map((svc, idx) => (
            <button
              key={svc.code}
              onClick={() => scrollTo(svc.anchor)}
              className="group w-full flex items-center justify-between py-6 md:py-7 border-b border-white/[0.08] hover:border-[#00FFBD]/40 hover:bg-[#00FFBD]/[0.02] transition-all duration-500 text-left"
            >
              <div className="flex items-center gap-6 md:gap-10">
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500 group-hover:text-[#00FFBD]/70 transition-colors w-16 md:w-20">
                  {svc.code}
                </span>
                <span className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight group-hover:text-[#00FFBD] transition-colors duration-300">
                  {svc.name}
                </span>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500 group-hover:text-[#00FFBD] transition-colors flex items-center gap-2">
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
          transition={{ duration: 0.8, delay: 0.5 }}
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
