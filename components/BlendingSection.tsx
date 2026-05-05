
import React from 'react';
import { ServiceBreakdown, Overlay, Hud } from './ServiceBreakdown';

const overlays: Overlay[] = [
  {
    position: 'left',
    enter: 0.06,
    exit: 0.26,
    kicker: '01 / 03 — TOOL MARKS GONE',
    title: 'Machined marks, blended out.',
    body: 'Machining lines, weld passes, parting witnesses — blended until the surface reads as one continuous piece. Tooling disappears. The part looks intentional.',
    stat: 'SEAMLESS SURFACE',
  },
  {
    position: 'right',
    enter: 0.36,
    exit: 0.60,
    kicker: '02 / 03 — WHY IT MATTERS',
    title: 'Surface drives performance.',
    body: 'In aerospace, a clean surface isn\'t cosmetic. Sharp edges concentrate stress and start fatigue cracks. Tool marks disrupt boundary-layer flow on airfoils. Burrs and ridges in fluid passages turn into FOD.',
    stat: 'FATIGUE / FLOW / FOD',
  },
  {
    position: 'left',
    enter: 0.70,
    exit: 0.94,
    kicker: '03 / 03 — A HARD SKILL',
    title: 'Mastered by hand.',
    body: 'Blending is one of the hardest skills in the shop to get right. We\'ve done it long enough to call it ours — every abrasive grade matched to whatever finish your part calls for.',
    stat: 'CRAFT, NOT MACHINE',
  },
];

const hud: Hud = {
  vignette: 'soft',
  reticle: false,
  live: true,
  topLeft: 'BENCH 03 — BLEND',
  topRight: 'TECHNIQUE · SURFACE BLEND',
  bottomRight: 'OPERATOR · SC-PRECISION',
  frameCounter: true,
};

export const BlendingSection: React.FC = () => {
  return (
    <ServiceBreakdown
      id="service-blending"
      ref="SVC-03 / 03 — BLENDING"
      introKicker="SVC-03 / 03"
      introTitle="Blending"
      introBody="Tool marks erased. Surface continuous. Built for the parts where it matters."
      framePath="/frames/blending"
      frameCount={483}
      frameExt=".jpg"
      scrollVH={6}
      overlays={overlays}
      hud={hud}
    />
  );
};
