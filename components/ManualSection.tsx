
import React from 'react';
import { ServiceBreakdown, Overlay, Hud } from './ServiceBreakdown';

const overlays: Overlay[] = [
  {
    position: 'left',
    enter: 0.06,
    exit: 0.26,
    kicker: '01 / 03 — THE TOOLBOX',
    title: 'Whatever the part needs.',
    body: 'Files, blades, pencil grinders, rotary burrs, abrasive wheels, scotch-brite — every tool in the shop, chosen per material and per geometry. No two parts get deburred the same way.',
    stat: 'TOOL-AGNOSTIC',
  },
  {
    position: 'right',
    enter: 0.36,
    exit: 0.60,
    kicker: '02 / 03 — THE PROCESS',
    title: 'Cut. Radius. Buff. Inspect.',
    body: 'Edge break or chamfer with the right cutter — blade, file, burr. Abrasive wheel pass on the buffer to lift the remaining burr and clean the surface. Final visual on every part, every batch.',
    stat: 'FOUR-STEP PASS-OFF',
  },
  {
    position: 'left',
    enter: 0.70,
    exit: 0.94,
    kicker: '03 / 03 — THE STANDARD',
    title: 'Hand work, not guesswork.',
    body: 'Every edge hit by a trained operator. Radius where the print says radius. Chamfer where it says chamfer. Sharp where it should stay sharp — exactly to spec.',
    stat: 'TRAINED OPERATORS',
  },
];

const hud: Hud = {
  vignette: 'soft',
  reticle: false,
  live: true,
  topLeft: 'BENCH 02 — HAND',
  topRight: 'TECHNIQUE · MANUAL DEBURR',
  bottomRight: 'OPERATOR · SC-PRECISION',
  frameCounter: true,
};

export const ManualSection: React.FC = () => {
  return (
    <ServiceBreakdown
      id="service-manual"
      ref="SVC-02 / 03 — MANUAL DEBURRING"
      introKicker="SVC-02 / 03"
      introTitle="Manual Deburring"
      introBody="Cut, radius, buff, inspect — every tool, every part, by hand."
      frameBase="/frames/manual"
      frameCount={121}
      virtualFrames={447}
      scrollVH={5}
      overlays={overlays}
      hud={hud}
    />
  );
};
