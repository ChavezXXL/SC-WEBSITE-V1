
import React, { useRef, useState } from 'react';
import { Microscope, PenTool, Wind, Sparkles } from 'lucide-react';
import { ServiceItem } from '../types';
import { motion } from 'framer-motion';

const services: ServiceItem[] = [
  {
    id: 'microscope',
    title: 'Microscope Deburring',
    description: 'Deburring small, high-precision parts under the microscope. Perfect for aerospace, medical, or parts where details matter.',
    icon: <Microscope className="w-6 h-6 text-purple-300" />,
    image: 'https://cdn.pixabay.com/photo/2020/03/11/15/16/engineer-4922430_960_720.jpg'
  },
  {
    id: 'manual',
    title: 'Manual Deburring',
    description: 'Every edge finished by hand—tolerance-critical work with inspection-ready results. Edge break, chamfer, and blend.',
    icon: <PenTool className="w-6 h-6 text-orange-300" />,
    image: 'https://i.imgur.com/pxDy8Sg.jpg'
  },
  {
    id: 'blending',
    title: 'Blending',
    description: 'We blend and smooth surfaces so parts look and work like new. Seamless transitions, zero flaws.',
    icon: <Sparkles className="w-6 h-6 text-emerald-300" />,
    image: 'https://media.distributordatasolutions.com/xlsx_3M_synd/2023q2/images/medium/758d7ee4cdcac534d6fe44dd118911b3dea1e46b-medium.png'
  },
  {
    id: 'sandblasting',
    title: 'Sand Blasting',
    description: 'Clean, prep, and finish with blasting—get the right texture before coating or assembly.',
    icon: <Wind className="w-6 h-6 text-blue-300" />,
    image: 'https://surfaceprep.com/wp-content/uploads/2019/11/Coarse-Glass-Beads-1-e1635343561452.jpg'
  }
];

// Spotlight Card Component
const SpotlightCard: React.FC<{ service: ServiceItem; index: number }> = ({ service, index }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative bg-[#0f0f11] border border-white/5 overflow-hidden rounded-2xl flex flex-col h-full"
    >
      {/* Spotlight Gradient */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.1), transparent 40%)`,
        }}
      />
      
      {/* Image Area */}
      <div className="aspect-[16/9] w-full overflow-hidden relative border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f11] via-transparent to-transparent z-10 opacity-80" />
        <img 
          src={service.image} 
          alt={service.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2669&auto=format&fit=crop";
          }}
        />
        <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono font-bold text-white/80">
          0{index + 1}
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-8 relative z-20 flex-1 flex flex-col">
        <div className="flex items-center gap-4 mb-5">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-white group-hover:text-blue-300 transition-colors shadow-lg">
                {service.icon}
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors font-space tracking-wide">{service.title}</h3>
        </div>
        
        <p className="text-zinc-400 leading-relaxed font-light group-hover:text-zinc-300 transition-colors">
          {service.description}
        </p>
      </div>
    </motion.div>
  );
};

export const Services: React.FC = () => {
  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="py-32 bg-[#050505] relative z-10">
      <div className="container mx-auto px-6">
        <div className="mb-24 md:flex md:items-end md:justify-between border-b border-white/5 pb-12">
          <div className="max-w-3xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight font-space"
            >
              Services We Offer
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-zinc-400 text-lg md:text-xl font-light max-w-2xl"
            >
              From microscopic precision to mass batch processing. We execute the details that others overlook.
            </motion.p>
          </div>
          <div className="mt-8 md:mt-0">
            <a 
                href="#contact" 
                onClick={scrollToContact}
                className="inline-flex items-center gap-2 group text-white border-b border-white/20 pb-1 hover:border-white transition-all duration-300 font-medium cursor-pointer"
            >
              Request Custom Quote
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <SpotlightCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
