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

type Item = { label: string; body: string; icon: string };

const items: Item[] = [
  {
    icon: '/img/icons/marking.png',
    label: 'Dot-Peen Part Marking',
    body: 'Permanent identification marked to your print — part numbers, serials, lot codes. Marked and deburred in one stop, so the lot never leaves for a second vendor.',
  },
  {
    icon: '/img/icons/inspection.png',
    label: 'Final Inspection',
    body: 'Every lot inspected before it ships, with critical features verified under magnification and written sign-off on the batch. Included on every job, not a line item.',
  },
  {
    icon: '/img/icons/delivery.png',
    label: 'Local Pickup & Delivery',
    body: 'We already run the Valley, Valencia and Fullerton. For regular work we collect and return the lot ourselves, so your parts are not sitting on a freight dock.',
  },
];

export const AlsoOffered: React.FC = () => (
  <section className="relative py-24 md:py-28 bg-[#030305] border-t border-white/[0.05]">
    <div className="container mx-auto px-6 max-w-6xl">

      <div className="flex items-center gap-4 mb-12 md:mb-14">
        <span className="block w-8 h-px bg-[#CCFF00] flex-shrink-0" />
        <h2 className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#CCFF00] whitespace-nowrap">
          Also Offered
        </h2>
        <span className="block h-px flex-1 bg-white/[0.08]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ type: 'spring', stiffness: 220, damping: 26, mass: 0.9, delay:i * 0.07 }}
            className="group relative bg-[#06080a] hover:bg-[#0a0e12] border border-white/[0.07] hover:border-[#CCFF00]/30 transition-[background-color,border-color] duration-500 ease-out p-7 md:p-8 rounded-2xl"
          >
            <img
              src={item.icon}
              alt=""
              aria-hidden="true"
              width={256}
              height={256}
              loading="lazy"
              decoding="async"
              className="w-12 h-12 md:w-14 md:h-14 -ml-1 opacity-90 group-hover:opacity-100 transition-opacity duration-300"
            />
            <h3 className="mt-4 mb-3 text-base font-medium text-white tracking-normal leading-snug group-hover:text-[#CCFF00] transition-colors duration-300">
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
          className="group inline-flex items-center gap-2 min-h-[44px] py-3 text-[#CCFF00] font-mono text-xs uppercase tracking-[0.3em] hover:text-white transition-colors duration-300"
        >
          <span className="relative">
            Ask About Combining Operations
            <span className="absolute -bottom-1 left-0 right-0 h-px bg-[#CCFF00] group-hover:bg-white transition-colors" />
          </span>
          <span className="text-base translate-y-[-1px]">→</span>
        </a>
      </div>
    </div>
  </section>
);
