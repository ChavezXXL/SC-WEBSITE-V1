
import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

export type Overlay = {
  position: 'center' | 'left' | 'right' | 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  /** Scroll progress 0-1 when overlay enters */
  enter: number;
  /** Scroll progress 0-1 when overlay leaves */
  exit: number;
  kicker?: string;
  title: string;
  body?: string;
  stat?: string;
};

export type Hud = {
  topLeft?: string;
  topRight?: string;
  bottomRight?: string;
  live?: boolean;
  frameCounter?: boolean;
  scaleBar?: string;
  reticle?: boolean;
  vignette?: 'soft' | 'scope';
};

export type ServiceBreakdownProps = {
  id: string;
  ref?: string;
  introKicker: string;
  introTitle: string;
  introBody?: string;
  /** Base path of the extracted frame sequence (e.g. /frames/microscope) */
  frameBase: string;
  /** Number of frame_NNNN.jpg images in the sequence */
  frameCount: number;
  /** Optional: total "virtual frames" for HUD frame counter display */
  virtualFrames?: number;
  /** Pinned scroll length in viewport heights, default 5 */
  scrollVH?: number;
  overlays: Overlay[];
  hud?: Hud;
};

const positionClasses: Record<Overlay['position'], string> = {
  center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md',
  left: 'top-1/2 left-[5%] right-[5%] md:right-auto -translate-y-1/2 md:max-w-xs',
  right: 'top-1/2 left-[5%] right-[5%] md:left-auto -translate-y-1/2 md:max-w-xs',
  'top-left': 'top-[18%] left-[5%] right-[5%] md:right-auto md:max-w-xs',
  'top-right': 'top-[18%] left-[5%] right-[5%] md:left-auto md:max-w-xs',
  'bottom-left': 'bottom-[14%] left-[5%] right-[5%] md:right-auto md:max-w-xs',
  'bottom-right': 'bottom-[14%] left-[5%] right-[5%] md:left-auto md:max-w-xs',
};

export const ServiceBreakdown: React.FC<ServiceBreakdownProps> = ({
  id,
  ref: drawingRef,
  frameBase,
  frameCount,
  virtualFrames = 100,
  scrollVH = 5,
  overlays,
  hud,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | undefined)[]>([]);
  const paintedRef = useRef(false);
  const [painted, setPainted] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  // Poster shown via CSS background until the first canvas frame paints
  const poster = frameBase.replace('/frames/', '/videos/posters/') + '.jpg';

  const progress = useMotionValue(0);

  // ---- Lazy gate: start loading frames when section is within ~20% of viewport ----
  // IntersectionObserver primary + a passive scroll-position fallback, so frame
  // loading can never be stranded by an observer that fails to deliver.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let done = false;

    const trigger = () => {
      if (done) return;
      done = true;
      setShouldLoad(true);
      io.disconnect();
      window.removeEventListener('scroll', checkByPosition);
    };

    const checkByPosition = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top < vh * 1.2 && rect.bottom > -vh * 0.2) trigger();
    };

    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) trigger(); },
      { rootMargin: '20% 0px 20% 0px' },
    );
    io.observe(section);
    window.addEventListener('scroll', checkByPosition, { passive: true });
    checkByPosition(); // handle loading mid-page (refresh at anchor, back-nav)

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', checkByPosition);
    };
  }, []);

  // ---- Canvas frame-sequence scrub (Apple technique) ----
  // We NEVER seek video.currentTime on scroll — async decoder seeks are what
  // made these sections choppy, and Safari often refuses to paint seeked
  // frames at all (black sections on Macs). Instead the clip ships as JPEG
  // frames drawn synchronously to a <canvas>: zero seek latency, identical
  // behavior in every browser.
  useEffect(() => {
    if (!shouldLoad) return;
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let disposed = false;
    const images = imagesRef.current;
    images.length = frameCount;

    const frameSrc = (i: number) => `${frameBase}/frame_${String(i + 1).padStart(4, '0')}.jpg`;

    // Progressive load order: endpoints, then midpoints at increasing density,
    // then sequential fill — scrubbing works (coarsely) almost immediately.
    const order: number[] = [];
    const seen = new Set<number>();
    const push = (i: number) => {
      if (i >= 0 && i < frameCount && !seen.has(i)) { seen.add(i); order.push(i); }
    };
    push(0);
    push(frameCount - 1);
    for (let step = 2; step <= 16; step *= 2) {
      for (let k = 1; k < step; k++) push(Math.round((frameCount * k) / step));
    }
    for (let i = 0; i < frameCount; i++) push(i);

    let lastDrawn = -1;

    const resize = () => {
      // Cap DPR at 2: on a 5K iMac an uncapped canvas would be 5120x2880 —
      // enormous fill cost for no visible gain on video-derived frames.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      lastDrawn = -1; // force redraw at new size
    };

    // While frames stream in, draw the nearest loaded frame so partial loads
    // still scrub instead of freezing.
    const nearestLoaded = (i: number) => {
      if (images[i]) return i;
      for (let d = 1; d < frameCount; d++) {
        if (i - d >= 0 && images[i - d]) return i - d;
        if (i + d < frameCount && images[i + d]) return i + d;
      }
      return -1;
    };

    const draw = (i: number) => {
      const idx = nearestLoaded(i);
      if (idx < 0 || idx === lastDrawn) return;
      const img = images[idx]!;
      lastDrawn = idx;
      const cw = canvas.width;
      const ch = canvas.height;
      // object-cover math: fill the canvas, crop overflow, center
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = cw / ch;
      let dw: number, dh: number, dx: number, dy: number;
      if (cr > ir) { dw = cw; dh = cw / ir; dx = 0; dy = (ch - dh) / 2; }
      else { dh = ch; dw = ch * ir; dy = 0; dx = (cw - dw) / 2; }
      ctx.drawImage(img, dx, dy, dw, dh);
      if (!paintedRef.current) { paintedRef.current = true; setPainted(true); }
    };

    const loadFrame = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => { if (!disposed) images[i] = img; resolve(); };
        img.onerror = () => resolve();
        img.src = frameSrc(i);
      });

    (async () => {
      const BATCH = 12;
      for (let b = 0; b < order.length; b += BATCH) {
        if (disposed) return;
        await Promise.all(order.slice(b, b + BATCH).map(loadFrame));
      }
    })();

    const computeTarget = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      const scrolled = -rect.top;
      let p = total > 0 ? scrolled / total : 0;
      if (p < 0) p = 0;
      if (p > 1) p = 1;
      return p;
    };

    // rAF loop: overlays/HUD get the raw progress (exact timing); the drawn
    // frame follows through a light lerp that swallows scroll-wheel steps.
    let current = 0;
    let raf = 0;
    const tick = () => {
      const target = computeTarget();
      progress.set(target);
      current += (target - current) * 0.22;
      if (Math.abs(target - current) < 0.0005) current = target;
      draw(Math.round(current * (frameCount - 1)));
      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      images.length = 0;
    };
  }, [shouldLoad, frameBase, frameCount, progress]);

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative scroll-mt-32"
      style={{ height: `${scrollVH * 100}vh` }}
    >
      <div
        className="sticky top-0 h-screen w-full overflow-hidden bg-black"
        style={{ backgroundImage: `url(${poster})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          aria-hidden
        />

        {!painted && shouldLoad && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-zinc-400 mb-3">
              Loading
            </div>
            <div className="w-48 h-px bg-zinc-800 overflow-hidden">
              <div className="h-full bg-[#00FFBD] animate-pulse w-1/3" />
            </div>
          </div>
        )}

        {hud?.vignette === 'scope' ? (
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_transparent_38%,_rgba(0,0,0,0.55)_62%,_rgba(0,0,0,0.92)_100%)]" />
        ) : (
          <>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.55)_75%,_rgba(0,0,0,0.85)_100%)]" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
          </>
        )}

        {hud?.reticle && (
          <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center">
            <svg width="180" height="180" viewBox="0 0 180 180" className="opacity-40">
              <circle cx="90" cy="90" r="78" fill="none" stroke="#00FFBD" strokeWidth="1" strokeDasharray="2 4" />
              <circle cx="90" cy="90" r="50" fill="none" stroke="#00FFBD" strokeWidth="1" />
              <line x1="90" y1="20" x2="90" y2="70" stroke="#00FFBD" strokeWidth="1" />
              <line x1="90" y1="110" x2="90" y2="160" stroke="#00FFBD" strokeWidth="1" />
              <line x1="20" y1="90" x2="70" y2="90" stroke="#00FFBD" strokeWidth="1" />
              <line x1="110" y1="90" x2="160" y2="90" stroke="#00FFBD" strokeWidth="1" />
              <circle cx="90" cy="90" r="2" fill="#00FFBD" />
            </svg>
          </div>
        )}

        {/* HUD: top-left status */}
        {(hud?.topLeft || hud?.live || hud?.frameCounter) && (
          <div className="absolute top-5 left-12 z-10 flex items-center gap-2.5 font-mono text-[9px] uppercase tracking-[0.3em] text-[#00FFBD]/55">
            {hud?.live && (
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-1 w-1">
                  <span className="absolute inset-0 inline-flex h-full w-full rounded-full bg-[#00FFBD] opacity-60 animate-ping" />
                  <span className="relative inline-flex rounded-full h-1 w-1 bg-[#00FFBD]" />
                </span>
                LIVE
              </span>
            )}
            {hud?.topLeft && <span>{hud.topLeft}</span>}
            {hud?.frameCounter && <FrameCounter progress={progress} total={virtualFrames} />}
          </div>
        )}

        {/* HUD: top-right status */}
        {hud?.topRight && (
          <div className="hidden md:block absolute top-5 right-12 z-10">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#00FFBD]/55">
              {hud.topRight}
            </span>
          </div>
        )}

        {/* HUD: bottom-right status */}
        {hud?.bottomRight && (
          <div className="hidden md:block absolute bottom-5 right-12 z-10 font-mono text-[9px] uppercase tracking-[0.3em] text-[#00FFBD]/45">
            {hud.bottomRight}
          </div>
        )}

        {hud?.scaleBar && (
          <div className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5">
            <div className="flex items-end h-3">
              <span className="block w-px h-3 bg-[#00FFBD]" />
              <span className="block w-20 h-px bg-[#00FFBD] mb-0" />
              <span className="block w-px h-2 bg-[#00FFBD]/60" />
              <span className="block w-20 h-px bg-[#00FFBD] mb-0" />
              <span className="block w-px h-3 bg-[#00FFBD]" />
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#00FFBD]">
              {hud.scaleBar}
            </span>
          </div>
        )}

        <span aria-hidden className="pointer-events-none absolute top-6 left-6 w-4 h-px bg-[#00FFBD]" />
        <span aria-hidden className="pointer-events-none absolute top-6 left-6 w-px h-4 bg-[#00FFBD]" />
        <span aria-hidden className="pointer-events-none absolute top-6 right-6 w-4 h-px bg-[#00FFBD]" />
        <span aria-hidden className="pointer-events-none absolute top-6 right-6 w-px h-4 bg-[#00FFBD]" />
        <span aria-hidden className="pointer-events-none absolute bottom-6 left-6 w-4 h-px bg-[#00FFBD]" />
        <span aria-hidden className="pointer-events-none absolute bottom-6 left-6 w-px h-4 bg-[#00FFBD]" />
        <span aria-hidden className="pointer-events-none absolute bottom-6 right-6 w-4 h-px bg-[#00FFBD]" />
        <span aria-hidden className="pointer-events-none absolute bottom-6 right-6 w-px h-4 bg-[#00FFBD]" />

        {drawingRef && (
          <div className="absolute bottom-5 left-12 z-10">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#00FFBD]/55">
              {drawingRef}
            </span>
          </div>
        )}

        {overlays.map((ov, i) => (
          <OverlayBlock key={i} ov={ov} progress={progress} />
        ))}
      </div>
    </section>
  );
};

const FrameCounter: React.FC<{ progress: ReturnType<typeof useMotionValue<number>>; total: number }> = ({ progress, total }) => {
  const [n, setN] = useState(1);
  useEffect(() => {
    const unsub = progress.on('change', (p) => {
      const idx = Math.max(1, Math.min(total, Math.round(p * (total - 1)) + 1));
      setN(idx);
    });
    return () => unsub();
  }, [progress, total]);
  const padded = String(n).padStart(3, '0');
  const totalPadded = String(total).padStart(3, '0');
  return <span className="tabular-nums">FRAME {padded} / {totalPadded}</span>;
};

const OverlayBlock: React.FC<{ ov: Overlay; progress: ReturnType<typeof useMotionValue<number>> }> = ({ ov, progress }) => {
  const opacity = useTransform(
    progress,
    [ov.enter - 0.06, ov.enter, ov.exit, ov.exit + 0.06],
    [0, 1, 1, 0],
  );
  const yShift = useTransform(progress, [ov.enter - 0.06, ov.enter], [16, 0]);

  const align =
    ov.position === 'center'
      ? 'text-center items-center'
      : ov.position.endsWith('right')
        ? 'text-right items-end'
        : 'text-left items-start';

  return (
    <motion.div
      style={{ opacity, y: yShift }}
      className={`pointer-events-none absolute z-20 ${positionClasses[ov.position]}`}
    >
      <div className={`relative flex flex-col gap-2 p-5 bg-black/70 border border-white/10 ${align}`}>
        <span aria-hidden className="absolute top-0 left-0 w-2 h-px bg-[#00FFBD]/70" />
        <span aria-hidden className="absolute top-0 left-0 w-px h-2 bg-[#00FFBD]/70" />
        <span aria-hidden className="absolute top-0 right-0 w-2 h-px bg-[#00FFBD]/70" />
        <span aria-hidden className="absolute top-0 right-0 w-px h-2 bg-[#00FFBD]/70" />
        <span aria-hidden className="absolute bottom-0 left-0 w-2 h-px bg-[#00FFBD]/70" />
        <span aria-hidden className="absolute bottom-0 left-0 w-px h-2 bg-[#00FFBD]/70" />
        <span aria-hidden className="absolute bottom-0 right-0 w-2 h-px bg-[#00FFBD]/70" />
        <span aria-hidden className="absolute bottom-0 right-0 w-px h-2 bg-[#00FFBD]/70" />

        {ov.kicker && (
          <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#00FFBD]">
            {ov.kicker}
          </div>
        )}
        <h3
          className="font-black text-white uppercase tracking-tight leading-[1.05]"
          style={{ fontSize: 'clamp(1.4rem, 2.6vw, 2.25rem)' }}
        >
          {ov.title}
        </h3>
        {ov.body && (
          <p
            className="text-zinc-100/90 font-light leading-snug"
            style={{ fontSize: 'clamp(0.78rem, 0.9vw, 0.875rem)' }}
          >
            {ov.body}
          </p>
        )}
        {ov.stat && (
          <div className="flex items-center gap-2 mt-1">
            <span className="block w-6 h-px bg-[#00FFBD]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#00FFBD]">
              {ov.stat}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
