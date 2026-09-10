import React, { useState, useEffect, useCallback, useRef } from 'react';
import { scrollToSection } from './scrollToSection';
import { motion, AnimatePresence } from 'framer-motion';

type FaqItem = {
  group: 'QUALITY' | 'CAPABILITIES' | 'LOGISTICS' | 'QUOTING';
  category: string;
  question: string;
  answer: string;
};

const faqs: FaqItem[] = [
  {
    group: 'CAPABILITIES',
    category: 'BASICS',
    question: 'What is deburring, and why does my part need it?',
    answer: "Deburring removes the sharp edges and raised material left by machining, stamping, or cutting. Burrs cause stress fractures, become FOD inside fluid systems, and ruin coatings. It's the final step that turns a machined part into one that's ready to fly.",
  },
  {
    group: 'CAPABILITIES',
    category: 'CAPABILITY',
    question: 'What kinds of parts do you specialize in?',
    answer: "Complex geometry — manifolds, valve bodies, hydraulic fittings, and anything with cross-drilled or intersecting bores. Built for parts where burrs hide inside and tolerances are tight. Aerospace and medical mainly.",
  },
  {
    group: 'CAPABILITIES',
    category: 'MATERIALS',
    question: 'What materials can you deburr?',
    answer: "Stainless, aluminum, titanium, Inconel, brass, copper, Invar, carbon steel — plus most plastics. We match the technique to the material so dimensions stay exact.",
  },
  {
    group: 'QUALITY',
    category: 'PRECISION',
    question: 'Can you hold tight tolerances on critical parts?',
    answer: "Yes. We remove the burr only. Surrounding edges stay exactly as drawn — we don't round what should stay sharp.",
  },
  {
    group: 'CAPABILITIES',
    category: 'COMPLEXITY',
    question: 'Can you handle cross-drilled holes and internal passages?',
    answer: "It's our specialty. Intersections where bores meet are where most shops miss burrs that turn into FOD. We use microscope inspection and the right tooling to clean every one.",
  },
  {
    group: 'LOGISTICS',
    category: 'VOLUME',
    question: 'Do you handle prototypes and production runs?',
    answer: "Both — one-off prototypes to thousands per batch. The process scales to match the volume.",
  },
  {
    group: 'LOGISTICS',
    category: 'LEAD TIME',
    question: "What's your typical turnaround?",
    answer: "Quotes back in 24 hours. Most jobs run 3–5 business days. Faster if your timeline calls for it.",
  },
  {
    group: 'QUALITY',
    category: 'QUALITY',
    question: 'How do you ensure quality?',
    answer: "Every part is inspected under magnification before pass-off, with documented sign-off on every batch — a repeatable, written quality process on every job.",
  },
  {
    group: 'LOGISTICS',
    category: 'LOGISTICS',
    question: 'Do you offer pickup and delivery?',
    answer: "Local pickup and delivery for regular customers in LA and the San Fernando Valley. Standard freight everywhere else — pickup arranged for larger jobs.",
  },
  {
    group: 'QUOTING',
    category: 'QUOTING',
    question: "What do you need to send a quote?",
    answer: "A drawing or photo, an approximate quantity, and any spec callouts. Quote back in 24 hours.",
  },
  {
    group: 'LOGISTICS',
    category: 'LOCATION',
    question: 'Where is SC Precision Deburring located?',
    answer: "Pacoima, California — 12734 Branford Street, Unit 17, in the San Fernando Valley. We serve all of Southern California: Los Angeles, Orange, Ventura, San Bernardino, Riverside, San Diego, and Kern counties.",
  },
  {
    group: 'QUALITY',
    category: 'CERTIFICATIONS',
    question: 'Are you ISO 9001 or AS9100 certified?',
    answer: "We're not currently ISO 9001 or AS9100 certified. We run a documented, repeatable quality process — every part inspected under magnification, with written sign-off on every batch. Many of our customers are themselves ISO/AS9100-certified shops that trust us with their deburring and finishing.",
  },
  {
    group: 'CAPABILITIES',
    category: 'TECHNIQUE',
    question: 'What is microscope deburring?',
    answer: "Deburring performed under magnification — typically 10x to 40x — for parts where burrs hide inside cross-drilled holes, internal passages, or tight features the naked eye can't catch. Standard for aerospace manifolds, valve bodies, and high-tolerance medical devices.",
  },
  {
    group: 'CAPABILITIES',
    category: 'INDUSTRIES',
    question: 'Do you work with aerospace, defense, and medical OEMs?',
    answer: "Our customers are precision machine shops, and what comes off their CNC machines goes into aerospace, defense, medical and industrial programs. We deburr to the print — the end market is our customer's to know. If it was machined, we can finish it. Much of our work ships into our customers' AS9100-controlled supply chains; we are not ourselves certified.",
  },
  {
    group: 'QUOTING',
    category: 'PRICING',
    question: 'How much does deburring cost?',
    answer: "Depends on part complexity, material, and quantity — but quotes come back in 24 hours, free, with no minimum order. Small simple batches start at a few dollars per part; complex aerospace work prices per print and spec callout.",
  },
];

/** Display order and headings for the four groups. */
const GROUP_ORDER = ['QUALITY', 'CAPABILITIES', 'LOGISTICS', 'QUOTING'] as const;
const GROUP_LABEL: Record<(typeof GROUP_ORDER)[number], string> = {
  QUALITY: 'Quality & Verification',
  CAPABILITIES: 'Capabilities',
  LOGISTICS: 'Volume, Lead Time & Logistics',
  QUOTING: 'Quoting',
};

/* ------------------------------------------------------------------ *
 * Modal — one question at a time, with prev/next so a buyer can read
 * straight through without closing and reopening.
 * ------------------------------------------------------------------ */
const FaqModal: React.FC<{
  index: number;
  onClose: () => void;
  onNav: (next: number) => void;
}> = ({ index, onClose, onNav }) => {
  const item = faqs[index];
  const closeRef = useRef<HTMLButtonElement>(null);

  const prev = useCallback(() => onNav((index - 1 + faqs.length) % faqs.length), [index, onNav]);
  const next = useCallback(() => onNav((index + 1) % faqs.length), [index, onNav]);

  // Esc closes; arrows page through.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, prev, next]);

  // Lock the page behind the dialog without letting the layout jump.
  useEffect(() => {
    const { overflow, paddingRight } = document.body.style;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="faq-modal-q"
        className="relative w-full max-w-2xl bg-[#06080a] border border-[#CCFF00]/25 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] rounded-2xl"
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.99 }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="absolute top-0 left-0 h-px w-16 bg-[#CCFF00]" aria-hidden="true" />

        <div className="px-7 md:px-12 pt-9 md:pt-11 pb-7">
          <div className="flex items-start justify-between gap-6 mb-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#CCFF00]">
              {item.category}
            </span>
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close"
              className="flex-shrink-0 -mt-1 w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-[#CCFF00] transition-colors duration-300 outline-none focus-visible:ring-1 focus-visible:ring-[#CCFF00]/60"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="14" y1="2" x2="2" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3
                id="faq-modal-q"
                className="text-white font-medium tracking-[-0.015em] leading-[1.15] mb-5"
                style={{ fontSize: 'clamp(1.35rem, 2.8vw, 1.95rem)' }}
              >
                {item.question}
              </h3>
              <p className="text-[15px] md:text-base text-zinc-300 leading-relaxed font-light">
                {item.answer}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between gap-4 px-7 md:px-12 py-5 border-t border-white/[0.07]">
          <button
            onClick={prev}
            className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-400 hover:text-[#CCFF00] transition-colors duration-300 outline-none focus-visible:ring-1 focus-visible:ring-[#CCFF00]/60"
          >
            ← Prev
          </button>
          <span className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 tabular-nums">
            {String(index + 1).padStart(2, '0')} / {String(faqs.length).padStart(2, '0')}
          </span>
          <button
            onClick={next}
            className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-400 hover:text-[#CCFF00] transition-colors duration-300 outline-none focus-visible:ring-1 focus-visible:ring-[#CCFF00]/60"
          >
            Next →
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ *
 * Group card — four quiet cards instead of fifteen tiles. Every question
 * still renders inside its card (so the visible text stays indexable),
 * but each one is a thin line that opens the dialog rather than a block
 * the buyer has to scroll past.
 * ------------------------------------------------------------------ */
const FaqGroupCard: React.FC<{
  label: string;
  items: { item: FaqItem; idx: number }[];
  onOpen: (idx: number) => void;
}> = ({ label, items, onOpen }) => (
  <div className="group relative bg-[#06080a] hover:bg-[#0a0e12] border border-white/[0.07] hover:border-[#CCFF00]/30 transition-[background-color,border-color] duration-500 ease-out p-6 md:p-7 rounded-2xl">

    <div className="flex items-baseline justify-between gap-4 mb-5">
      <h3 className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#CCFF00]">
        {label}
      </h3>
      <span className="font-mono text-[10px] tracking-[0.26em] text-zinc-500 tabular-nums">
        {String(items.length).padStart(2, '0')}
      </span>
    </div>

    <ul className="space-y-0.5">
      {items.map(({ item, idx }) => (
        <li key={idx}>
          <button
            onClick={() => onOpen(idx)}
            className="w-full text-left min-h-[44px] py-3 flex items-start gap-3 text-zinc-300 hover:text-white transition-colors duration-300 outline-none focus-visible:ring-1 focus-visible:ring-[#CCFF00]/60"
          >
            <span
              aria-hidden="true"
              className="mt-[11px] block w-3 h-px bg-zinc-600 flex-shrink-0 transition-all duration-300 group-hover:bg-[#CCFF00]/50"
            />
            <span className="text-[14px] leading-snug font-light">{item.question}</span>
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <>
      {/* FAQ JSON-LD lives in index.html — single source of truth, no duplicate schema.
          Answers here must stay in sync with that block. */}

      <section id="faq" className="relative py-20 md:py-28 bg-[#030305] border-t border-white/[0.05] scroll-mt-10">
        <div className="container mx-auto px-6 max-w-5xl">

          <div className="text-center mb-12 md:mb-16">
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="block w-8 h-px bg-[#CCFF00]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#CCFF00]">
                ※ Common Questions
              </span>
              <span className="block w-8 h-px bg-[#CCFF00]" />
            </div>

            <h2
              className="font-normal text-white tracking-[-0.015em] leading-[0.95] mb-4"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}
            >
              Frequently asked.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E4FF7A] to-[#CCFF00]">
                We've got answers.
              </span>
            </h2>
            <p className="text-sm md:text-base text-zinc-300 font-light leading-relaxed max-w-2xl mx-auto">
              Select a question — the answer opens here.
            </p>
          </div>

          {/* Four cards, not fifteen tiles. Every question is still in the DOM
              (indexable, and one click from an answer) but the section now
              occupies about a third of the height it used to. */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GROUP_ORDER.map((group) => {
              const items = faqs
                .map((item, idx) => ({ item, idx }))
                .filter(({ item }) => item.group === group);
              if (!items.length) return null;
              return (
                <FaqGroupCard
                  key={group}
                  label={GROUP_LABEL[group]}
                  items={items}
                  onOpen={(idx) => setOpenIdx(idx)}
                />
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-3">
              Didn't find your question?
            </p>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
              className="inline-flex items-center gap-2 text-[#CCFF00] font-mono text-xs uppercase tracking-[0.3em] hover:text-white transition-colors duration-300 group"
            >
              <span className="relative">
                Send Us A Message
                <span className="absolute -bottom-1 left-0 right-0 h-px bg-[#CCFF00] group-hover:bg-white transition-colors" />
              </span>
              <span className="text-base translate-y-[-1px]">→</span>
            </a>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {openIdx !== null && (
          <FaqModal
            index={openIdx}
            onClose={() => setOpenIdx(null)}
            onNav={(n) => setOpenIdx(n)}
          />
        )}
      </AnimatePresence>
    </>
  );
};
