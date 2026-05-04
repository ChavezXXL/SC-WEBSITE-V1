
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const VIDEO_SRC = "/videos/hero-bg.mp4";
const CROSSFADE_SECONDS = 1.2;

export const Hero: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Dual-video seamless infinite loop
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

  const scrollToServices = (e: React.MouseEvent) => {
      e.preventDefault();
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full flex flex-col justify-center items-center bg-[#030305] overflow-hidden pt-20"
    >
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

        {/* Vignette + brand-tint overlay */}
        <div className="absolute inset-0 bg-[#030305]/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030305]/30 via-transparent to-[#030305]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(3,3,5,0.5)_75%,_#030305_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#00FFBD]/[0.03] via-transparent to-[#00FFBD]/[0.03] mix-blend-screen" />
      </div>

      <motion.div
        style={{ y: yText, opacity: opacityText }}
        className="relative z-20 container mx-auto px-6 text-center flex flex-col items-center"
      >
        {/* Cinematic Title Reveal */}
        <h1 className="text-5xl md:text-8xl lg:text-9xl font-bold tracking-tight text-white mb-6 relative font-space" style={{ textShadow: '0 4px 40px rgba(0,0,0,0.6)' }}>
          <div className="overflow-hidden">
            <motion.span
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              SC DEBURRING
            </motion.span>
          </div>
        </h1>

        <div className="overflow-hidden mb-12">
            <motion.p
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-2xl font-light tracking-[0.3em] text-zinc-200 uppercase"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}
            >
               Where Precision Meets Perfection
            </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
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
