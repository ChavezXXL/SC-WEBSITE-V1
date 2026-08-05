/**
 * Section-aware smooth scrolling for nav/CTA clicks.
 *
 * Sections whose content reads best vertically CENTERED in the viewport
 * (hero-style intro blocks that can be taller than one screen) scroll with
 * block:'center'. Pinned/scrub sections and long form sections must align
 * to their top so their behavior starts from the beginning.
 */
const CENTER_TARGETS: Record<string, string> = {
  // nav id -> element that should end up centered
  services: 'services-intro',
  process: 'process',
};

export const scrollToSection = (id: string) => {
  const centerId = CENTER_TARGETS[id];
  if (centerId) {
    const el = document.getElementById(centerId) ?? document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};
