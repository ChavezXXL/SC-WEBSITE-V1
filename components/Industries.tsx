
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const industries = [
  {
    id: 1,
    title: "Aerospace & Defense",
    subtitle: "Flight Critical Precision",
    description: "Burr-free precision for flight-critical parts. Our work flies in fighter jets, drones, and satellites—meeting the strictest MIL-STD and ITAR specs.",
    image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=2600&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Medical Devices",
    subtitle: "Surgical Perfection",
    description: "Surgical precision is non-negotiable. We deliver ultra-clean, burr-free edges on scalpels, implants, and diagnostic tools. FDA-ready, every part.",
    // Updated Image URL as requested
    image: "https://carstens.com/cdn/shop/articles/image2_00b88acf-efe4-4f66-8fec-208f14d71bc8_1999x.jpg?v=1629425281"
  },
  {
    id: 3,
    title: "Automotive",
    subtitle: "Performance Engineering",
    description: "From supercars to daily drivers—performance, safety, and zero failures. Our deburring gives you smoother shifts, faster engines, and total reliability.",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2600&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Commercial Aviation",
    subtitle: "Global Reliability",
    description: "Every flight depends on perfect edges. We deburr engine blades and cabin hardware for top commercial fleets—FAA safety, every time.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2600&auto=format&fit=crop"
  }
];

export const Industries: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Map vertical scroll to horizontal scroll
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section ref={targetRef} id="industries" className="relative h-[400vh] bg-zinc-900">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        
        {/* Intro Card */}
        <motion.div style={{ x }} className="flex gap-10 pl-6 md:pl-24 pr-24">
          
          <div className="flex-shrink-0 w-[80vw] md:w-[40vw] h-[60vh] md:h-[70vh] flex flex-col justify-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Industries <br/>
              <span className="text-teal-400">We Power</span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-md">
              Scroll to explore how our precision finishing enables innovation across the most demanding sectors on Earth and beyond.
            </p>
            <div className="mt-8 flex gap-2">
               <div className="h-3 w-3 rounded-full bg-teal-400"></div>
               <div className="h-3 w-3 rounded-full bg-zinc-700"></div>
               <div className="h-3 w-3 rounded-full bg-zinc-700"></div>
               <div className="h-3 w-3 rounded-full bg-zinc-700"></div>
            </div>
          </div>

          {/* Industry Cards */}
          {industries.map((industry) => (
            <div key={industry.id} className="group relative h-[60vh] md:h-[70vh] w-[85vw] md:w-[60vw] flex-shrink-0 overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-800">
              <div className="absolute inset-0">
                <img 
                  src={industry.image} 
                  alt={industry.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
              </div>
              
              <div className="absolute bottom-0 w-full p-8 md:p-12">
                <div className="mb-4 inline-block rounded-full bg-teal-500/20 px-4 py-1.5 backdrop-blur-md border border-teal-500/30">
                  <span className="text-sm font-semibold text-teal-300 uppercase tracking-wider">{industry.subtitle}</span>
                </div>
                <h3 className="mb-4 text-4xl md:text-5xl font-bold text-white">{industry.title}</h3>
                <p className="max-w-xl text-lg text-zinc-300/90 leading-relaxed backdrop-blur-sm bg-zinc-950/30 p-4 rounded-xl border border-white/5">
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
