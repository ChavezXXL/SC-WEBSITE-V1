import { RefObject, useEffect, useState } from 'react';

/**
 * Drives a pair of video elements as a seamless infinite loop with crossfade.
 * - Lazy-loads: video src is only assigned when the section enters viewport
 *   (avoids downloading 50MB+ of video on initial page load).
 * - Pauses both videos when section is offscreen (perf).
 * - Adds `loop` as a belt-and-suspenders fallback in case the crossfade swap
 *   misfires (so the user always sees motion, never a frozen frame).
 * - Logs errors so missing/corrupt files surface during debugging.
 */
export const useVideoBackgroundPair = (
  videoARef: RefObject<HTMLVideoElement | null>,
  videoBRef: RefObject<HTMLVideoElement | null>,
  sectionRef: RefObject<HTMLElement | null>,
  src: string,
  crossfadeSeconds: number = 1.2,
) => {
  const [activeVideo, setActiveVideo] = useState<'a' | 'b'>('a');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const a = videoARef.current;
    const b = videoBRef.current;
    const section = sectionRef.current;
    if (!a || !b || !section) return;

    let inView = false;
    let started = false;
    let cancelled = false;

    const tryPlay = (v: HTMLVideoElement) => {
      const promise = v.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch((err) => {
          if (err?.name !== 'AbortError') {
            // eslint-disable-next-line no-console
            console.warn('[video bg] play() rejected:', err?.message || err);
          }
        });
      }
    };

    const handleTimeUpdate = (which: 'a' | 'b') => () => {
      if (!inView) return;
      const me = which === 'a' ? a : b;
      const other = which === 'a' ? b : a;
      if (!me.duration || isNaN(me.duration)) return;
      if (me.currentTime >= me.duration - crossfadeSeconds) {
        if (other.paused) {
          other.currentTime = 0;
          tryPlay(other);
          setActiveVideo(which === 'a' ? 'b' : 'a');
        }
      }
    };

    const onError = (label: string) => () => {
      // eslint-disable-next-line no-console
      console.error(`[video bg] ${label} failed to load: ${src}`);
    };

    const onLoadedData = () => {
      if (!cancelled) setLoaded(true);
    };

    const aHandler = handleTimeUpdate('a');
    const bHandler = handleTimeUpdate('b');
    const aError = onError('A');
    const bError = onError('B');
    a.addEventListener('timeupdate', aHandler);
    b.addEventListener('timeupdate', bHandler);
    a.addEventListener('error', aError);
    b.addEventListener('error', bError);
    a.addEventListener('loadeddata', onLoadedData, { once: true });

    // Lazy-set src + start playing only when section near viewport
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          inView = true;
          // First-time load: assign src to both videos
          if (!a.src) a.src = src;
          if (!b.src) b.src = src;
          if (!started) {
            tryPlay(a);
            started = true;
          } else {
            if (activeVideo === 'a' && a.paused) tryPlay(a);
            if (activeVideo === 'b' && b.paused) tryPlay(b);
          }
        } else {
          inView = false;
          a.pause();
          b.pause();
        }
      },
      { rootMargin: '50% 0px 50% 0px', threshold: 0 },
    );
    io.observe(section);

    return () => {
      cancelled = true;
      a.removeEventListener('timeupdate', aHandler);
      b.removeEventListener('timeupdate', bHandler);
      a.removeEventListener('error', aError);
      b.removeEventListener('error', bError);
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  return { activeVideo, loaded };
};
