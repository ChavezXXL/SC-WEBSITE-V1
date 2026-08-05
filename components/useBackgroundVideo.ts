import { RefObject, useEffect, useState } from 'react';

/**
 * Drives a SINGLE background <video> element efficiently.
 *
 * Replaces the old dual-element crossfade (useVideoBackgroundPair), which
 * downloaded the same file into two <video> elements (~2x bandwidth + 2 live
 * decoders) and ran a `timeupdate` listener several times a second. A single
 * element with the native `loop` attribute loops seamlessly on its own.
 *
 * - Lazy-loads: src is assigned only when the section nears the viewport, so
 *   offscreen sections don't download multi-MB video on initial page load.
 * - Plays when in view, pauses when offscreen (releases the decoder).
 * - Honors prefers-reduced-motion: never autoplays — the element's `poster`
 *   image stays visible instead.
 * - Surfaces load errors to the console for debugging.
 *
 * The <video> should carry `loop muted playsInline preload="metadata"` and a
 * `poster` so something paints instantly before the first frame decodes.
 */
export const useBackgroundVideo = (
  videoRef: RefObject<HTMLVideoElement | null>,
  sectionRef: RefObject<HTMLElement | null>,
  src: string,
) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let cancelled = false;

    const tryPlay = () => {
      const promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch((err) => {
          if (err?.name !== 'AbortError') {
            // eslint-disable-next-line no-console
            console.warn('[video bg] play() rejected:', err?.message || err);
          }
        });
      }
    };

    const onError = () => {
      // Ignore teardown aborts (e.g. React StrictMode's dev double-mount) —
      // only log genuine decode/network failures.
      if (cancelled || !video.error || video.error.code === MediaError.MEDIA_ERR_ABORTED) return;
      // eslint-disable-next-line no-console
      console.error(`[video bg] failed to load: ${src}`);
    };
    const onLoadedData = () => {
      if (!cancelled) setLoaded(true);
    };

    video.addEventListener('error', onError);
    video.addEventListener('loadeddata', onLoadedData, { once: true });

    // Don't compete with the critical path: hold the video download until the
    // window 'load' event has fired (the poster covers the gap), then let the
    // IntersectionObserver decide when to actually attach + play.
    let pageLoaded = document.readyState === 'complete';
    let wantsPlay = false;
    const attachAndPlay = () => {
      if (!video.src) video.src = src;
      if (!prefersReducedMotion) tryPlay();
    };
    const onWindowLoad = () => {
      pageLoaded = true;
      if (wantsPlay) attachAndPlay();
    };
    if (!pageLoaded) window.addEventListener('load', onWindowLoad, { once: true });

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          wantsPlay = true;
          if (pageLoaded) attachAndPlay();
        } else {
          wantsPlay = false;
          video.pause();
        }
      },
      { rootMargin: '50% 0px 50% 0px', threshold: 0 },
    );
    io.observe(section);

    return () => {
      cancelled = true;
      video.removeEventListener('error', onError);
      window.removeEventListener('load', onWindowLoad);
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  return { loaded };
};
