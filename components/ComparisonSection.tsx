
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CheckCircle2, ChevronsLeftRight, ArrowRight } from 'lucide-react';
import { useData } from './DataContext';

export const ComparisonSection: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get images from Admin Context
  const { comparisonLeft, comparisonRight } = useData();

  // Check if we are in "Simulation Mode" (using the same image for both sides)
  const isSimulation = comparisonLeft === comparisonRight;

  // Robust width tracking to prevent image collapse
  useEffect(() => {
    const updateWidth = () => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.offsetWidth);
        }
    };

    // Initial width set
    updateWidth();

    // Observer for container resizing
    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', updateWidth);

    return () => {
        resizeObserver.disconnect();
        window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const position = ((clientX - left) / width) * 100;
    setSliderPosition(Math.min(100, Math.max(0, position)));
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) handleMove(e.touches[0].clientX);
  };

  // Jump the divider straight to the pointer on press, then track it.
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handleMove(e.touches[0].clientX);
  };

  // Global event listeners for dragging outside the container
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientX);
    };
    const handleGlobalMouseUp = () => setIsDragging(false);
    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDragging) handleMove(e.touches[0].clientX);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      window.addEventListener('touchmove', handleGlobalTouchMove);
      window.addEventListener('touchend', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [isDragging, handleMove]);

  const scrollToProcess = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('process');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-[#080808] relative overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Comparison Slider */}
          <div className="relative select-none group">
            <div
              ref={containerRef}
              className="relative w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-900 cursor-ew-resize"
              style={{ touchAction: 'pan-y' }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
            >
              {/* IMAGE: BACKGROUND (RIGHT SIDE - MACHINED/RAW) */}
              <div className="absolute inset-0">
                <img
                  src={comparisonRight}
                  alt="Raw machined part before deburring"
                  decoding="async"
                  className="w-full h-full object-cover"
                  style={{
                    filter: isSimulation ? 'contrast(1.1) brightness(0.7) sepia(0.2) grayscale(0.2)' : undefined
                  }}
                />

                {/* SCRATCH TEXTURE OVERLAY */}
                <div
                  className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`
                  }}
                >
                </div>

                {/* Label - RAW */}
                {/* Fixed: Fades out sooner (at 85%) so it doesn't bleed through */}
                <div
                  className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-10 px-3 py-1.5 md:px-4 md:py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg transition-opacity duration-300 pointer-events-none"
                  style={{ opacity: sliderPosition > 85 ? 0 : 1 }}
                >
                  <span className="text-[10px] md:text-xs font-mono text-zinc-400 uppercase tracking-widest whitespace-nowrap">Machined (Raw)</span>
                </div>
              </div>

              {/* IMAGE: FOREGROUND (LEFT SIDE - FINISHED) - CLIPPED */}
              <div
                className="absolute inset-0 overflow-hidden bg-[#080808] z-20"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src={comparisonLeft}
                  alt="Finished part after precision deburring"
                  decoding="async"
                  className="h-full object-cover max-w-none"
                  style={{
                    width: containerWidth ? `${containerWidth}px` : '100vw',
                    minWidth: '100%',
                    filter: isSimulation ? 'contrast(1.25) brightness(1.15) saturate(1.1) hue-rotate(-5deg)' : undefined
                  }}
                />

                {/* Shine/Reflection Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#00FFBD]/10 to-transparent mix-blend-overlay pointer-events-none"></div>

                {/* Cut Line */}
                <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white/80 shadow-[0_0_20px_rgba(255,255,255,0.8)] z-20"></div>

                {/* Label - FINISH */}
                <div
                  className="absolute bottom-4 left-4 md:bottom-6 md:left-6 z-10 px-3 py-1.5 md:px-4 md:py-2 bg-[#00FFBD]/10 backdrop-blur-md border border-[#00FFBD]/30 rounded-lg transition-opacity duration-300 pointer-events-none"
                  style={{ opacity: sliderPosition < 15 ? 0 : 1 }}
                >
                  <span className="text-[10px] md:text-xs font-mono text-[#00FFBD] uppercase tracking-widest whitespace-nowrap">Deburred (Finish)</span>
                </div>
              </div>

              {/* Slider Handle */}
              <div
                className="absolute top-0 bottom-0 w-[1px] cursor-ew-resize z-30"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center shadow-2xl transform transition-transform group-active:scale-110">
                  <ChevronsLeftRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

              <div className="flex justify-between mt-4 px-2 opacity-60 text-[10px] uppercase tracking-[0.2em] font-medium">
                <span className="text-zinc-500">Drag to Compare</span>
                <span className="text-zinc-500">Live Preview</span>
              </div>
            </div>

            {/* Text Content */}
            <div className="pl-0 lg:pl-12">
              <div className="mb-6 flex items-center gap-3">
                <span className="block w-8 h-px bg-[#00FFBD]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#00FFBD]">※ Edge Retention</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-6 font-space leading-tight">
                Protect Your Critical <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#9affde] to-[#00FFBD]">
                  Dimensions.
                </span>
              </h2>

              <p className="text-lg text-zinc-400 mb-8 leading-relaxed font-light">
                Deburring should never change your tolerances. We remove the burr only — edge breaks and radii held to your print callouts, keeping your part true to its design.
              </p>

              <div className="space-y-8">
                <div className="flex gap-5 group">
                  <div className="mt-1 flex-shrink-0 w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-[#00FFBD]/50 transition-colors">
                    <span className="text-white font-mono text-lg font-bold">01</span>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-2 group-hover:text-[#00FFBD] transition-colors leading-tight">
                      Controlled Burr Removal <br className="hidden md:block"/>
                      <span className="text-sm font-normal text-zinc-500 inline-block mt-1">(Microscope-Verified)</span>
                    </h4>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                      We remove the burr only. Each critical edge is inspected under a microscope to ensure no surrounding material is disturbed.
                    </p>
                  </div>
                </div>

                <div className="flex gap-5 group">
                  <div className="mt-1 flex-shrink-0 w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-[#00FFBD]/50 transition-colors">
                    <span className="text-white font-mono text-lg font-bold">02</span>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-2 group-hover:text-[#00FFBD] transition-colors leading-tight">
                      Consistent, Repeatable Quality
                    </h4>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                      From small batches to runs in the thousands, every part receives the same precise finish with no variation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <button
                  onClick={scrollToProcess}
                  className="group flex items-center gap-3 text-white text-sm font-bold uppercase tracking-widest hover:text-[#00FFBD] transition-colors"
                >
                  Learn About Our Process
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

        </div>
      </div>
    </section>
  );
}
