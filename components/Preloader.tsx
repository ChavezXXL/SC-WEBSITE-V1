
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const phases = [
  'INITIALIZING BENCH',
  'CALIBRATING TOOLS',
  'LOADING SPEC SHEETS',
  'BENCH READY',
];

export const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);

  // Lock background scroll while preloader is up
  useEffect(() => {
    if (!isLoading) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, [isLoading]);

  useEffect(() => {
    const start = performance.now();
    const total = 1800;
    let raf = 0;

    const tick = () => {
      const elapsed = performance.now() - start;
      const p = Math.min(1, elapsed / total);
      setProgress(p);
      const idx = Math.min(phases.length - 1, Math.floor(p * phases.length));
      setPhaseIdx(idx);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setIsLoading(false), 350);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const pct = Math.round(progress * 100);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[100] bg-[#030305] flex items-center justify-center overflow-hidden"
        >
          {/* Background atmospherics */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-[#00FFBD]/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-[#00FFBD]/8 blur-[120px] rounded-full" />
          </div>

          {/* Drafting corner ticks */}
          <span aria-hidden className="absolute top-8 left-8 w-5 h-px bg-[#00FFBD]" />
          <span aria-hidden className="absolute top-8 left-8 w-px h-5 bg-[#00FFBD]" />
          <span aria-hidden className="absolute top-8 right-8 w-5 h-px bg-[#00FFBD]" />
          <span aria-hidden className="absolute top-8 right-8 w-px h-5 bg-[#00FFBD]" />
          <span aria-hidden className="absolute bottom-8 left-8 w-5 h-px bg-[#00FFBD]" />
          <span aria-hidden className="absolute bottom-8 left-8 w-px h-5 bg-[#00FFBD]" />
          <span aria-hidden className="absolute bottom-8 right-8 w-5 h-px bg-[#00FFBD]" />
          <span aria-hidden className="absolute bottom-8 right-8 w-px h-5 bg-[#00FFBD]" />

          {/* Top status bar */}
          <div className="absolute top-8 left-0 right-0 px-16 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-[#00FFBD]/85">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 inline-flex h-full w-full rounded-full bg-[#00FFBD] opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00FFBD]" />
              </span>
              <span>System Boot</span>
            </div>
            <div className="hidden sm:block text-zinc-500">SC-PRECISION-DEBURRING</div>
          </div>

          {/* Bottom status bar */}
          <div className="absolute bottom-8 left-0 right-0 px-16 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
            <div>BENCH 01 / 03</div>
            <div className="tabular-nums text-[#00FFBD]/70">{String(pct).padStart(3, '0')} / 100</div>
          </div>

          {/* Center stack */}
          <div className="relative z-10 flex flex-col items-center px-6 max-w-xl w-full">

            {/* Tiny kicker */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#00FFBD] mb-6"
            >
              ※ Precision Bench
            </motion.div>

            {/* Logo */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-5xl font-black text-white font-sans tracking-tight uppercase mb-3"
            >
              SC<span className="text-[#00FFBD]">·</span>Deburring
            </motion.h1>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-mono text-[10px] uppercase tracking-[0.35em] text-zinc-500 mb-12"
            >
              Where Precision Meets Perfection
            </motion.div>

            {/* Progress block */}
            <div className="w-full max-w-md">
              {/* Phase label */}
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#00FFBD]">
                  {phases[phaseIdx]}
                </span>
                <span className="font-mono text-[11px] tabular-nums text-zinc-500">
                  {String(phaseIdx + 1).padStart(2, '0')} / 0{phases.length}
                </span>
              </div>

              {/* Bar */}
              <div className="relative h-px w-full bg-white/[0.08] overflow-hidden mb-3">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-[#00FFBD]"
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Tick marks under bar */}
              <div className="flex items-center justify-between">
                {[0, 25, 50, 75, 100].map((t) => (
                  <div key={t} className="flex flex-col items-center gap-1">
                    <span className={`block w-px h-2 ${pct >= t ? 'bg-[#00FFBD]' : 'bg-white/15'}`} />
                    <span className={`font-mono text-[9px] tabular-nums tracking-widest ${pct >= t ? 'text-[#00FFBD]/70' : 'text-zinc-700'}`}>
                      {String(t).padStart(2, '0')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
