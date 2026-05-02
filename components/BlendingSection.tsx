
import React from 'react';
import { ServiceBreakdown, Overlay, Hud } from './ServiceBreakdown';

const overlays: Overlay[] = [
  {
    position: 'left',
    enter: 0.06,
    exit: 0.26,
    kicker: '01 / 03 — SURFACE WORK',
    title: 'Seamless transitions.',
    body: 'Welds, tool marks, and parting lines blended into a continuous surface. The seam disappears, the part looks intentional.',
    stat: 'NO VISIBLE TRANSITIONS',
  },
  {
    position: 'right',
    enter: 0.36,
    exit: 0.60,
    kicker: '02 / 03 — MULTI-STAGE',
    title: 'Coarse to mirror.',
    body: 'Step-graded abrasives — each pass cleans up the marks left by the last. We finish to your spec, from satin to mirror.',
    stat: 'SATIN → MIRROR',
  },
  {
    position: 'left',
    enter: 0.70,
    exit: 0.94,
    kicker: '03 / 03 — APPLICATION',
    title: 'Cosmetic & functional.',
    body: 'Show parts that need to look engineered. Flow surfaces that need to perform. Aerospace, medical, and automotive — show finish.',
    stat: 'READY TO SHIP',
  },
];

const hud: Hud = {
  vignette: 'soft',
  reticle: false,
  live: true,
  topLeft: 'BENCH 03',
  topRight: 'TECHNIQUE · SURFACE BLEND',
  bottomRight: 'OPERATOR · BLENDING BENCH',
  frameCounter: true,
};

export const BlendingSection: React.FC = () => {
  return (
    <ServiceBreakdown
      id="service-blending"
      ref="SVC-03 / 04 — BLENDING"
      introKicker="SVC-03 / 04"
      introTitle="Blending"
      introBody="Seamless surface transitions — cosmetic and functional finishes."
      framePath="/frames/blending"
      frameCount={478}
      frameExt=".jpg"
      scrollVH={5}
      overlays={overlays}
      hud={hud}
    />
  );
};
