
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

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

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
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
            >
              {/* IMAGE: BACKGROUND (RIGHT SIDE - MACHINED/RAW) */}
              <div className="absolute inset-0">
                <img 
                  src={comparisonRight}
                  alt="Raw Machined Part" 
                  className="w-full h-full object-cover"
                  style={{ 
                      // If specific photos are provided, we don't need heavy filters.
                      filter: isSimulation ? 'contrast(1.1) brightness(0.7) sepia(0.2) grayscale(0.2)' : undefined 
                  }}
                />
                
                {/* SCRATCH TEXTURE OVERLAY - Keeps industrial feel */}
                <div 
                    className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`
                    }}
                ></div>
                
                {/* Label */}
                <div className="absolute bottom-6 right-6 z-10 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Machined (Raw)</span>
                </div>
              </div>

              {/* IMAGE: FOREGROUND (LEFT SIDE - FINISHED) - CLIPPED */}
              <div 
                className="absolute inset-0 overflow-hidden bg-[#080808]"
                style={{ width: `${sliderPosition}%` }}
              >
                <img 
                  src={comparisonLeft}
                  alt="Deburred Finished Part" 
                  className="h-full object-cover max-w-none"
                  style={{ 
                      // Logic: If containerWidth is available, use it. 
                      // Fallback to 100vw to ensure image is never 0 width (which makes it invisible)
                      width: containerWidth ? `${containerWidth}px` : '100vw', 
                      minWidth: '100%',
                      filter: isSimulation ? 'contrast(1.25) brightness(1.15) saturate(1.1) hue-rotate(-5deg)' : undefined
                  }}
                />
                
                {/* Shine/Reflection Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent mix-blend-overlay pointer-events-none"></div>
                
                {/* Cut Line */}
                <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white/80 shadow-[0_0_20px_rgba(255,255,255,0.8)] z-20"></div>

                {/* Label */}
                <div className="absolute bottom-6 left-6 z-10 px-4 py-2 bg-[#00FFBD]/10 backdrop-blur-md border border-[#00FFBD]/30 rounded-lg">
                  <span className="text-xs font-mono text-[#00FFBD] uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3" />
                    Deburred (Finish)
                  </span>
                </div>
              </div>

              {/* Slider Handle */}
              <div 
                className="absolute top-0 bottom-0 w-[1px] cursor-ew-resize z-30"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center shadow-2xl transform transition-transform group-active:scale-110">
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
               <div className="h-[2px] w-8 bg-[#00FFBD]"></div>
               <span className="text-[#00FFBD] text-xs font-bold uppercase tracking-widest">Edge Retention Technology</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-space leading-[1.1]">
              Preserve Critical <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-600">
                Dimensions.
              </span>
            </h2>

            <p className="text-lg text-zinc-400 mb-8 leading-relaxed font-light">
              Aggressive finishing often degrades part tolerances. Our proprietary process removes burrs with surgical precision, maintaining corner radii within <span className="text-white font-medium">0.002"</span>. We target the imperfection, preserving the integrity of your design.
            </p>

            <div className="space-y-8">
              <div className="flex gap-5 group">
                <div className="mt-1 flex-shrink-0 w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-[#00FFBD]/50 transition-colors">
                  <span className="text-white font-mono text-lg font-bold">01</span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-2 group-hover:text-[#00FFBD] transition-colors">Micro-Precision Removal</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    Advanced abrasion technology targets the burr at a microscopic level, ensuring the base geometry remains untouched.
                  </p>
                </div>
              </div>

              <div className="flex gap-5 group">
                <div className="mt-1 flex-shrink-0 w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-[#00FFBD]/50 transition-colors">
                  <span className="text-white font-mono text-lg font-bold">02</span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-2 group-hover:text-[#00FFBD] transition-colors">Absolute Repeatability</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    Identical results from the first part to the millionth. We eliminate the unpredictability of manual finishing.
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
};
