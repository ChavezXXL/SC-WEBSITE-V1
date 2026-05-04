
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const VIDEO_SRC = '/videos/cta-bg.mp4';
const CROSSFADE_SECONDS = 1.2;

export const PrecisionCTA: React.FC = () => {
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const [activeVideo, setActiveVideo] = useState<'a' | 'b'>('a');

  useEffect(() => {
    const a = videoARef.current;
    const b = videoBRef.current;
    if (!a || !b) return;

    a.play().catch(() => {});

    const handleTimeUpdate = (which: 'a' | 'b') => () => {
      const me = which === 'a' ? a : b;
      const other = which === 'a' ? b : a;
      if (!me.duration || isNaN(me.duration)) return;
      if (me.currentTime >= me.duration - CROSSFADE_SECONDS) {
        if (other.paused) {
          other.currentTime = 0;
          other.play().catch(() => {});
          setActiveVideo(which === 'a' ? 'b' : 'a');
        }
      }
    };

    const aHandler = handleTimeUpdate('a');
    const bHandler = handleTimeUpdate('b');
    a.addEventListener('timeupdate', aHandler);
    b.addEventListener('timeupdate', bHandler);

    return () => {
      a.removeEventListener('timeupdate', aHandler);
      b.removeEventListener('timeupdate', bHandler);
    };
  }, []);

  return (
    <section className="relative py-32 md:py-44 overflow-hidden bg-[#030305]">

      {/* Video Background — dual-element seamless crossfade */}
      <div className="absolute inset-0 pointer-events-none">
        <video
          ref={videoARef}
          src={VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-linear ${activeVideo === 'a' ? 'opacity-100' : 'opacity-0'}`}
        />
        <video
          ref={videoBRef}
          src={VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-linear ${activeVideo === 'b' ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Vignette + brand-tint overlays */}
        <div className="absolute inset-0 bg-[#030305]/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030305] via-[#030305]/35 to-[#030305]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(3,3,5,0.6)_75%,_#030305_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#00FFBD]/[0.04] via-transparent to-[#00FFBD]/[0.04] mix-blend-screen" />
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

      {/* Decorative top/bottom hairlines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00FFBD]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00FFBD]/30 to-transparent" />

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        <div className="max-w-5xl">

          {/* Kicker */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <span className="block w-8 h-px bg-[#00FFBD]" />
            <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-[#00FFBD]">
              The Standard We Set
            </span>
            <span className="block w-8 h-px bg-[#00FFBD]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-black mb-8 tracking-tight uppercase leading-[0.9]"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 7.5rem)' }}
          >
            <span className="block text-white">Precision is</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-[#9affde] to-[#00FFBD]">
              not an option.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-lg md:text-2xl text-zinc-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
          >
            It is the absolute requirement. We handle the finishing touches that ensure safety, performance, and longevity.
          </motion.p>

          {/* Industry roster — engineering caption style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mb-12"
          >
            <div className="flex flex-wrap justify-center items-center gap-x-3 md:gap-x-4 gap-y-2 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-zinc-300">
              <span>Manifolds</span>
              <span className="text-[#00FFBD]/60">·</span>
              <span>Valve Bodies</span>
              <span className="text-[#00FFBD]/60">·</span>
              <span>Airfoils</span>
              <span className="text-[#00FFBD]/60">·</span>
              <span>Hydraulic Fittings</span>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="group inline-flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 bg-[#00FFBD] text-black font-black text-sm uppercase tracking-[0.2em] rounded-none border border-[#00FFBD] hover:bg-transparent hover:text-[#00FFBD] transition-all duration-300 shadow-[0_0_40px_rgba(0,255,189,0.25)] hover:shadow-[0_0_60px_rgba(0,255,189,0.45)]"
            >
              Get a Free Quote
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
