
import React, { useEffect, useState } from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';
import { usePannedTrack } from './usePannedTrack';
import { useFocusPeak } from './useFocusPeak';

/* ------------------------------------------------------------------ *
 * Industries.
 *
 * Same focus falloff as the service area — each card comes up to full scale
 * and brightness as it crosses the middle — and the same two modes: a pinned
 * scroll-scrub on desktop, a native swipe strip on a phone. usePannedTrack
 * explains why those are deliberately not the same code.
 *
 * The pan distance is measured rather than hardcoded; the old -75% over-panned
 * and left roughly a third of a screen of dead space past the last card.
 * ------------------------------------------------------------------ */

const Dot: React.FC<{ index: number; active: MotionValue<number> }> = ({ index, active }) => {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const unsub = active.on('change', (v) => setOn(v >= index));
    return () => unsub();
  }, [active, index]);
  return (
    <motion.span
      className={`block h-1.5 rounded-full transition-all duration-300 ${on ? 'w-6 bg-[#CCFF00]' : 'w-1.5 bg-zinc-700'}`}
    />
  );
};

const industries = [
  {
    id: 1,
    title: "Aerospace & Defense",
    subtitle: "Flight Critical Precision",
    description: "Manifolds, valve bodies, and hydraulic fittings for Tier 1 and Tier 2 suppliers. Finished to your print. Dimensions held. FOD-free under magnification.",
    image: "/img/industries/aerospace.jpg",
    alt: "Rocket launch — aerospace parts deburred by SC Precision Deburring"
  },
  {
    id: 2,
    title: "Medical Devices",
    subtitle: "Surgical Perfection",
    description: "Burr-free edges on surgical instrument and implant components for regulated manufacturers. Clean under the scope — in the body, there's no tolerance for FOD.",
    image: "/img/industries/medical.jpg",
    alt: "Surgical instruments — medical device components finished by SC Precision Deburring"
  },
  {
    id: 3,
    title: "Automotive",
    subtitle: "Performance Engineering",
    description: "Valve bodies, fittings, and machined components for performance and production builds. Smooth edges. Exact chamfers.",
    image: "/img/industries/automotive.jpg",
    alt: "Performance car — automotive components deburred by SC Precision Deburring"
  },
  {
    id: 4,
    title: "Commercial Aviation",
    subtitle: "Global Reliability",
    description: "Engine and cabin hardware for commercial fleets. Every edge inspected under magnification before pass-off.",
    image: "/img/industries/aviation.jpg",
    alt: "Commercial aircraft — aviation hardware finished by SC Precision Deburring"
  }
];

const IndustryCard: React.FC<{ industry: (typeof industries)[number]; idx: number }> = ({ industry, idx }) => (
  <div className="group relative h-[60vh] md:h-[70vh] w-full overflow-hidden bg-[#06080a] border border-white/[0.08] hover:border-[#CCFF00]/30 transition-colors duration-500">
    {/* Drafting corner ticks */}
    <span aria-hidden className="absolute top-0 left-0 w-3 h-px bg-[#CCFF00]/50 z-30" />
    <span aria-hidden className="absolute top-0 left-0 w-px h-3 bg-[#CCFF00]/50 z-30" />
    <span aria-hidden className="absolute top-0 right-0 w-3 h-px bg-[#CCFF00]/50 z-30" />
    <span aria-hidden className="absolute top-0 right-0 w-px h-3 bg-[#CCFF00]/50 z-30" />
    <span aria-hidden className="absolute bottom-0 left-0 w-3 h-px bg-[#CCFF00]/50 z-30" />
    <span aria-hidden className="absolute bottom-0 left-0 w-px h-3 bg-[#CCFF00]/50 z-30" />
    <span aria-hidden className="absolute bottom-0 right-0 w-3 h-px bg-[#CCFF00]/50 z-30" />
    <span aria-hidden className="absolute bottom-0 right-0 w-px h-3 bg-[#CCFF00]/50 z-30" />

    <div className="absolute inset-0">
      <img
        src={industry.image}
        alt={industry.alt}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale-[40%] group-hover:grayscale-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/50 to-transparent" />
      <div className="absolute inset-0 bg-[#030305]/15 group-hover:bg-[#030305]/0 transition-colors duration-700" />
    </div>

    {/* Drawing reference stamp — top-left, very small */}
    <div className="absolute top-4 left-4 z-20 font-mono text-[9px] uppercase tracking-[0.3em] text-[#CCFF00]/85">
      IND-{String(idx + 1).padStart(2, '0')} / {String(industries.length).padStart(2, '0')}
    </div>

    {/* Subtitle as small mono caption — no bubble */}
    <div className="absolute bottom-0 w-full p-8 md:p-12">
      <div className="flex items-center gap-2 mb-3">
        <span className="block w-6 h-px bg-[#CCFF00]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#CCFF00]">
          {industry.subtitle}
        </span>
      </div>
      <h3 className="mb-5 text-4xl md:text-5xl font-normal text-white tracking-[-0.015em] leading-[0.95]">
        {industry.title}
      </h3>
      <p className="max-w-xl text-base md:text-lg text-zinc-200/95 leading-relaxed font-light">
        {industry.description}
      </p>
    </div>
  </div>
);

const IndustriesIntro: React.FC<{ activeDot?: MotionValue<number> }> = ({ activeDot }) => (
  <>
    <div className="flex items-center gap-3 mb-6">
      <span className="block w-8 h-px bg-[#CCFF00]" />
      <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#CCFF00]">
        ※ Industries
      </span>
    </div>
    <h2 className="text-5xl md:text-7xl font-normal text-white mb-6 tracking-[-0.015em] leading-[0.9]">
      Industries <br/>
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E4FF7A] to-[#CCFF00]">We Power.</span>
    </h2>
    <p className="text-lg text-zinc-300 max-w-md font-light leading-relaxed">
      Precision finishing for the most demanding sectors on Earth — and beyond.
    </p>
    {activeDot && (
      <div className="mt-10 flex gap-2 items-center">
        {industries.map((_, i) => (
          <Dot key={i} index={i} active={activeDot} />
        ))}
      </div>
    )}
  </>
);

/** One panel in the track. Peaks as it passes the centre of the viewport. */
const Panel: React.FC<{
  at: number; spacing: number; progress: MotionValue<number>; still: boolean; active: boolean;
  snap?: boolean; className: string; children: React.ReactNode;
}> = ({ at, spacing, progress, still, active, snap, className, children }) => {
  const { scale, opacity } = useFocusPeak(progress, at, { spacing });
  return (
    <motion.div
      // On the swipe strip the falloff is CSS (.swipe-focus, scroll-driven), so
      // no inline style, no motion values and no promoted layers.
      style={(still || snap) ? undefined : { scale, opacity, willChange: active ? 'transform, opacity' : 'auto' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const Industries: React.FC = () => {
  const pan = usePannedTrack();
  const still = pan.reduce || !pan.panMax;

  // Dot indicator, driven by the same progress as the pan.
  const activeDot = useTransform(pan.progress, (v) =>
    Math.min(industries.length - 1, Math.floor(v * industries.length)),
  );

  return (
    <section id="industries" className="relative bg-[#030305]">

      {pan.mobile ? (
        /* Phone: heading above, then a native swipe strip. The pinned pan is
           scroll-linked JavaScript and stutters on a fling; this is compositor
           scrolling and matches the sideways swipe the row invites anyway. */
        <div className="py-16">
          <div className="px-6">
            <IndustriesIntro />
          </div>

          <div className="relative mt-10">
            <div
              ref={pan.scroller}
              style={pan.scrollerStyle}
              className="no-scrollbar overflow-x-auto overscroll-x-contain snap-x snap-mandatory"
            >
              <div ref={pan.track} className="swipe-focus flex gap-4 w-max px-6 pb-2">
                {industries.map((industry, idx) => (
                  <Panel
                    key={industry.id}
                    at={pan.at[idx] ?? 0}
                    spacing={pan.spacing}
                    progress={pan.progress}
                    still={still}
                    active={pan.active}
                    snap
                    className="w-[85vw] flex-shrink-0 snap-center"
                  >
                    <IndustryCard industry={industry} idx={idx} />
                  </Panel>
                ))}
              </div>
            </div>
          </div>

          <p className="px-6 mt-4 font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-500 text-center">
            Swipe to explore →
          </p>
        </div>
      ) : (
        <div ref={pan.runway} className={pan.panMax ? 'relative' : 'relative h-[400vh]'} style={pan.runwayStyle}>
          <div ref={pan.stage} className="sticky top-0 flex h-screen items-center overflow-hidden">
            <motion.div
              ref={pan.track}
              style={{ x: pan.reduce ? 0 : pan.x, willChange: pan.active && !pan.reduce ? 'transform' : 'auto' }}
              className="flex gap-10 w-max items-center px-24"
            >
              <Panel
                at={pan.at[0] ?? 0}
                spacing={pan.spacing}
                progress={pan.progress}
                still={still}
                active={pan.active}
                className="flex flex-shrink-0 w-[40vw] h-[70vh] flex-col justify-center"
              >
                <IndustriesIntro activeDot={activeDot} />
              </Panel>

              {industries.map((industry, idx) => (
                <Panel
                  key={industry.id}
                  at={pan.at[idx + 1] ?? 0}
                  spacing={pan.spacing}
                  progress={pan.progress}
                  still={still}
                  active={pan.active}
                  className="w-[60vw] flex-shrink-0"
                >
                  <IndustryCard industry={industry} idx={idx} />
                </Panel>
              ))}
            </motion.div>

            <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#030305] via-[#030305]/60 to-transparent" />
            <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#030305] via-[#030305]/60 to-transparent" />
          </div>
        </div>
      )}
    </section>
  );
};
