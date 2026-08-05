
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
      className="relative min-h-stage w-full flex flex-col justify-center items-center bg-[#030305] overflow-hidden pt-20"
    >
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

        {/* Vignette + brand-tint overlay */}
        <div className="absolute inset-0 bg-[#030305]/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030305]/30 via-transparent to-[#030305]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(3,3,5,0.5)_75%,_#030305_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#00FFBD]/[0.03] via-transparent to-[#00FFBD]/[0.03] mix-blend-screen" />
      </div>

      <motion.div
        style={{
          y: shouldReduceMotion ? 0 : yText,
          opacity: shouldReduceMotion ? 1 : opacityText,
          willChange: inView && !shouldReduceMotion ? 'transform, opacity' : 'auto',
        }}
        className="relative z-20 container mx-auto px-6 text-center flex flex-col items-center"
      >
        {/* Cinematic Title Reveal — visual wordmark (the SEO h1 is the line below) */}
        <div className="text-5xl md:text-8xl lg:text-9xl font-bold tracking-tight text-white mb-6 relative font-space" style={{ textShadow: '0 4px 40px rgba(0,0,0,0.6)' }} aria-hidden>
          <div className="overflow-hidden">
            <motion.span
              initial={shouldReduceMotion ? false : { y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              SC DEBURRING
            </motion.span>
          </div>
        </div>

        <div className="overflow-hidden mb-12">
            <motion.h1
              initial={shouldReduceMotion ? false : { y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-base md:text-2xl font-light tracking-[0.25em] text-zinc-200 uppercase"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}
            >
               Precision Deburring for Aerospace &amp; Medical
            </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <a
            href="#contact"
            className="group px-8 py-4 bg-[#00FFBD] border border-[#00FFBD] text-black font-black rounded-full transition-all hover:bg-transparent hover:text-[#00FFBD] hover:scale-105 shadow-[0_0_40px_rgba(0,255,189,0.25)]"
            onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
          >
            <span className="text-sm uppercase tracking-widest flex items-center gap-2">
              Get a Free Quote
            </span>
          </a>
          <a
            href="#services"
            className="group relative px-8 py-4 bg-white/5 border border-white/10 backdrop-blur-md text-white font-medium rounded-full overflow-hidden transition-all hover:bg-white/10 hover:border-[#00FFBD]/40 hover:scale-105"
            onClick={scrollToServices}
          >
            <span className="relative z-10 text-sm uppercase tracking-widest flex items-center gap-2">
              Explore Services
            </span>
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-zinc-400 flex flex-col items-center gap-2 z-20"
      >
        <div className="h-12 w-[1px] bg-gradient-to-b from-transparent via-zinc-300 to-transparent"></div>
        <span className="text-[10px] uppercase tracking-[0.2em] opacity-80">Scroll</span>
      </motion.div>
    </section>
  );
};
