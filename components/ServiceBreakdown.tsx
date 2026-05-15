
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
  /** Path to the scroll video (e.g. /videos/scroll/microscope.mp4) */
  videoSrc: string;
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
  videoSrc,
  virtualFrames = 100,
  scrollVH = 5,
  overlays,
  hud,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  const progress = useMotionValue(0);

  // ---- Lazy gate: only attach src when section is within ~60% of viewport ----
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: '60% 0px 60% 0px' },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  // ---- Set video src when ready to load ----
  useEffect(() => {
    if (!shouldLoad) return;
    const v = videoRef.current;
    if (!v) return;
    if (!v.src) v.src = videoSrc;
    // Try to preload the first frame so it renders before user scrolls in
    v.load();
  }, [shouldLoad, videoSrc]);

  // ---- Scroll → video.currentTime with throttled, queued seeks ----
  // Key insight: seeking video is asynchronous — issuing seek requests faster
  // than the decoder can fulfill them creates jank. We track the in-flight
  // seek and only issue a new one when the previous finishes. We also drive
  // the visible frame via requestVideoFrameCallback (rVFC) when available,
  // which paints in sync with the actual video presentation timer.
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    let isReady = false;
    let isSeeking = false;
    let pendingTarget: number | null = null;
    let rafLoop = 0;
    let lastSet = -1;

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

    const applySeek = (p: number) => {
      if (!isReady || !video.duration || isNaN(video.duration)) {
        pendingTarget = p;
        return;
      }
      const t = Math.max(0, Math.min(video.duration - 0.0001, p * video.duration));
      // No-op if already there
      if (Math.abs((video.currentTime || 0) - t) < 0.012) return;
      // If a seek is in-flight, queue the new target — it will be applied
      // when 'seeked' fires. This prevents decoder thrash.
      if (isSeeking) {
        pendingTarget = p;
        return;
      }
      isSeeking = true;
      video.currentTime = t;
    };

    const onSeeked = () => {
      isSeeking = false;
      if (pendingTarget != null) {
        const next = pendingTarget;
        pendingTarget = null;
        applySeek(next);
      }
    };

    const onLoaded = () => {
      isReady = true;
      setReady(true);
      try {
        video.currentTime = 0;
      } catch {}
      // iOS Safari needs a play() call (even at rate 0) to keep the decoder
      // warm and paint seek frames reliably. Muted + playsInline allows it
      // without user gesture on modern iOS.
      video.playbackRate = 0;
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => { /* autoplay rejected — fall back to seek-only */ });
      }
    };

    video.addEventListener('loadedmetadata', onLoaded);
    video.addEventListener('seeked', onSeeked);
    if (video.readyState >= 1) onLoaded();

    // Single rAF loop, driven by scroll. Direct seek (no LERP) — the LERP
    // was causing the back-and-forth seek thrash that read as "gunky".
    const tick = () => {
      const p = computeTarget();
      progress.set(p);
      if (Math.abs(p - lastSet) > 0.0008) {
        lastSet = p;
        applySeek(p);
      }
      rafLoop = requestAnimationFrame(tick);
    };
    rafLoop = requestAnimationFrame(tick);

    return () => {
      video.removeEventListener('loadedmetadata', onLoaded);
      video.removeEventListener('seeked', onSeeked);
      if (rafLoop) cancelAnimationFrame(rafLoop);
      try { video.pause(); } catch {}
    };
  }, [progress, shouldLoad]);

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative scroll-mt-32"
      style={{ height: `${scrollVH * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          preload="auto"
          // @ts-expect-error - non-standard but improves iOS behavior
          webkit-playsinline="true"
          // @ts-expect-error - non-standard, hint to browser
          disablePictureInPicture
        />

        {!ready && shouldLoad && (
          <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-zinc-500 mb-4">
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
      <div className={`relative flex flex-col gap-2 p-5 bg-black/40 backdrop-blur-md border border-white/10 ${align}`}>
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
