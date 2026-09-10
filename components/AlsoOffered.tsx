import React from 'react';
import { motion } from 'framer-motion';
import { scrollToSection } from './scrollToSection';

/* ------------------------------------------------------------------ *
 * Secondary capabilities.
 *
 * ONLY work the shop actually performs today. Kitting and protective
 * packaging were listed here and are NOT services SC offers — parts go
 * back the way they arrived. They were removed rather than softened:
 * a capability a buyer could order and we could not deliver is worse
 * than one we never advertised.
 *
 * Deliberately quiet: a strip, not a second services section competing
 * with the three scrub breakdowns.
 * ------------------------------------------------------------------ */

type Item = { label: string; body: string };

const items: Item[] = [
  {
    label: 'Dot-Peen Part Marking',
    body: 'Permanent identification marked to your print — part numbers, serials, lot codes. Marked and deburred in one stop, so the lot never leaves for a second vendor.',
  },
  {
    label: 'Final Inspection',
    body: 'Every lot inspected before it ships, with critical features verified under magnification and written sign-off on the batch. Included on every job, not a line item.',
  },
  {
    label: 'Local Pickup & Delivery',
    body: 'We already run the Valley, Valencia and Fullerton. For regular work we collect and return the lot ourselves, so your parts are not sitting on a freight dock.',
  },
];

export const AlsoOffered: React.FC = () => (
  <section className="relative py-24 md:py-28 bg-[#030305] border-t border-white/[0.05]">
    <div className="container mx-auto px-6 max-w-6xl">

      <div className="flex items-center gap-4 mb-12 md:mb-14">
        <span className="block w-8 h-px bg-[#B49A66] flex-shrink-0" />
        <h2 className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#B49A66] whitespace-nowrap">
          Also Offered
        </h2>
        <span className="block h-px flex-1 bg-white/[0.08]" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.07]">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            className="group relative bg-[#06080a] p-7 md:p-8"
          >
            <span
              aria-hidden="true"
              className="absolute top-0 left-0 h-px w-0 group-hover:w-12 bg-[#B49A66] transition-all duration-700"
            />
            <span className="font-mono text-[9.5px] tracking-[0.28em] text-zinc-500 tabular-nums">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="mt-4 mb-3 text-base font-bold text-white uppercase tracking-[0.08em] leading-snug group-hover:text-[#B49A66] transition-colors duration-300">
              {item.label}
            </h3>
            <p className="text-[13.5px] leading-relaxed font-light text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300">
              {item.body}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <a
          href="#contact"
          onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
          className="group inline-flex items-center gap-2 min-h-[44px] py-3 text-[#B49A66] font-mono text-xs uppercase tracking-[0.3em] hover:text-white transition-colors duration-300"
        >
          <span className="relative">
            Ask About Combining Operations
            <span className="absolute -bottom-1 left-0 right-0 h-px bg-[#B49A66] group-hover:bg-white transition-colors" />
          </span>
          <span className="text-base translate-y-[-1px]">→</span>
        </a>
      </div>
    </div>
  </section>
);
