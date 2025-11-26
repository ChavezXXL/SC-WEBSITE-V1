
import React, { useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

export const Hero: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const springY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  const moveX = useTransform(springX, [-0.5, 0.5], ["-10%", "10%"]);
  const moveY = useTransform(springY, [-0.5, 0.5], ["-10%", "10%"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth) - 0.5);
    mouseY.set((clientY / innerHeight) - 0.5);
  };

  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const scrollToServices = (e: React.MouseEvent) => {
      e.preventDefault();
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      ref={ref} 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex flex-col justify-center items-center bg-[#050505] overflow-hidden pt-20"
    >
      {/* Premium Aurora Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
            style={{ x: moveX, y: moveY }}
            className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-blue-900/10 blur-[100px] mix-blend-screen opacity-60" 
        />
        <div className="absolute top-[20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-900/10 blur-[120px] mix-blend-screen opacity-50" />
        <div className="absolute bottom-[-20%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-teal-900/10 blur-[100px] mix-blend-screen opacity-40" />
        
        {/* Subtle Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`, 
            backgroundSize: '100px 100px' 
          }}
        />
      </div>

      <motion.div 
        style={{ y: yText, opacity: opacityText }}
        className="relative z-20 container mx-auto px-6 text-center flex flex-col items-center"
      >
        {/* Cinematic Title Reveal */}
        <h1 className="text-5xl md:text-8xl lg:text-9xl font-bold tracking-tight text-white mb-6 relative font-space">
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
              className="text-lg md:text-2xl font-light tracking-[0.3em] text-zinc-400 uppercase"
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
            className="group relative px-8 py-4 bg-white/5 border border-white/10 backdrop-blur-sm text-white font-medium rounded-full overflow-hidden transition-all hover:bg-white/10 hover:border-white/20 hover:scale-105"
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
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-zinc-600 flex flex-col items-center gap-2"
      >
        <div className="h-12 w-[1px] bg-gradient-to-b from-transparent via-zinc-500 to-transparent"></div>
        <span className="text-[10px] uppercase tracking-[0.2em] opacity-70">Scroll</span>
      </motion.div>
    </section>
  );
};
