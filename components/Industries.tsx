
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView, MotionValue } from 'framer-motion';

const Dot: React.FC<{ index: number; active: MotionValue<number> }> = ({ index, active }) => {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const unsub = active.on('change', (v) => setOn(v >= index));
    return () => unsub();
  }, [active, index]);
  return (
    <motion.span
      className={`block h-1.5 rounded-full transition-all duration-300 ${on ? 'w-6 bg-[#00FFBD]' : 'w-1.5 bg-zinc-700'}`}
    />
  );
};

const industries = [
  {
    id: 1,
    title: "Aerospace & Defense",
    subtitle: "Flight Critical Precision",
    description: "Burr-free precision for flight-critical parts. Our work flies in fighter jets, drones, and satellites — finished to your print, dimensions held.",
    image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=2600&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Medical Devices",
    subtitle: "Surgical Perfection",
    description: "Surgical precision is non-negotiable. We deliver ultra-clean, burr-free edges on scalpels, implants, and diagnostic tools. FDA-ready, every part.",
    image: "https://carstens.com/cdn/shop/articles/image2_00b88acf-efe4-4f66-8fec-208f14d71bc8_1999x.jpg?v=1629425281"
  },
  {
    id: 3,
    title: "Automotive",
    subtitle: "Performance Engineering",
    description: "From supercars to daily drivers — performance, safety, and zero failures. Our deburring delivers smoother shifts, faster engines, and total reliability.",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2600&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Commercial Aviation",
    subtitle: "Global Reliability",
    description: "Every flight depends on perfect edges. We deburr engine blades and cabin hardware for top commercial fleets — FAA-grade, every time.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2600&auto=format&fit=crop"
  }
];

export const Industries: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const inView = useInView(targetRef, { margin: "0px 0px -10% 0px" });
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Map vertical scroll to horizontal scroll
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  // Animated dot indicator
  const activeDot = useTransform(scrollYProgress, (v) => Math.min(industries.length - 1, Math.floor(v * industries.length)));

  return (
    <section ref={targetRef} id="industries" className="relative h-[400vh] bg-[#030305]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">

        <motion.div style={{ x, willChange: inView ? 'transform' : 'auto' }} className="flex gap-6 md:gap-10 pl-6 md:pl-24 pr-24">

          {/* Intro Card */}
          <div className="flex-shrink-0 w-[80vw] md:w-[40vw] h-[60vh] md:h-[70vh] flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              <span className="block w-8 h-px bg-[#00FFBD]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#00FFBD]">
                ※ Industries
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tight leading-[0.9]">
              Industries <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#9affde] to-[#00FFBD]">We Power.</span>
            </h2>
            <p className="text-lg text-zinc-400 max-w-md font-light leading-relaxed">
              Scroll to explore how our precision finishing enables innovation across the most demanding sectors on Earth — and beyond.
            </p>

            {/* Active dots — sync to scroll */}
            <div className="mt-10 flex gap-2 items-center">
              {industries.map((_, i) => (
                <Dot key={i} index={i} active={activeDot} />
              ))}
            </div>
          </div>

          {/* Industry Cards */}
          {industries.map((industry, idx) => (
            <div
              key={industry.id}
              className="group relative h-[60vh] md:h-[70vh] w-[85vw] md:w-[60vw] flex-shrink-0 overflow-hidden bg-[#06080a] border border-white/[0.08] hover:border-[#00FFBD]/30 transition-colors duration-500"
            >
              {/* Drafting corner ticks */}
              <span aria-hidden className="absolute top-0 left-0 w-3 h-px bg-[#00FFBD]/50 z-30" />
              <span aria-hidden className="absolute top-0 left-0 w-px h-3 bg-[#00FFBD]/50 z-30" />
              <span aria-hidden className="absolute top-0 right-0 w-3 h-px bg-[#00FFBD]/50 z-30" />
              <span aria-hidden className="absolute top-0 right-0 w-px h-3 bg-[#00FFBD]/50 z-30" />
              <span aria-hidden className="absolute bottom-0 left-0 w-3 h-px bg-[#00FFBD]/50 z-30" />
              <span aria-hidden className="absolute bottom-0 left-0 w-px h-3 bg-[#00FFBD]/50 z-30" />
              <span aria-hidden className="absolute bottom-0 right-0 w-3 h-px bg-[#00FFBD]/50 z-30" />
              <span aria-hidden className="absolute bottom-0 right-0 w-px h-3 bg-[#00FFBD]/50 z-30" />

              <div className="absolute inset-0">
                <img
                  src={industry.image}
                  alt={industry.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale-[40%] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/50 to-transparent" />
                <div className="absolute inset-0 bg-[#030305]/15 group-hover:bg-[#030305]/0 transition-colors duration-700" />
              </div>

              {/* Drawing reference stamp — top-left, very small */}
              <div className="absolute top-4 left-4 z-20 font-mono text-[9px] uppercase tracking-[0.3em] text-[#00FFBD]/60">
                IND-{String(idx + 1).padStart(2, '0')} / {String(industries.length).padStart(2, '0')}
              </div>

              {/* Subtitle as small mono caption — no bubble */}
              <div className="absolute bottom-0 w-full p-8 md:p-12">
                <div className="flex items-center gap-2 mb-3">
                  <span className="block w-6 h-px bg-[#00FFBD]" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#00FFBD]">
                    {industry.subtitle}
                  </span>
                </div>
                <h3 className="mb-5 text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-[0.95]">
                  {industry.title}
                </h3>
                <p className="max-w-xl text-base md:text-lg text-zinc-200/95 leading-relaxed font-light">
                  {industry.description}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
