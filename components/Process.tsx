
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, Layers, Users } from 'lucide-react';

const features = [
  {
    id: 1,
    title: "Rapid Processing",
    description: "Fast turnaround times without sacrificing quality. We maintain your supply chain velocity.",
    icon: <Zap className="w-8 h-8 text-[#00FFBD]" />
  },
  {
    id: 2,
    title: "Precision Focus",
    description: "Zero defects. Every edge is inspected to ensure compliance with your print specifications.",
    icon: <Target className="w-8 h-8 text-[#00FFBD]" />
  },
  {
    id: 3,
    title: "Adaptive Solutions",
    description: "Tailored processes for unique specifications, material types, and production volumes.",
    icon: <Layers className="w-8 h-8 text-[#00FFBD]" />
  },
  {
    id: 4,
    title: "Decades of Expertise",
    description: "Built on deep industry knowledge. We deliver verified results and reliable service.",
    icon: <Users className="w-8 h-8 text-[#00FFBD]" />
  }
];

export const Process: React.FC = () => {
  return (
    <section id="process" className="relative min-h-screen py-24 bg-[#030305] overflow-hidden flex items-center justify-center">

      {/* Background Tech Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Background Glow */}
      <div className="absolute top-[30%] left-[-10%] w-[600px] h-[600px] bg-[#00FFBD]/10 blur-[120px] rounded-full animate-pulse opacity-40 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Column: Text Content */}
          <div className="flex flex-col justify-center text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <div className="w-2 h-2 rounded-full bg-[#00FFBD] animate-pulse"></div>
              <span className="text-[#00FFBD] font-mono text-xs tracking-widest uppercase">Process Capability</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight uppercase tracking-tight font-sans"
            >
              Precision and Reliability.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00FFBD]">
                Every Single Part.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-xl text-zinc-300 font-light mb-10 max-w-lg leading-relaxed"
            >
              From aerospace components to medical devices, we engineer the finish that defines performance.
            </motion.p>

            <div className="space-y-8 border-l border-zinc-800 pl-8 relative">
              <div className="absolute left-0 top-0 w-[1px] h-16 bg-gradient-to-b from-[#00FFBD] to-transparent"></div>

              {[
                { label: "Expert Craftsmanship", text: "Synergizing advanced tooling with skilled hands to achieve finishes machines cannot duplicate." },
                { label: "Quality Assurance", text: "From prototype to full-scale production, every part undergoes rigorous inspection." },
                { label: "Mission-Critical", text: "When failure is not an option, we are the final step in ensuring operational integrity." }
              ].map((point, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + (idx * 0.1) }}
                  className="group"
                >
                  <span className="block text-white font-bold text-lg uppercase mb-1 group-hover:text-[#00FFBD] transition-colors">{point.label}</span>
                  <p className="text-zinc-500 text-base leading-relaxed group-hover:text-zinc-400 transition-colors">{point.text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
            {/* Decorative Corner */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-bl from-[#00FFBD]/20 to-transparent rounded-bl-3xl blur-2xl pointer-events-none"></div>

            {features.map((feature, idx) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#0a0a0c] border border-zinc-800/50 hover:border-[#00FFBD]/50 p-8 rounded-xl hover:bg-zinc-900 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,189,0.1)] group"
              >
                <div className="mb-6 p-3 bg-zinc-900 w-fit rounded-lg group-hover:bg-[#00FFBD]/10 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wide group-hover:text-[#00FFBD] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-zinc-500 leading-relaxed text-sm font-medium">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
