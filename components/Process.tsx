
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useBackgroundVideo } from './useBackgroundVideo';

type Feature = {
  id: number;
  ref: string;       // drawing reference, e.g. "DRG-01/04"
  glyph: string;     // engineering glyph
  glyphLabel: string;// what the glyph means (subtle caption)
  stat: string;
  statSuffix: string;
  statLabel: string;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    id: 1,
    ref: "DRG-01 / 04",
    glyph: "▽",
    glyphLabel: "Surface Finish",
    stat: "24",
    statSuffix: "HR",
    statLabel: "Quote Turnaround",
    title: "Rapid Processing",
    description: "Fast turnaround times without sacrificing quality. We maintain your supply chain velocity.",
  },
  {
    id: 2,
    ref: "DRG-02 / 04",
    glyph: "±",
    glyphLabel: "Tolerance",
    stat: "100",
    statSuffix: "%",
    statLabel: "Inspection Rate",
    title: "Precision Focus",
    description: "Zero defects. Every edge is inspected to ensure compliance with your print specifications.",
  },
  {
    id: 3,
    ref: "DRG-03 / 04",
    glyph: "Ø",
    glyphLabel: "Diameter",
    stat: "1—50K",
    statSuffix: "",
    statLabel: "Volume Range",
    title: "Adaptive Solutions",
    description: "Tailored processes for unique specifications, material types, and production volumes.",
  },
  {
    id: 4,
    ref: "DRG-04 / 04",
    glyph: "⌖",
    glyphLabel: "True Position",
    stat: "45",
    statSuffix: "+",
    statLabel: "Industry Years",
    title: "Decades of Expertise",
    description: "Built on deep industry knowledge. We deliver verified results and reliable service.",
  },
];

const VIDEO_SRC = "/videos/process-bg.mp4";
const VIDEO_POSTER = "/videos/posters/process-bg.jpg";

const SpecCard: React.FC<{ feature: Feature; index: number }> = ({ feature, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="group relative h-full"
    >
      {/* Hairline frame — solid fill (no backdrop-blur: it sat over the moving
          video and forced a full re-blur every frame while scrolling) */}
      <div className="relative h-full p-7 md:p-8 bg-[#06080a]/90 border border-white/[0.09] group-hover:border-[#00FFBD]/40 transition-colors duration-500 overflow-hidden">

        {/* Drafting corner ticks */}
        <span aria-hidden className="absolute top-0 left-0 w-3 h-px bg-[#00FFBD]/50 group-hover:bg-[#00FFBD] transition-colors duration-500" />
        <span aria-hidden className="absolute top-0 left-0 w-px h-3 bg-[#00FFBD]/50 group-hover:bg-[#00FFBD] transition-colors duration-500" />
        <span aria-hidden className="absolute top-0 right-0 w-3 h-px bg-[#00FFBD]/50 group-hover:bg-[#00FFBD] transition-colors duration-500" />
        <span aria-hidden className="absolute top-0 right-0 w-px h-3 bg-[#00FFBD]/50 group-hover:bg-[#00FFBD] transition-colors duration-500" />
        <span aria-hidden className="absolute bottom-0 left-0 w-3 h-px bg-[#00FFBD]/50 group-hover:bg-[#00FFBD] transition-colors duration-500" />
        <span aria-hidden className="absolute bottom-0 left-0 w-px h-3 bg-[#00FFBD]/50 group-hover:bg-[#00FFBD] transition-colors duration-500" />
        <span aria-hidden className="absolute bottom-0 right-0 w-3 h-px bg-[#00FFBD]/50 group-hover:bg-[#00FFBD] transition-colors duration-500" />
        <span aria-hidden className="absolute bottom-0 right-0 w-px h-3 bg-[#00FFBD]/50 group-hover:bg-[#00FFBD] transition-colors duration-500" />

        {/* Faint registration grid behind content */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Top row: glyph + drawing ref */}
        <div className="flex items-start justify-between mb-8 relative">
          <div className="flex flex-col items-start">
            <span className="font-serif text-5xl md:text-6xl text-[#00FFBD] leading-none select-none" style={{ fontFeatureSettings: '"ss01"' }}>
              {feature.glyph}
            </span>
            <span className="mt-2 font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600">
              {feature.glyphLabel}
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">
            {feature.ref}
          </span>
        </div>

        {/* Stat block */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-[3.25rem] md:text-[3.75rem] font-black text-white tracking-tighter leading-none tabular-nums font-sans">
              {feature.stat}
            </span>
            <span className="text-2xl md:text-3xl font-bold text-[#00FFBD] tracking-tight">
              {feature.statSuffix}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="block w-6 h-px bg-[#00FFBD]/60 group-hover:w-12 transition-all duration-500" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
              {feature.statLabel}
            </span>
          </div>
        </div>

        {/* Title + description */}
        <div className="space-y-2.5">
          <h3 className="text-base font-bold text-white uppercase tracking-[0.15em] group-hover:text-[#00FFBD] transition-colors duration-300">
            {feature.title}
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed font-light group-hover:text-zinc-300 transition-colors">
            {feature.description}
          </p>
        </div>

        {/* Title-block divider line at very top — like a real drafting sheet */}
        <div className="absolute top-12 left-7 right-7 h-px bg-white/[0.06] group-hover:bg-[#00FFBD]/20 transition-colors duration-500 pointer-events-none" />
      </div>
    </motion.div>
  );
};

export const Process: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  useBackgroundVideo(videoRef, sectionRef, VIDEO_SRC);

  return (
    <section ref={sectionRef} id="process" className="relative min-h-screen py-32 md:py-40 bg-[#030305] overflow-hidden flex items-center justify-center scroll-mt-32">

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
        <div className="absolute inset-0 bg-[#030305]/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030305] via-[#030305]/40 to-[#030305]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(3,3,5,0.6)_70%,_#030305_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#00FFBD]/[0.04] via-transparent to-[#00FFBD]/[0.04] mix-blend-screen" />

        {/* Subtle tech grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />

        {/* Brand glow — pre-baked radial gradients (cheaper to composite than a
            140px GPU blur sitting over the moving video) */}
        <div
          className="absolute top-[20%] left-[-15%] w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,255,189,0.10) 0%, rgba(0,255,189,0.04) 35%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-[10%] right-[-15%] w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,255,189,0.08) 0%, rgba(0,255,189,0.03) 35%, transparent 70%)' }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">

        {/* Centered Header (no pill) */}
        <div className="max-w-4xl mx-auto text-center mb-20 md:mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] uppercase tracking-tight font-sans mb-6"
          >
            Precision and Reliability.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#9affde] to-[#00FFBD]">
              Every Single Part.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-lg md:text-xl text-zinc-300/90 font-light leading-relaxed max-w-2xl mx-auto"
          >
            From aerospace components to medical devices, we engineer the finish that defines performance.
          </motion.p>
        </div>

        {/* Engineering Spec Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 max-w-7xl mx-auto">
          {features.map((feature, idx) => (
            <SpecCard key={feature.id} feature={feature} index={idx} />
          ))}
        </div>
      </div>

      {/* Edge fade so cards transition smoothly into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030305] to-transparent pointer-events-none" />
    </section>
  );
};
