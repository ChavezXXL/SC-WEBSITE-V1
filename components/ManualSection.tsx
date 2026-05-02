
import React from 'react';
import { ServiceBreakdown, Overlay, Hud } from './ServiceBreakdown';

const overlays: Overlay[] = [
  {
    position: 'left',
    enter: 0.06,
    exit: 0.26,
    kicker: '01 / 03 — BY HAND',
    title: 'Hand-finished.',
    body: 'Tolerance-critical work executed by trained technicians. Edge break, chamfer, and blend — exactly to spec, every time.',
    stat: 'CERTIFIED OPERATORS',
  },
  {
    position: 'right',
    enter: 0.36,
    exit: 0.60,
    kicker: '02 / 03 — CONTROL',
    title: 'Tools meet skill.',
    body: 'Files, deburring tools, and abrasives — chosen per material, per geometry. Machines can\'t replicate the feel of a finished edge.',
    stat: 'TOOL-AGNOSTIC',
  },
  {
    position: 'left',
    enter: 0.70,
    exit: 0.94,
    kicker: '03 / 03 — VERIFIED',
    title: 'Inspection-ready.',
    body: 'Every part comes off the bench QA-checked, packaged, and ready for your assembly line. No rework. No surprises.',
    stat: 'PASS-OFF DOCUMENTED',
  },
];

const hud: Hud = {
  vignette: 'soft',
  reticle: false,
  live: true,
  topLeft: 'BENCH 02',
  topRight: 'TECHNIQUE · MANUAL DEBURR',
  bottomRight: 'OPERATOR · HAND-FINISH BENCH',
  frameCounter: true,
};

export const ManualSection: React.FC = () => {
  return (
    <ServiceBreakdown
      id="service-manual"
      ref="SVC-02 / 04 — MANUAL DEBURRING"
      introKicker="SVC-02 / 04"
      introTitle="Manual Deburring"
      introBody="Hand-finished by trained technicians — tolerance-critical, inspection-ready."
      framePath="/frames/manual"
      frameCount={298}
      frameExt=".jpg"
      scrollVH={5}
      overlays={overlays}
      hud={hud}
    />
  );
};
