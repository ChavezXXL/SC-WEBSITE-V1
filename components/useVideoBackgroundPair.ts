import { RefObject, useEffect, useState } from 'react';

/**
 * Drives a pair of video elements as a seamless infinite loop with crossfade,
 * AND pauses both when their parent section scrolls out of view (perf win).
 */
export const useVideoBackgroundPair = (
  videoARef: RefObject<HTMLVideoElement | null>,
  videoBRef: RefObject<HTMLVideoElement | null>,
  sectionRef: RefObject<HTMLElement | null>,
  crossfadeSeconds: number = 1.2,
) => {
  const [activeVideo, setActiveVideo] = useState<'a' | 'b'>('a');

  useEffect(() => {
    const a = videoARef.current;
    const b = videoBRef.current;
    const section = sectionRef.current;
    if (!a || !b || !section) return;

    let inView = false;
    let started = false;

    const tryPlay = (v: HTMLVideoElement) => {
      v.play().catch(() => {});
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

    const aHandler = handleTimeUpdate('a');
    const bHandler = handleTimeUpdate('b');
    a.addEventListener('timeupdate', aHandler);
    b.addEventListener('timeupdate', bHandler);

    // Pause when offscreen, resume when onscreen
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) {
          if (!started) {
            tryPlay(a);
            started = true;
          } else {
            // Resume whichever was active
            if (activeVideo === 'a' && a.paused) tryPlay(a);
            if (activeVideo === 'b' && b.paused) tryPlay(b);
          }
        } else {
          a.pause();
          b.pause();
        }
      },
      { threshold: 0.05 },
    );
    io.observe(section);

    return () => {
      a.removeEventListener('timeupdate', aHandler);
      b.removeEventListener('timeupdate', bHandler);
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { activeVideo };
};
