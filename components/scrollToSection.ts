/**
 * Section-aware smooth scrolling for nav/CTA clicks.
 *
 * Sections whose content reads best vertically CENTERED in the viewport
 * (hero-style intro blocks that can be taller than one screen) scroll with
 * block:'center'. Pinned/scrub sections and long form sections must align
 * to their top so their behavior starts from the beginning.
 *
 * Native scrollIntoView({behavior:'smooth'}) hands the duration to the
 * browser, which stretches it with distance — a click from the hero down to
 * the contact form took ~2.5s and crawled through every pinned scrub section
 * on the way. This animates over a FIXED duration instead, so the trip takes
 * the same time whether the target is one screen away or twenty.
 *
 * NOTE: <html> carries Tailwind's `scroll-smooth`, i.e. CSS
 * `scroll-behavior: smooth`. That applies to programmatic scrolls too, so a
 * bare window.scrollTo() inside the rAF loop below would kick off a fresh
 * browser-driven animation on every single frame and the two would fight.
 * Every scroll here therefore passes behavior:'instant' to opt out of the
 * CSS default and let this easing own the motion.
 */
const CENTER_TARGETS: Record<string, string> = {
  // nav id -> element that should end up centered
  services: 'services-intro',
  process: 'process',
};

const DURATION_MS = 700;

/** easeInOutCubic — quick off the mark, settles without a bounce. */
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

let activeScroll = 0;

const animateTo = (targetY: number) => {
  const maxY = document.documentElement.scrollHeight - window.innerHeight;
  const to = Math.max(0, Math.min(targetY, maxY));
  const from = window.scrollY;
  const delta = to - from;

  // Nothing to do, or the visitor asked for reduced motion — jump.
  if (
    Math.abs(delta) < 2 ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    window.scrollTo({ top: to, behavior: 'instant' as ScrollBehavior });
    return;
  }

  const id = ++activeScroll;
  const start = performance.now();

  const step = (now: number) => {
    if (id !== activeScroll) return; // a newer request supersedes this one
    const t = Math.min(1, (now - start) / DURATION_MS);
    window.scrollTo({ top: from + delta * ease(t), behavior: 'instant' as ScrollBehavior });
    if (t < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};

export const scrollToSection = (id: string) => {
  const centerId = CENTER_TARGETS[id];
  const el = centerId
    ? document.getElementById(centerId) ?? document.getElementById(id)
    : document.getElementById(id);
  if (!el) return;

  const rect = el.getBoundingClientRect();
  const top = rect.top + window.scrollY;

  // block:'center' equivalent for the intro-style targets, top-align otherwise.
  const targetY = centerId ? top - (window.innerHeight - rect.height) / 2 : top;

  animateTo(targetY);
};
