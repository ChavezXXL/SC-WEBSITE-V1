
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type FaqItem = {
  category: string;
  question: string;
  answer: string;
};

const faqs: FaqItem[] = [
  {
    category: 'BASICS',
    question: 'What is deburring, and why does my part need it?',
    answer: "Deburring removes the sharp edges and raised material left by machining, stamping, or cutting. Burrs cause stress fractures, become FOD inside fluid systems, and ruin coatings. It's the final step that turns a machined part into one that's ready to fly.",
  },
  {
    category: 'CAPABILITY',
    question: 'What kinds of parts do you specialize in?',
    answer: "Complex geometry — manifolds, valve bodies, hydraulic fittings, and anything with cross-drilled or intersecting bores. Built for parts where burrs hide inside and tolerances are tight. Aerospace and medical mainly.",
  },
  {
    category: 'MATERIALS',
    question: 'What materials can you deburr?',
    answer: "Stainless, aluminum, titanium, Inconel, brass, copper, Invar, carbon steel — plus most plastics. We match the technique to the material so dimensions stay exact.",
  },
  {
    category: 'PRECISION',
    question: 'Can you hold tight tolerances on critical parts?',
    answer: "Yes. We remove the burr only. Surrounding edges stay exactly as drawn — we don't round what should stay sharp.",
  },
  {
    category: 'COMPLEXITY',
    question: 'Can you handle cross-drilled holes and internal passages?',
    answer: "It's our specialty. Intersections where bores meet are where most shops miss burrs that turn into FOD. We use microscope inspection and the right tooling to clean every one.",
  },
  {
    category: 'VOLUME',
    question: 'Do you handle prototypes and production runs?',
    answer: "Both — one-off prototypes to thousands per batch. The process scales to match the volume.",
  },
  {
    category: 'LEAD TIME',
    question: "What's your typical turnaround?",
    answer: "Quotes back in 24 hours. Most jobs run 3–5 business days. Faster if your timeline calls for it.",
  },
  {
    category: 'QUALITY',
    question: 'How do you ensure quality?',
    answer: "Every part is inspected under magnification before pass-off, with documented sign-off on every batch — a repeatable, written quality process on every job.",
  },
  {
    category: 'LOGISTICS',
    question: 'Do you offer pickup and delivery?',
    answer: "Local pickup and delivery for regular customers in LA and the San Fernando Valley. Standard freight everywhere else — pickup arranged for larger jobs.",
  },
  {
    category: 'QUOTING',
    question: "What do you need to send a quote?",
    answer: "A drawing or photo, an approximate quantity, and any spec callouts. Quote back in 24 hours.",
  },
  {
    category: 'LOCATION',
    question: 'Where is SC Precision Deburring located?',
    answer: "Pacoima, California — 12734 Branford Street, Unit 17, in the San Fernando Valley. We serve all of Southern California: Los Angeles, Orange, Ventura, San Bernardino, Riverside, San Diego, and Kern counties.",
  },
  {
    category: 'CERTIFICATIONS',
    question: 'Are you ISO 9001 or AS9100 certified?',
    answer: "We're not currently ISO 9001 or AS9100 certified. We run a documented, repeatable quality process — every part inspected under magnification, with written sign-off on every batch. Many of our customers are themselves ISO/AS9100-certified shops that trust us with their deburring and finishing.",
  },
  {
    category: 'TECHNIQUE',
    question: 'What is microscope deburring?',
    answer: "Deburring performed under magnification — typically 10x to 40x — for parts where burrs hide inside cross-drilled holes, internal passages, or tight features the naked eye can't catch. Standard for aerospace manifolds, valve bodies, and high-tolerance medical devices.",
  },
  {
    category: 'INDUSTRIES',
    question: 'Do you work with aerospace, defense, and medical OEMs?',
    answer: "Yes — that's the core of our business. We deburr parts for aerospace Tier 1 and Tier 2 suppliers, defense contractors, and medical device manufacturers across Southern California. Much of our work goes into AS9100-controlled supply chains.",
  },
  {
    category: 'PRICING',
    question: 'How much does deburring cost?',
    answer: "Depends on part complexity, material, and quantity — but quotes come back in 24 hours, free, with no minimum order. Small simple batches start at a few dollars per part; complex aerospace work prices per print and spec callout.",
  },
];

const FaqRow: React.FC<{ item: FaqItem; index: number; isOpen: boolean; onToggle: () => void }> = ({ item, index, isOpen, onToggle }) => (
  <div
    className={`group border-b border-white/[0.07] transition-colors duration-300 ${isOpen ? 'bg-[#00FFBD]/[0.03]' : 'hover:bg-white/[0.015]'}`}
  >
    <button
      onClick={onToggle}
      aria-expanded={isOpen}
      className="w-full text-left px-2 md:px-6 py-6 md:py-8 flex items-start justify-between gap-6 outline-none focus-visible:ring-1 focus-visible:ring-[#00FFBD]/60"
    >
      <div className="flex items-start gap-6 md:gap-10 flex-1 min-w-0">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 group-hover:text-[#00FFBD]/70 transition-colors w-12 md:w-16 flex-shrink-0 mt-1">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="flex-1 min-w-0">
          <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-[#00FFBD]/70 mb-2">
            {item.category}
          </span>
          <span className={`block text-lg md:text-2xl font-bold uppercase tracking-tight transition-colors ${isOpen ? 'text-[#00FFBD]' : 'text-white group-hover:text-[#00FFBD]'}`}>
            {item.question}
          </span>
        </div>
      </div>
      <div className={`flex-shrink-0 mt-1 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center transition-transform duration-500 ${isOpen ? 'rotate-45' : ''}`}>
        <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="16" stroke="#00FFBD" strokeWidth="1.5" className={isOpen ? 'opacity-100' : 'opacity-50'} />
          <line x1="18" y1="11" x2="18" y2="25" stroke="#00FFBD" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="11" y1="18" x2="25" y2="18" stroke="#00FFBD" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <div className="px-2 md:px-6 pb-8 pl-[calc(48px+1.5rem)] md:pl-[calc(64px+2.5rem)]">
            <p className="text-base md:text-lg text-zinc-300 leading-relaxed font-light max-w-3xl">
              {item.answer}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIdx(openIdx === i ? null : i);

  return (
    <>
      {/* FAQ JSON-LD lives in index.html — single source of truth, no duplicate schema */}

      {/* Inline FAQ — questions live right on the page, no popup to open/close */}
      <section id="faq" className="relative py-20 md:py-28 bg-[#030305] border-t border-white/[0.05] scroll-mt-24">
        <div className="container mx-auto px-6 max-w-4xl">

          <div className="text-center mb-12 md:mb-16">
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="block w-8 h-px bg-[#00FFBD]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#00FFBD]">
                ※ Got Questions?
              </span>
              <span className="block w-8 h-px bg-[#00FFBD]" />
            </div>

            <h2
              className="font-black text-white uppercase tracking-tight leading-[0.95] mb-4"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}
            >
              Frequently asked.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#9affde] to-[#00FFBD]">
                We've got answers.
              </span>
            </h2>
            <p className="text-sm md:text-base text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto">
              Click any question to expand it.
            </p>
          </div>

          {/* List */}
          <div className="bg-[#06080a] border border-white/[0.08]">
            {faqs.map((item, idx) => (
              <FaqRow
                key={idx}
                item={item}
                index={idx}
                isOpen={openIdx === idx}
                onToggle={() => toggle(idx)}
              />
            ))}

            {/* Footer CTA */}
            <div className="px-6 md:px-10 py-10 md:py-12 text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-3">
                Didn't find your question?
              </p>
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="inline-flex items-center gap-2 text-[#00FFBD] font-mono text-xs uppercase tracking-[0.3em] hover:text-white transition-colors duration-300 group"
              >
                <span className="relative">
                  Send Us A Message
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-[#00FFBD] group-hover:bg-white transition-colors" />
                </span>
                <span className="text-base translate-y-[-1px]">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
