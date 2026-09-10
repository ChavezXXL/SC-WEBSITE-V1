
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView, useReducedMotion } from 'framer-motion';
import { useBackgroundVideo } from './useBackgroundVideo';
import { scrollToSection } from './scrollToSection';

const VIDEO_SRC = "/videos/hero-bg.mp4";
const VIDEO_POSTER = "/videos/posters/hero-bg.jpg";

export const Hero: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const videoRef = useRef<HTMLVideoElement>(null);
  useBackgroundVideo(videoRef, ref, VIDEO_SRC);

  const scrollToServices = (e: React.MouseEvent) => {
      e.preventDefault();
      scrollToSection('services');
  };

  return (
    <section
      ref={ref}
      className="relative min-h-stage w-full flex flex-col justify-center items-center bg-[#030305] overflow-hidden pt-28 pb-28 md:pt-24 md:pb-24"
    >
      {/* Video Background — single looping element (poster paints instantly) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Footage carries turquoise particulate. Desaturating and warming it in the
            browser reads as neutral dust instead of neon — no re-shoot required. */}
        <video
          ref={videoRef}
          muted
          playsInline
          loop
          preload="metadata"
          poster={VIDEO_POSTER}
          className="absolute inset-0 w-full h-full object-cover video-warm"
        />

        {/* Vignette + brand-tint overlay */}
        <div className="absolute inset-0 bg-[#030305]/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030305]/30 via-transparent to-[#030305]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(3,3,5,0.5)_75%,_#030305_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#CCFF00]/[0.03] via-transparent to-[#CCFF00]/[0.03] mix-blend-screen" />
      </div>

      <motion.div
        style={{
          y: shouldReduceMotion ? 0 : yText,
          opacity: shouldReduceMotion ? 1 : opacityText,
          willChange: inView && !shouldReduceMotion ? 'transform, opacity' : 'auto',
        }}
        className="relative z-20 container mx-auto px-6 text-center flex flex-col items-center"
      >
        {/* The wordmark is the hero. No tagline, no photograph — presence comes
            from scale, letterspacing and the single gold rule under it. */}
        <h1 className="mb-8 md:mb-10 flex flex-col items-center">
          <span className="sr-only">
            SC Deburring — precision deburring and aerospace micro-finishing, Pacoima, California.
          </span>

          <span
            aria-hidden
            className="block overflow-hidden font-space font-bold text-white uppercase leading-[0.9] tracking-[-0.015em]"
            style={{ fontSize: 'clamp(1.85rem, 10.5vw, 9.5rem)', textShadow: '0 4px 44px rgba(0,0,0,0.65)' }}
          >
            <motion.span
              initial={shouldReduceMotion ? false : { y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="block whitespace-nowrap"
            >
              SC Deburring
            </motion.span>
          </span>

          {/* Rule grows out from the centre once the wordmark has landed. */}
          <motion.span
            aria-hidden
            initial={shouldReduceMotion ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 md:mt-8 block h-px w-[min(28rem,80vw)] bg-gradient-to-r from-transparent via-[#CCFF00] to-transparent"
          />

          <motion.span
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.52 }}
            className="mt-5 md:mt-6 block font-mono text-[9px] md:text-[11px] uppercase tracking-[0.42em] md:tracking-[0.52em] text-[#CCFF00]"
          >
            Aerospace Micro-Finishing
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.62 }}
          className="text-[13.5px] md:text-[17px] font-light tracking-[0.02em] text-zinc-200 max-w-lg leading-snug mb-9 md:mb-12 px-1"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}
        >
          Precision deburring and micro-finishing for aerospace parts.
        </motion.p>


        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.82 }}
          className="w-full sm:w-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 px-2"
        >
          <a
            href="#contact"
            className="group w-full sm:w-auto text-center px-8 py-4 bg-[#CCFF00] border border-[#CCFF00] text-black font-black rounded-full transition-all hover:bg-transparent hover:text-[#CCFF00] md:hover:scale-105 shadow-[0_0_40px_rgba(204,255,0,0.25)]"
            onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
          >
            <span className="text-sm uppercase tracking-widest flex items-center gap-2">
              Send Us Your Print
            </span>
          </a>
          <a
            href="#services"
            className="group relative w-full sm:w-auto text-center px-8 py-4 bg-white/5 border border-white/10 backdrop-blur-md text-white font-medium rounded-full overflow-hidden transition-all hover:bg-white/10 hover:border-[#CCFF00]/40 md:hover:scale-105"
            onClick={scrollToServices}
          >
            <span className="relative z-10 text-sm uppercase tracking-widest flex items-center gap-2">
              Explore Our Standard
            </span>
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="hidden md:flex absolute bottom-12 left-1/2 -translate-x-1/2 text-zinc-300 flex-col items-center gap-2 z-20"
      >
        <div className="h-12 w-[1px] bg-gradient-to-b from-transparent via-zinc-300 to-transparent"></div>
        <span className="text-[10px] uppercase tracking-[0.2em] opacity-80">Scroll</span>
      </motion.div>
    </section>
  );
};
