import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useFocusTrap } from './useFocusTrap';
import { scrollToSection } from './scrollToSection';
import { motion, AnimatePresence } from 'framer-motion';
import { faqs } from './faqData';

type FaqItem = {
  group: 'QUALITY' | 'CAPABILITIES' | 'LOGISTICS' | 'QUOTING';
  category: string;
  question: string;
  answer: string;
};

type GroupKey = (typeof GROUP_ORDER)[number];

/** Display order, headings and a one-line description for each group. */
const GROUP_ORDER = ['QUALITY', 'CAPABILITIES', 'LOGISTICS', 'QUOTING'] as const;
const GROUP_LABEL: Record<GroupKey, string> = {
  QUALITY: 'Quality & Verification',
  CAPABILITIES: 'Capabilities',
  LOGISTICS: 'Volume, Lead Time & Logistics',
  QUOTING: 'Quoting',
};
const GROUP_BLURB: Record<GroupKey, string> = {
  QUALITY: 'How we inspect, what gets signed off, and where we stand on certification.',
  CAPABILITIES: 'What we deburr, which materials we work in, and the features we specialise in.',
  LOGISTICS: 'Lot sizes, turnaround, pickup and delivery, and where to find us.',
  QUOTING: 'What to send, and how pricing works.',
};

/* ------------------------------------------------------------------ *
 * Two-step dialog.
 *
 * Step 1 — a group card opens to its own list of questions.
 * Step 2 — picking one swaps the panel to the answer, with a way back.
 *
 * Previously every question was printed inside the card on the section
 * itself, which made four cards carry fifteen lines of small text and
 * left nothing for the card to do when clicked. Moving the list into the
 * dialog lets the cards be large and legible and gives the click a job.
 * ------------------------------------------------------------------ */
const FaqDialog: React.FC<{
  group: GroupKey;
  items: { item: FaqItem; idx: number }[];
  onClose: () => void;
}> = ({ group, items, onClose }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, true, onClose);

  const current = openIdx === null ? null : faqs[openIdx];
  const pos = openIdx === null ? -1 : items.findIndex((x) => x.idx === openIdx);

  const step = useCallback(
    (dir: number) => {
      if (pos < 0) return;
      setOpenIdx(items[(pos + dir + items.length) % items.length].idx);
    },
    [pos, items],
  );

  // Esc closes; while an answer is open, arrows move within this group.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { if (openIdx !== null) setOpenIdx(null); else onClose(); }
      else if (openIdx !== null && e.key === 'ArrowLeft') step(-1);
      else if (openIdx !== null && e.key === 'ArrowRight') step(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openIdx, onClose, step]);

  // Lock the page behind the dialog without letting the layout jump.
  useEffect(() => {
    const { overflow, paddingRight } = document.body.style;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
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
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} aria-hidden="true" />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={GROUP_LABEL[group]}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#06080a] border border-[#CCFF00]/25 rounded-2xl shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.99 }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="sticky top-0 bg-[#06080a] flex items-start justify-between gap-6 px-7 md:px-10 pt-8 pb-5 border-b border-white/[0.07]">
          <div>
            <span className="block font-mono text-[10px] uppercase tracking-[0.32em] text-[#CCFF00]">
              {GROUP_LABEL[group]}
            </span>
            <span className="mt-1.5 block text-[13px] font-light text-zinc-500">
              {openIdx === null
                ? `${items.length} question${items.length === 1 ? '' : 's'}`
                : `${pos + 1} of ${items.length}`}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-zinc-500 hover:text-[#CCFF00] hover:bg-white/[0.04] transition-colors duration-300 outline-none focus-visible:ring-1 focus-visible:ring-[#CCFF00]/60"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <line x1="14" y1="2" x2="2" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {openIdx === null ? (
            /* ── step 1: the questions in this group ── */
            <motion.ul
              key="list"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="m-0 list-none p-3 md:p-4"
            >
              {items.map(({ item, idx }, n) => (
                <li key={idx}>
                  <button
                    onClick={() => setOpenIdx(idx)}
                    className="group w-full text-left flex items-center gap-4 px-4 md:px-6 py-5 rounded-xl hover:bg-white/[0.035] transition-colors duration-300 outline-none focus-visible:ring-1 focus-visible:ring-[#CCFF00]/60"
                  >
                    <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-600 tabular-nums flex-shrink-0">
                      {String(n + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 text-[15px] md:text-[17px] font-light text-zinc-200 group-hover:text-white leading-snug transition-colors">
                      {item.question}
                    </span>
                    <span aria-hidden="true" className="text-zinc-600 group-hover:text-[#CCFF00] transition-colors flex-shrink-0">→</span>
                  </button>
                </li>
              ))}
            </motion.ul>
          ) : (
            /* ── step 2: the answer ── */
            <motion.div
              key={`a-${openIdx}`}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="px-7 md:px-10 py-8"
            >
              <button
                onClick={() => setOpenIdx(null)}
                className="inline-flex items-center gap-2 mb-6 min-h-[36px] font-mono text-[10px] uppercase tracking-[0.26em] text-zinc-500 hover:text-[#CCFF00] transition-colors duration-300 outline-none focus-visible:ring-1 focus-visible:ring-[#CCFF00]/60"
              >
                ← All {GROUP_LABEL[group].toLowerCase()} questions
              </button>

              <h3 className="text-white font-normal tracking-[-0.01em] leading-[1.2] mb-5" style={{ fontSize: 'clamp(1.3rem, 2.6vw, 1.85rem)' }}>
                {current!.question}
              </h3>
              <p className="text-[15px] md:text-[17px] text-zinc-300 leading-relaxed font-light">
                {current!.answer}
              </p>

              {items.length > 1 && (
                <div className="flex items-center justify-between gap-4 mt-9 pt-6 border-t border-white/[0.07]">
                  <button
                    onClick={() => step(-1)}
                    className="font-mono text-[10px] uppercase tracking-[0.26em] text-zinc-500 hover:text-[#CCFF00] transition-colors duration-300 outline-none focus-visible:ring-1 focus-visible:ring-[#CCFF00]/60"
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={() => step(1)}
                    className="font-mono text-[10px] uppercase tracking-[0.26em] text-zinc-500 hover:text-[#CCFF00] transition-colors duration-300 outline-none focus-visible:ring-1 focus-visible:ring-[#CCFF00]/60"
                  >
                    Next →
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ *
 * Group card — now a real button. Large, with a description and the
 * question count, rather than a container printing fifteen small lines.
 * ------------------------------------------------------------------ */
const FaqGroupCard: React.FC<{
  group: GroupKey; count: number; onOpen: () => void; delay: number;
}> = ({ group, count, onOpen, delay }) => (
  <motion.button
    type="button"
    onClick={onOpen}
    initial={{ opacity: 0, y: 20, scale: 0.98 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ type: 'spring', stiffness: 230, damping: 27, mass: 0.9, delay }}
    className="group relative text-left bg-[#06080a] hover:bg-[#0a0e12] border border-white/[0.07] hover:border-[#CCFF00]/30 transition-[background-color,border-color] duration-500 ease-out rounded-2xl p-8 md:p-10 min-h-[220px] md:min-h-[260px] flex flex-col justify-between outline-none focus-visible:ring-1 focus-visible:ring-[#CCFF00]/60"
  >
    <div>
      <div className="flex items-baseline justify-between gap-4 mb-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#CCFF00]">
          {GROUP_LABEL[group]}
        </span>
        <span className="font-mono text-[10px] tracking-[0.24em] text-zinc-600 tabular-nums flex-shrink-0">
          {String(count).padStart(2, '0')}
        </span>
      </div>
      <p className="text-[16px] md:text-[19px] font-light text-zinc-200 leading-snug max-w-sm">
        {GROUP_BLURB[group]}
      </p>
    </div>

    <span className="mt-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500 group-hover:text-[#CCFF00] transition-colors duration-300">
      {count} question{count === 1 ? '' : 's'}
      <span aria-hidden="true" className="text-sm translate-y-[-1px] group-hover:translate-x-1 transition-transform duration-300">→</span>
    </span>
  </motion.button>
);

export const FAQ: React.FC = () => {
  const [openGroup, setOpenGroup] = useState<GroupKey | null>(null);

  const itemsFor = (g: GroupKey) =>
    faqs.map((item, idx) => ({ item, idx })).filter(({ item }) => item.group === g);

  return (
    <>
      <section id="faq" className="relative py-20 md:py-28 bg-[#030305] border-t border-white/[0.05] scroll-mt-10">
        <div className="container mx-auto px-6 max-w-5xl">

          <div className="text-center mb-12 md:mb-16">
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="block w-8 h-px bg-[#CCFF00]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#CCFF00]">
                Common Questions
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
              Pick a topic to see its questions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GROUP_ORDER.map((group, i) => {
              const count = itemsFor(group).length;
              if (!count) return null;
              return (
                <FaqGroupCard
                  key={group}
                  group={group}
                  count={count}
                  delay={i * 0.06}
                  onOpen={() => setOpenGroup(group)}
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
        {openGroup !== null && (
          <FaqDialog
            group={openGroup}
            items={itemsFor(openGroup)}
            onClose={() => setOpenGroup(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};
