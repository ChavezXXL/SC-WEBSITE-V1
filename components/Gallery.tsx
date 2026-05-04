
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Loader2, Maximize2 } from 'lucide-react';
import { useData } from './DataContext';
import { GalleryItem } from '../types';

interface GalleryProps {
  onBack: () => void;
}

const pad3 = (n: number) => String(n).padStart(3, '0');

const GalleryCard: React.FC<{ item: GalleryItem; index: number; total: number; onClick: () => void }> = ({
  item,
  index,
  total,
  onClick,
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: (index % 9) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className="group relative bg-[#06080a] border border-white/[0.08] hover:border-[#00FFBD]/40 transition-colors duration-500 overflow-hidden cursor-pointer"
    >
      {/* Drafting corner ticks */}
      <span aria-hidden className="absolute top-0 left-0 w-3 h-px bg-[#00FFBD]/50 group-hover:bg-[#00FFBD] transition-colors duration-500 z-30" />
      <span aria-hidden className="absolute top-0 left-0 w-px h-3 bg-[#00FFBD]/50 group-hover:bg-[#00FFBD] transition-colors duration-500 z-30" />
      <span aria-hidden className="absolute top-0 right-0 w-3 h-px bg-[#00FFBD]/50 group-hover:bg-[#00FFBD] transition-colors duration-500 z-30" />
      <span aria-hidden className="absolute top-0 right-0 w-px h-3 bg-[#00FFBD]/50 group-hover:bg-[#00FFBD] transition-colors duration-500 z-30" />
      <span aria-hidden className="absolute bottom-0 left-0 w-3 h-px bg-[#00FFBD]/50 group-hover:bg-[#00FFBD] transition-colors duration-500 z-30" />
      <span aria-hidden className="absolute bottom-0 left-0 w-px h-3 bg-[#00FFBD]/50 group-hover:bg-[#00FFBD] transition-colors duration-500 z-30" />
      <span aria-hidden className="absolute bottom-0 right-0 w-3 h-px bg-[#00FFBD]/50 group-hover:bg-[#00FFBD] transition-colors duration-500 z-30" />
      <span aria-hidden className="absolute bottom-0 right-0 w-px h-3 bg-[#00FFBD]/50 group-hover:bg-[#00FFBD] transition-colors duration-500 z-30" />

      {/* Image area */}
      <div className="relative aspect-square w-full overflow-hidden">
        {/* Skeleton */}
        <div className={`absolute inset-0 flex items-center justify-center bg-[#06080a] transition-opacity duration-500 z-10 ${loaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <Loader2 className="w-5 h-5 text-zinc-700 animate-spin" />
        </div>

        {/* Mint duotone tint */}
        <div className="absolute inset-0 bg-[#00FFBD]/0 group-hover:bg-[#00FFBD]/15 mix-blend-color transition-all duration-700 z-10 pointer-events-none" />
        {/* Bottom gradient fade */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#06080a] via-[#06080a]/40 to-transparent z-10 pointer-events-none" />
        {/* Scanline overlay */}
        <div
          className="absolute inset-0 z-10 pointer-events-none opacity-15 mix-blend-overlay"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 3px)`,
          }}
        />

        <img
          src={item.url}
          alt={item.title}
          onLoad={() => setLoaded(true)}
          loading="lazy"
          className="w-full h-full object-cover transition-all duration-[1400ms] ease-out group-hover:scale-[1.06] grayscale-[35%] group-hover:grayscale-0"
        />

        {/* Drawing reference stamp (top-left) — subtle */}
        <div className="absolute top-2.5 left-3 z-20">
          <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#00FFBD]/55 mix-blend-screen">
            {pad3(index + 1)} / {pad3(total)}
          </span>
        </div>

        {/* Zoom icon (top-right, on hover) */}
        <div className="absolute top-3 right-3 z-20 p-2 bg-[#030305]/85 backdrop-blur-md border border-white/10 group-hover:border-[#00FFBD]/40 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Maximize2 className="w-3.5 h-3.5 text-[#00FFBD]" strokeWidth={1.5} />
        </div>
      </div>

      {/* Caption strip — always visible */}
      <div className="relative px-4 py-4 border-t border-white/[0.06] group-hover:border-[#00FFBD]/20 transition-colors duration-500">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm md:text-base font-bold text-white uppercase tracking-[0.1em] truncate group-hover:text-[#00FFBD] transition-colors duration-300">
            {item.title}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 group-hover:text-[#00FFBD]/70 transition-colors flex-shrink-0">
            View →
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export const Gallery: React.FC<GalleryProps> = ({ onBack }) => {
  const { galleryItems } = useData();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  // Scroll to top whenever Gallery mounts
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const close = () => setSelectedIdx(null);
  const prev = () => setSelectedIdx((i) => (i === null ? null : (i - 1 + galleryItems.length) % galleryItems.length));
  const next = () => setSelectedIdx((i) => (i === null ? null : (i + 1) % galleryItems.length));

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedIdx === null) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedIdx, galleryItems.length]);

  const selected = selectedIdx !== null ? galleryItems[selectedIdx] : null;

  return (
    <div ref={topRef} className="min-h-screen bg-[#030305] text-white font-sans">

      {/* Background atmospherics */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-[#00FFBD]/8 blur-[140px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-[#00FFBD]/6 blur-[140px] rounded-full" />
      </div>

      {/* Top status / nav */}
      <div className="sticky top-0 z-40 bg-[#030305]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <button
            onClick={onBack}
            className="group flex items-center gap-2.5 text-zinc-400 hover:text-[#00FFBD] transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={1.75} />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Return Home</span>
          </button>

          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600 hidden md:block">
            SC-PRECISION-DEBURRING
          </div>
        </div>
      </div>

      {/* Header */}
      <section className="relative pt-20 md:pt-28 pb-16 md:pb-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="block w-8 h-px bg-[#00FFBD]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-[#00FFBD]">
              ※ Selected Work
            </span>
          </motion.div>

          <div className="md:flex md:items-end md:justify-between gap-12 mb-12 pb-12 border-b border-white/[0.08]">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="font-black uppercase leading-[0.88] tracking-tight"
                style={{ fontSize: 'clamp(3.5rem, 9vw, 8rem)' }}
              >
                <span className="block text-white">Portfolio.</span>
              </motion.h1>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-zinc-400 text-base md:text-lg font-light leading-relaxed mt-6 md:mt-0 md:max-w-md"
            >
              A working library of parts that came across the bench — manifolds, valve bodies, airfoils, and the rest. Click any to view full size.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Gallery grid — denser at desktop */}
      <div className="relative">
        <div className="container mx-auto px-6 max-w-7xl pb-24 md:pb-32">
          {galleryItems.length === 0 ? (
            <div className="text-center text-zinc-700 py-32 font-mono uppercase tracking-[0.3em] text-xs">
              [ Gallery Empty — Awaiting Upload ]
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {galleryItems.map((item, idx) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  index={idx}
                  total={galleryItems.length}
                  onClick={() => setSelectedIdx(idx)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-[#030305]/97 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12"
            onClick={close}
          >
            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 px-6 md:px-10 py-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] z-[101]">
              <div className="flex items-center gap-3 text-[#00FFBD]/85">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 inline-flex h-full w-full rounded-full bg-[#00FFBD] opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00FFBD]" />
                </span>
                <span>REF-{pad3((selectedIdx ?? 0) + 1)} / {pad3(galleryItems.length)}</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); close(); }}
                className="text-zinc-400 hover:text-[#00FFBD] transition-colors"
              >
                <X className="w-6 h-6" strokeWidth={1.5} />
              </button>
            </div>

            {/* Drafting tick corners */}
            <span aria-hidden className="absolute top-6 left-6 w-4 h-px bg-[#00FFBD]" />
            <span aria-hidden className="absolute top-6 left-6 w-px h-4 bg-[#00FFBD]" />
            <span aria-hidden className="absolute top-6 right-6 w-4 h-px bg-[#00FFBD]" />
            <span aria-hidden className="absolute top-6 right-6 w-px h-4 bg-[#00FFBD]" />
            <span aria-hidden className="absolute bottom-6 left-6 w-4 h-px bg-[#00FFBD]" />
            <span aria-hidden className="absolute bottom-6 left-6 w-px h-4 bg-[#00FFBD]" />
            <span aria-hidden className="absolute bottom-6 right-6 w-4 h-px bg-[#00FFBD]" />
            <span aria-hidden className="absolute bottom-6 right-6 w-px h-4 bg-[#00FFBD]" />

            <motion.div
              key={selectedIdx}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-7xl w-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selected.url}
                alt={selected.title}
                className="max-w-full max-h-[78vh] object-contain border border-white/[0.08]"
              />
              <div className="mt-8 text-center max-w-2xl">
                <h3 className="text-white text-2xl md:text-3xl font-black uppercase tracking-[0.08em]">
                  {selected.title}
                </h3>
                <div className="mt-3 flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                  <span className="block w-8 h-px bg-zinc-700" />
                  <span>SC Precision Deburring</span>
                  <span className="block w-8 h-px bg-zinc-700" />
                </div>
              </div>
            </motion.div>

            {/* Prev / Next nav */}
            {galleryItems.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 px-3 py-3 text-zinc-400 hover:text-[#00FFBD] hover:bg-[#00FFBD]/[0.06] transition-all duration-300 font-mono text-xs uppercase tracking-widest"
                >
                  ← Prev
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 px-3 py-3 text-zinc-400 hover:text-[#00FFBD] hover:bg-[#00FFBD]/[0.06] transition-all duration-300 font-mono text-xs uppercase tracking-widest"
                >
                  Next →
                </button>
              </>
            )}

            {/* Bottom helper */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600">
              ESC to close · ← → to navigate
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
