
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';
import { useBackgroundVideo } from './useBackgroundVideo';
import { trackPhoneClick } from '../services/analytics';

const VIDEO_SRC = '/videos/cta-bg.mp4';
const VIDEO_POSTER = '/videos/posters/cta-bg.jpg';

export const PrecisionCTA: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  useBackgroundVideo(videoRef, sectionRef, VIDEO_SRC);

  return (
    <section ref={sectionRef} className="relative py-32 md:py-44 overflow-hidden bg-[#030305]">

      {/* Video Background — single looping element (poster paints instantly) */}
      <div className="absolute inset-0 pointer-events-none">
        <video
          ref={videoRef}
          muted
          playsInline
          loop
          preload="metadata"
          poster={VIDEO_POSTER}
          className="absolute inset-0 w-full h-full object-cover"
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
              The Overflow Bench
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
            <span className="block text-white">Your bench is full.</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-[#9affde] to-[#00FFBD]">
              Ours isn't.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-lg md:text-2xl text-zinc-300 mb-6 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Shops across SoCal send us the deburring and finishing their own bench can't get to — so jobs don't slip and nobody has to hire.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base md:text-xl text-[#00FFBD] mb-12 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Send a small first lot and see the work before you commit to anything.
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
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <a
              href="tel:+18183894234"
              onClick={() => trackPhoneClick()}
              className="group inline-flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 bg-[#00FFBD] text-black font-black text-sm uppercase tracking-[0.2em] rounded-none border border-[#00FFBD] hover:bg-transparent hover:text-[#00FFBD] transition-all duration-300 shadow-[0_0_40px_rgba(0,255,189,0.25)] hover:shadow-[0_0_60px_rgba(0,255,189,0.45)]"
            >
              <Phone className="w-4 h-4" strokeWidth={2.5} />
              Call Santiago — (818) 389-4234
            </a>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="group inline-flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 bg-white/5 border border-white/15 backdrop-blur-md text-white font-medium text-sm uppercase tracking-[0.2em] hover:bg-white/10 hover:border-[#00FFBD]/40 transition-all duration-300"
            >
              Send a batch
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
