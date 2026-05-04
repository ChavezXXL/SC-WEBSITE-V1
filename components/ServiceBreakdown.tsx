
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
  /** Top-left status, e.g. "MAG 40×" */
  topLeft?: string;
  /** Top-right status, e.g. "OBJECTIVE 4.0×" */
  topRight?: string;
  /** Bottom-right status, e.g. "OPERATOR · J. CHAVEZ" */
  bottomRight?: string;
  /** Show pulsing "● LIVE" indicator on top-left */
  live?: boolean;
  /** Show animated frame counter "FRAME nnn / total" */
  frameCounter?: boolean;
  /** Show measurement scale bar bottom-left, with this label e.g. "0.5 MM" */
  scaleBar?: string;
  /** Show center reticle / crosshair */
  reticle?: boolean;
  /** Vignette intensity */
  vignette?: 'soft' | 'scope';
};

export type ServiceBreakdownProps = {
  id: string;
  ref?: string;
  introKicker: string;
  introTitle: string;
  introBody?: string;
  framePath: string;
  frameCount: number;
  frameExt?: string;
  /** Pinned scroll length in viewport heights, default 4 */
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
  framePath,
  frameCount,
  frameExt = '.jpg',
  scrollVH = 4,
  overlays,
  hud,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(-1);
  const [loadedCount, setLoadedCount] = useState(0);
  const [ready, setReady] = useState(false);

  const progress = useMotionValue(0);

  // ---- Frame preloading (progressive: first / last / mid then fill) ----
  useEffect(() => {
    const order: number[] = [];
    const seen = new Set<number>();
    const push = (i: number) => {
      if (i < 0 || i >= frameCount || seen.has(i)) return;
      seen.add(i);
      order.push(i);
    };
    push(0);
    push(frameCount - 1);
    push(Math.floor(frameCount / 2));
    push(Math.floor(frameCount / 4));
    push(Math.floor((frameCount * 3) / 4));
    for (let i = 0; i < frameCount; i++) push(i);

    let cancelled = false;
    let n = 0;

    const failedIdx: number[] = [];

    const loadOne = (idx: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => {
          if (cancelled) return resolve();
          const finish = () => {
            if (cancelled) return resolve();
            imagesRef.current[idx] = img;
            n++;
            setLoadedCount(n);
            if (n === Math.min(8, frameCount)) setReady(true);
            resolve();
          };
          if (typeof img.decode === 'function') {
            img.decode().then(finish, finish);
          } else {
            finish();
          }
        };
        img.onerror = () => {
          // Track 404s for retry later (handles in-progress frame extraction)
          if (!imagesRef.current[idx]) failedIdx.push(idx);
          resolve();
        };
        img.src = `${framePath}/frame_${String(idx + 1).padStart(4, '0')}${frameExt}`;
      });

    (async () => {
      const batchSize = 12;
      for (let i = 0; i < order.length; i += batchSize) {
        if (cancelled) return;
        await Promise.all(order.slice(i, i + batchSize).map(loadOne));
      }
    })();

    // Retry-loop: every 4s try any frames that 404'd. Self-heals when extraction completes.
    const retryTimer = setInterval(() => {
      if (cancelled || failedIdx.length === 0) return;
      const batch = failedIdx.splice(0, 24);
      batch.forEach((idx) => {
        if (!imagesRef.current[idx]) loadOne(idx);
      });
    }, 4000);

    return () => {
      cancelled = true;
      clearInterval(retryTimer);
    };
  }, [framePath, frameCount, frameExt]);

  // ---- Scroll tracking + canvas drawing (with LERP smoothing) ----
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;
    let targetProgress = 0;
    let smoothedProgress = 0;
    let rafLoop = 0;
    let running = false;
    let lastDrawSig = '';

    const paintImg = (img: HTMLImageElement, w: number, h: number, alpha: number) => {
      const imgR = img.naturalWidth / img.naturalHeight;
      const scrR = w / h;
      let dw, dh, dx, dy;
      if (scrR > imgR) {
        dw = w; dh = w / imgR; dx = 0; dy = (h - dh) / 2;
      } else {
        dh = h; dw = h * imgR; dx = (w - dw) / 2; dy = 0;
      }
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    // Find the nearest loaded frame to a target index — graceful fallback
    // when frames are still loading or have failed to fetch.
    const nearestLoaded = (target: number): HTMLImageElement | null => {
      const last = frameCount - 1;
      if (imagesRef.current[target]) return imagesRef.current[target];
      // Search outward — alternating before/after — for the nearest available frame
      for (let d = 1; d <= last; d++) {
        const before = target - d;
        const after = target + d;
        if (before >= 0 && imagesRef.current[before]) return imagesRef.current[before];
        if (after <= last && imagesRef.current[after]) return imagesRef.current[after];
      }
      return null;
    };

    const drawFrame = (frameFloat: number) => {
      const last = frameCount - 1;
      const f = Math.max(0, Math.min(last, frameFloat));
      const a = Math.floor(f);
      const b = Math.min(last, a + 1);
      const t = f - a;
      const sig = `${a}_${(t * 100) | 0}`;
      if (sig === lastDrawSig) return;
      // Graceful fallback: if exact frame missing, snap to nearest loaded
      const imgA = imagesRef.current[a] || nearestLoaded(a);
      const imgB = imagesRef.current[b] || imgA; // if next is missing, just use A (no blend)
      if (!imgA) return; // truly nothing loaded yet
      lastDrawSig = sig;
      currentFrameRef.current = a;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      // Sub-frame blending: paint A at full, then B over top at t
      if (imgA) paintImg(imgA, w, h, 1);
      if (imgB && t > 0.001 && b !== a) paintImg(imgB, w, h, t);
      ctx.globalAlpha = 1;
    };

    const computeTarget = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      const scrolled = -rect.top;
      let p = total > 0 ? scrolled / total : 0;
      if (p < 0) p = 0;
      if (p > 1) p = 1;
      targetProgress = p;
    };

    const loop = () => {
      // LERP smoothed → target. Lower factor = smoother / laggier.
      const factor = 0.07;
      const diff = targetProgress - smoothedProgress;
      if (Math.abs(diff) < 0.00005) {
        smoothedProgress = targetProgress;
      } else {
        smoothedProgress += diff * factor;
      }
      progress.set(smoothedProgress);
      drawFrame(smoothedProgress * (frameCount - 1));

      // Continue running while ANY motion is happening or until perfectly settled
      if (Math.abs(targetProgress - smoothedProgress) > 0.00005) {
        rafLoop = requestAnimationFrame(loop);
      } else {
        running = false;
      }
    };

    const kick = () => {
      if (!running) {
        running = true;
        rafLoop = requestAnimationFrame(loop);
      }
    };

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      currentFrameRef.current = -1;
      lastDrawSig = '';
      computeTarget();
      smoothedProgress = targetProgress;
      progress.set(smoothedProgress);
      drawFrame(smoothedProgress * (frameCount - 1));
    };

    const onScroll = () => {
      computeTarget();
      kick();
    };

    resize();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
      if (rafLoop) cancelAnimationFrame(rafLoop);
    };
  }, [progress, frameCount]);

  const loaderPct = Math.round((loadedCount / frameCount) * 100);

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative scroll-mt-32"
      style={{ height: `${scrollVH * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {!ready && (
          <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-zinc-500 mb-4">
              Loading frames · {loaderPct}%
            </div>
            <div className="w-48 h-px bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-[#00FFBD] transition-all duration-200"
                style={{ width: `${loaderPct}%` }}
              />
            </div>
          </div>
        )}

        {hud?.vignette === 'scope' ? (
          <>
            {/* Microscope-style heavy circular vignette */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_transparent_38%,_rgba(0,0,0,0.55)_62%,_rgba(0,0,0,0.92)_100%)]" />
          </>
        ) : (
          <>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.55)_75%,_rgba(0,0,0,0.85)_100%)]" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
          </>
        )}

        {/* Reticle / crosshair */}
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
            {hud?.frameCounter && <FrameCounter progress={progress} total={frameCount} />}
          </div>
        )}

        {/* HUD: top-right status — hidden on small screens to avoid clutter */}
        {hud?.topRight && (
          <div className="hidden md:block absolute top-5 right-12 z-10">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#00FFBD]/55">
              {hud.topRight}
            </span>
          </div>
        )}

        {/* HUD: bottom-right status — hidden on small screens */}
        {hud?.bottomRight && (
          <div className="hidden md:block absolute bottom-5 right-12 z-10 font-mono text-[9px] uppercase tracking-[0.3em] text-[#00FFBD]/45">
            {hud.bottomRight}
          </div>
        )}

        {/* HUD: scale bar bottom-center */}
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
  const fade = 0.06;
  const inStart = Math.max(0, ov.enter - fade);
  const inEnd = ov.enter;
  const outStart = ov.exit;
  const outEnd = Math.min(1, ov.exit + fade);

  const opacity = useTransform(
    progress,
    [inStart, inEnd, outStart, outEnd],
    [0, 1, 1, 0],
    { clamp: true }
  );
  const yShift = useTransform(
    progress,
    [inStart, inEnd, outStart, outEnd],
    [24, 0, 0, -24],
    { clamp: true }
  );

  const isRight = ov.position === 'right' || ov.position === 'top-right' || ov.position === 'bottom-right';
  const isCenter = ov.position === 'center';

  const align =
    isRight ? 'items-end text-right'
    : isCenter ? 'items-center text-center'
    : 'items-start text-left';

  return (
    <motion.div
      style={{ opacity, y: yShift }}
      className={`pointer-events-none absolute z-20 ${positionClasses[ov.position]}`}
    >
      <div className={`relative flex flex-col gap-2 p-5 bg-black/40 backdrop-blur-md border border-white/10 ${align}`}>
        {/* Drafting tick marks */}
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
          <div className="flex items-center gap-2 mt-0.5">
            <span className="block w-5 h-px bg-[#00FFBD]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#00FFBD]">
              {ov.stat}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
