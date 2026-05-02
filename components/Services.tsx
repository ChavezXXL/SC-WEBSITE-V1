
import React, { useEffect, useRef, useState } from 'react';
import { Microscope, PenTool, Wind, Sparkles, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const VIDEO_SRC = "/videos/services-bg.mp4";
const CROSSFADE_SECONDS = 1.2;

type Service = {
  id: string;
  ref: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
};

const services: Service[] = [
  {
    id: 'microscope',
    ref: 'SVC-01 / 04',
    title: 'Microscope Deburring',
    description: 'Deburring small, high-precision parts under the microscope. Perfect for aerospace, medical, or parts where details matter.',
    icon: <Microscope className="w-5 h-5 text-[#00FFBD]" strokeWidth={1.75} />,
    image: 'https://cdn.pixabay.com/photo/2020/03/11/15/16/engineer-4922430_960_720.jpg',
  },
  {
    id: 'manual',
    ref: 'SVC-02 / 04',
    title: 'Manual Deburring',
    description: 'Every edge finished by hand—tolerance-critical work with inspection-ready results. Edge break, chamfer, and blend.',
    icon: <PenTool className="w-5 h-5 text-[#00FFBD]" strokeWidth={1.75} />,
    image: 'https://i.imgur.com/pxDy8Sg.jpg',
  },
  {
    id: 'blending',
    ref: 'SVC-03 / 04',
    title: 'Blending',
    description: 'We blend and smooth surfaces so parts look and work like new. Seamless transitions, zero flaws.',
    icon: <Sparkles className="w-5 h-5 text-[#00FFBD]" strokeWidth={1.75} />,
    image: 'https://media.distributordatasolutions.com/xlsx_3M_synd/2023q2/images/medium/758d7ee4cdcac534d6fe44dd118911b3dea1e46b-medium.png',
  },
  {
    id: 'sandblasting',
    ref: 'SVC-04 / 04',
    title: 'Sand Blasting',
    description: 'Clean, prep, and finish with blasting—get the right texture before coating or assembly.',
    icon: <Wind className="w-5 h-5 text-[#00FFBD]" strokeWidth={1.75} />,
    image: 'https://surfaceprep.com/wp-content/uploads/2019/11/Coarse-Glass-Beads-1-e1635343561452.jpg',
  },
];

const ServiceCard: React.FC<{ service: Service; index: number }> = ({ service, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="group relative h-full"
    >
      <div className="relative h-full bg-[#06080a]/65 backdrop-blur-2xl border border-white/[0.09] group-hover:border-[#00FFBD]/40 transition-colors duration-500 overflow-hidden flex flex-col">

        {/* Drafting corner ticks */}
        <span aria-hidden className="absolute top-0 left-0 w-3 h-px bg-[#00FFBD]/50 group-hover:bg-[#00FFBD] transition-colors duration-500 z-30" />
        <span aria-hidden className="absolute top-0 left-0 w-px h-3 bg-[#00FFBD]/50 group-hover:bg-[#00FFBD] transition-colors duration-500 z-30" />
        <span aria-hidden className="absolute top-0 right-0 w-3 h-px bg-[#00FFBD]/50 group-hover:bg-[#00FFBD] transition-colors duration-500 z-30" />
        <span aria-hidden className="absolute top-0 right-0 w-px h-3 bg-[#00FFBD]/50 group-hover:bg-[#00FFBD] transition-colors duration-500 z-30" />
        <span aria-hidden className="absolute bottom-0 left-0 w-3 h-px bg-[#00FFBD]/50 group-hover:bg-[#00FFBD] transition-colors duration-500 z-30" />
        <span aria-hidden className="absolute bottom-0 left-0 w-px h-3 bg-[#00FFBD]/50 group-hover:bg-[#00FFBD] transition-colors duration-500 z-30" />
        <span aria-hidden className="absolute bottom-0 right-0 w-3 h-px bg-[#00FFBD]/50 group-hover:bg-[#00FFBD] transition-colors duration-500 z-30" />
        <span aria-hidden className="absolute bottom-0 right-0 w-px h-3 bg-[#00FFBD]/50 group-hover:bg-[#00FFBD] transition-colors duration-500 z-30" />

        {/* Image area */}
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-white/[0.06]">
          {/* Mint duotone tint that strengthens on hover */}
          <div className="absolute inset-0 bg-[#00FFBD]/0 group-hover:bg-[#00FFBD]/15 mix-blend-color transition-all duration-700 z-10 pointer-events-none" />
          {/* Bottom fade into card */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#06080a] via-transparent to-transparent z-10 pointer-events-none" />
          {/* Top scanline overlay (subtle) */}
          <div
            className="absolute inset-0 z-10 pointer-events-none opacity-20 mix-blend-overlay"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 3px)`,
            }}
          />
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105 grayscale-[35%] group-hover:grayscale-0"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2669&auto=format&fit=crop";
            }}
          />

          {/* Drawing ref stamp */}
          <div className="absolute top-4 left-4 z-20 px-2.5 py-1 bg-[#030305]/85 backdrop-blur-md border border-[#00FFBD]/30">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#00FFBD]">
              {service.ref}
            </span>
          </div>

          {/* Icon chip */}
          <div className="absolute bottom-4 left-4 z-20 p-2.5 bg-[#030305]/85 backdrop-blur-md border border-white/10 group-hover:border-[#00FFBD]/40 transition-colors duration-500">
            {service.icon}
          </div>
        </div>

        {/* Content area */}
        <div className="relative p-7 flex-1 flex flex-col">
          {/* Faint registration grid behind */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none opacity-[0.025]"
            style={{
              backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
            }}
          />

          <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-[0.12em] group-hover:text-[#00FFBD] transition-colors duration-300 relative">
            {service.title}
          </h3>

          <div className="flex items-center gap-2 mb-5 relative">
            <span className="block w-6 h-px bg-[#00FFBD]/60 group-hover:w-12 transition-all duration-500" />
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600">
              Specification
            </span>
          </div>

          <p className="text-sm text-zinc-400 leading-relaxed font-light mb-8 group-hover:text-zinc-300 transition-colors relative">
            {service.description}
          </p>

          {/* Inquire link */}
          <div className="mt-auto pt-5 border-t border-white/[0.06] group-hover:border-[#00FFBD]/20 transition-colors duration-500 relative">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-between w-full text-zinc-400 group-hover:text-[#00FFBD] transition-colors duration-300"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.25em]">
                Inquire about this service
              </span>
              <ArrowUpRight className="w-4 h-4 transform transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Services: React.FC = () => {
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

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="py-32 md:py-40 bg-[#050505] relative z-10 scroll-mt-32 overflow-hidden">

      {/* Video Background — dual elements crossfade for seamless infinite loop */}
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

        {/* Vignette + brand-tint overlay (lighter — let the video breathe) */}
        <div className="absolute inset-0 bg-[#050505]/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(5,5,5,0.4)_70%,_#050505_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#00FFBD]/[0.04] via-transparent to-[#00FFBD]/[0.04] mix-blend-screen" />

        {/* Subtle tech grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Brand glow */}
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-[#00FFBD]/8 blur-[140px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-[#00FFBD]/8 blur-[140px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="mb-20 md:flex md:items-end md:justify-between border-b border-white/[0.08] pb-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#00FFBD] mb-5"
            >
              ※ 04 Capabilities
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight uppercase leading-[0.95]"
            >
              Services <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#9affde] to-[#00FFBD]">We Offer</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-zinc-400 text-lg md:text-xl font-light max-w-2xl"
            >
              From microscopic precision to mass batch processing. We execute the details that others overlook.
            </motion.p>
          </div>
          <div className="mt-10 md:mt-0">
            <a
              href="#contact"
              onClick={scrollToContact}
              className="inline-flex items-center gap-2 group/cta text-white font-mono text-xs uppercase tracking-[0.25em] cursor-pointer"
            >
              <span className="relative">
                Request Custom Quote
                <span className="absolute -bottom-1 left-0 right-0 h-px bg-[#00FFBD] scale-x-0 group-hover/cta:scale-x-100 origin-left transition-transform duration-500" />
              </span>
              <ArrowUpRight className="w-4 h-4 text-[#00FFBD] group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 transition-transform duration-500" />
            </a>
          </div>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
