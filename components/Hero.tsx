
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView, useReducedMotion } from 'framer-motion';
import { Phone, ArrowRight } from 'lucide-react';
import { useBackgroundVideo } from './useBackgroundVideo';
import { trackPhoneClick } from '../services/analytics';

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

  const scrollToContact = (e: React.MouseEvent) => {
      e.preventDefault();
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full flex flex-col justify-center items-center bg-[#030305] overflow-hidden pt-20"
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
        {/* Brand kicker */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <span className="block w-8 h-px bg-[#00FFBD]" />
          <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-[#00FFBD]">
            SC Precision Deburring — Pacoima, CA
          </span>
          <span className="block w-8 h-px bg-[#00FFBD]" />
        </motion.div>

        {/* Cinematic Title Reveal */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 relative font-space" style={{ textShadow: '0 4px 40px rgba(0,0,0,0.6)' }}>
          <div className="overflow-hidden">
            <motion.span
              initial={shouldReduceMotion ? false : { y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              Deburring
            </motion.span>
          </div>
          <div className="overflow-hidden">
            <motion.span
              initial={shouldReduceMotion ? false : { y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-[#9affde] to-[#00FFBD] pb-2"
            >
              off your plate.
            </motion.span>
          </div>
        </h1>

        <div className="overflow-hidden mb-10">
            <motion.p
              initial={shouldReduceMotion ? false : { y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-2xl font-light text-zinc-200 leading-relaxed max-w-2xl mx-auto"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}
            >
               We take the deburring and finishing your bench can't get to — done right and back fast, anywhere in SoCal.
            </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <a
            href="tel:+18183894234"
            onClick={() => trackPhoneClick()}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-[#00FFBD] text-black font-black text-sm uppercase tracking-[0.15em] border border-[#00FFBD] hover:bg-transparent hover:text-[#00FFBD] transition-all duration-300 shadow-[0_0_40px_rgba(0,255,189,0.25)] hover:shadow-[0_0_60px_rgba(0,255,189,0.45)]"
          >
            <Phone className="w-4 h-4" strokeWidth={2.5} />
            Call Santiago — (818) 389-4234
          </a>
          <a
            href="#contact"
            onClick={scrollToContact}
            className="group relative px-8 py-4 bg-white/5 border border-white/15 backdrop-blur-md text-white font-medium overflow-hidden transition-all hover:bg-white/10 hover:border-[#00FFBD]/40"
          >
            <span className="relative z-10 text-sm uppercase tracking-[0.15em] flex items-center gap-2">
              Send a batch
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </a>
        </motion.div>

        {/* Speed strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-zinc-300"
        >
          <span>Same-day quotes</span>
          <span className="text-[#00FFBD]">·</span>
          <span>Fast turnaround</span>
          <span className="text-[#00FFBD]">·</span>
          <span>We pick up and deliver</span>
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
