
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

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
    answer: "ISO 9001:2015 process. Every part inspected under magnification before pass-off, with documented sign-off on every batch.",
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
];

const FaqRow: React.FC<{ item: FaqItem; index: number; isOpen: boolean; onToggle: () => void }> = ({ item, index, isOpen, onToggle }) => (
  <div
    className={`group border-b border-white/[0.07] transition-colors duration-300 ${isOpen ? 'bg-[#00FFBD]/[0.03]' : 'hover:bg-white/[0.015]'}`}
  >
    <button
      onClick={onToggle}
      className="w-full text-left px-2 md:px-6 py-6 md:py-8 flex items-start justify-between gap-6 outline-none"
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

// FAQ Schema (JSON-LD) for Google rich-result eligibility
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
};

export const FAQ: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIdx(openIdx === i ? null : i);

  // Lock body scroll + ESC key while modal open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      {/* SEO: FAQ schema in DOM at all times for Google rich snippets */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Trigger band — sits where FAQ section used to live */}
      <section className="relative py-20 md:py-24 bg-[#030305] border-t border-white/[0.05]">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="block w-8 h-px bg-[#00FFBD]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#00FFBD]">
              ※ Got Questions?
            </span>
            <span className="block w-8 h-px bg-[#00FFBD]" />
          </div>

          <h2
            className="font-black text-white uppercase tracking-tight leading-[0.95] mb-8"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}
          >
            Frequently asked.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#9affde] to-[#00FFBD]">
              We've got answers.
            </span>
          </h2>

          <button
            onClick={() => setOpen(true)}
            className="group inline-flex items-center gap-3 px-8 md:px-10 py-4 bg-[#00FFBD] text-black font-black text-xs uppercase tracking-[0.25em] border border-[#00FFBD] hover:bg-transparent hover:text-[#00FFBD] transition-all duration-300 shadow-[0_0_30px_rgba(0,255,189,0.2)] hover:shadow-[0_0_50px_rgba(0,255,189,0.35)]"
          >
            View FAQ
            <span className="text-base leading-none translate-y-[-1px] group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[120] bg-[#030305]/95 backdrop-blur-2xl"
          >
            {/* Drafting tick corners */}
            <span aria-hidden className="hidden md:block absolute top-6 left-6 w-4 h-px bg-[#00FFBD] z-10" />
            <span aria-hidden className="hidden md:block absolute top-6 left-6 w-px h-4 bg-[#00FFBD] z-10" />
            <span aria-hidden className="hidden md:block absolute top-6 right-6 w-4 h-px bg-[#00FFBD] z-10" />
            <span aria-hidden className="hidden md:block absolute top-6 right-6 w-px h-4 bg-[#00FFBD] z-10" />
            <span aria-hidden className="hidden md:block absolute bottom-6 left-6 w-4 h-px bg-[#00FFBD] z-10" />
            <span aria-hidden className="hidden md:block absolute bottom-6 left-6 w-px h-4 bg-[#00FFBD] z-10" />
            <span aria-hidden className="hidden md:block absolute bottom-6 right-6 w-4 h-px bg-[#00FFBD] z-10" />
            <span aria-hidden className="hidden md:block absolute bottom-6 right-6 w-px h-4 bg-[#00FFBD] z-10" />

            {/* Persistent close button — top-right of viewport, always reachable */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Close FAQ"
              className="fixed top-4 right-4 md:top-5 md:right-5 z-[125] p-3 bg-[#06080a]/80 backdrop-blur-md border border-white/10 hover:border-[#00FFBD]/40 text-zinc-300 hover:text-[#00FFBD] transition-colors rounded-full"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>

            {/* Scrollable container with backdrop click-to-close. Backdrop & content live here. */}
            <div
              onClick={() => setOpen(false)}
              className="absolute inset-0 overflow-y-auto overscroll-contain flex items-start justify-center px-4 py-6 md:px-6 md:py-12"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <motion.div
                initial={{ scale: 0.97, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.97, y: 20, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-4xl bg-[#06080a] border border-white/[0.08] mb-12"
                onClick={(e) => e.stopPropagation()}
              >

              {/* Modal header */}
              <div className="px-6 md:px-10 pt-12 md:pt-14 pb-8 md:pb-10 border-b border-white/[0.07]">
                <div className="flex items-center gap-3 mb-5">
                  <span className="block w-8 h-px bg-[#00FFBD]" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#00FFBD]">
                    ※ Frequently Asked
                  </span>
                </div>
                <h3
                  className="font-black text-white uppercase tracking-tight leading-[0.95] mb-3"
                  style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
                >
                  Questions{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#9affde] to-[#00FFBD]">
                    answered.
                  </span>
                </h3>
                <p className="text-sm md:text-base text-zinc-400 font-light leading-relaxed max-w-2xl">
                  Click any to expand. If your question isn't here, send it our way — we'll get back within 24 hours.
                </p>
              </div>

              {/* List */}
              <div className="border-t border-white/[0.07]">
                {faqs.map((item, idx) => (
                  <FaqRow
                    key={idx}
                    item={item}
                    index={idx}
                    isOpen={openIdx === idx}
                    onToggle={() => toggle(idx)}
                  />
                ))}
              </div>

              {/* Footer CTA */}
              <div className="px-6 md:px-10 py-10 md:py-12 text-center border-t border-white/[0.07]">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-3">
                  Didn't find your question?
                </p>
                <a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); setOpen(false); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="inline-flex items-center gap-2 text-[#00FFBD] font-mono text-xs uppercase tracking-[0.3em] hover:text-white transition-colors duration-300 group"
                >
                  <span className="relative">
                    Send Us A Message
                    <span className="absolute -bottom-1 left-0 right-0 h-px bg-[#00FFBD] group-hover:bg-white transition-colors" />
                  </span>
                  <span className="text-base translate-y-[-1px]">→</span>
                </a>
              </div>
            </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
