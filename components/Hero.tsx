
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
        <div className="absolute inset-0 bg-gradient-to-r from-[#B49A66]/[0.03] via-transparent to-[#B49A66]/[0.03] mix-blend-screen" />
      </div>

      <motion.div
        style={{
          y: shouldReduceMotion ? 0 : yText,
          opacity: shouldReduceMotion ? 1 : opacityText,
          willChange: inView && !shouldReduceMotion ? 'transform, opacity' : 'auto',
        }}
        className="relative z-20 container mx-auto px-6 text-center flex flex-col items-center"
      >
        {/* Identity lockup — small. The company name is not the message, so it
            no longer takes the largest type on the page. */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center mb-8 md:mb-10"
          aria-hidden
        >
          <span
            className="font-space text-[1.6rem] sm:text-[2rem] md:text-[2.6rem] font-bold uppercase tracking-[0.16em] md:tracking-[0.2em] text-white leading-none"
            style={{ textShadow: '0 3px 30px rgba(0,0,0,0.7)' }}
          >
            SC Deburring
          </span>
          <span className="mt-3 md:mt-4 flex items-center gap-3 md:gap-4">
            <span className="w-5 md:w-8 h-px bg-[#B49A66]" />
            <span className="font-mono text-[8.5px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-[#B49A66] whitespace-nowrap">
              Aerospace Micro-Finishing
            </span>
            <span className="w-5 md:w-8 h-px bg-[#B49A66]" />
          </span>
        </motion.div>

        {/* The promise carries the page. Keywords stay inside the h1 on the
            second line, so the display type costs nothing in search. */}
        <h1 className="mb-7 md:mb-9">
          <span className="sr-only">
            Precision deburring and aerospace micro-finishing for parts that have no margin for error.
          </span>

          <span aria-hidden className="block font-space font-bold text-white uppercase leading-[0.88] tracking-[-0.02em]" style={{ fontSize: 'clamp(2.9rem, 11vw, 8.5rem)', textShadow: '0 4px 44px rgba(0,0,0,0.65)' }}>
            <span className="block overflow-hidden">
              <motion.span
                initial={shouldReduceMotion ? false : { y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                No margin
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                initial={shouldReduceMotion ? false : { y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                for <span className="text-[#B49A66]">error.</span>
              </motion.span>
            </span>
          </span>

          <motion.span
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.5 }}
            className="mt-5 md:mt-7 block text-[13px] md:text-[17px] font-light tracking-[0.02em] text-zinc-200 max-w-xl mx-auto leading-snug px-1"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}
          >
            Precision deburring and micro-finishing for aerospace parts.
          </motion.span>
        </h1>

        {/* The stakes — why this work exists at all */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.65 }}
          className="text-[12.5px] md:text-[15px] font-light text-zinc-400 max-w-md leading-relaxed mb-8 md:mb-11 px-1"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}
        >
          A burr left inside a fuel manifold becomes FOD. FOD ends flights.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="w-full sm:w-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 px-2"
        >
          <a
            href="#contact"
            className="group w-full sm:w-auto text-center px-8 py-4 bg-[#B49A66] border border-[#B49A66] text-black font-black rounded-full transition-all hover:bg-transparent hover:text-[#B49A66] md:hover:scale-105 shadow-[0_0_40px_rgba(180,154,102,0.25)]"
            onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
          >
            <span className="text-sm uppercase tracking-widest flex items-center gap-2">
              Send Us Your Print
            </span>
          </a>
          <a
            href="#services"
            className="group relative w-full sm:w-auto text-center px-8 py-4 bg-white/5 border border-white/10 backdrop-blur-md text-white font-medium rounded-full overflow-hidden transition-all hover:bg-white/10 hover:border-[#B49A66]/40 md:hover:scale-105"
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
