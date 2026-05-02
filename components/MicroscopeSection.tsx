
import React from 'react';
import { ServiceBreakdown, Overlay, Hud } from './ServiceBreakdown';

const overlays: Overlay[] = [
  {
    position: 'left',
    enter: 0.06,
    exit: 0.26,
    kicker: '01 / 03 — UNDER THE SCOPE',
    title: 'Microscopic precision.',
    body: 'Critical edges inspected and finished under 40× magnification — the kind of detail you can\'t see with the naked eye.',
    stat: '40× MAGNIFICATION',
  },
  {
    position: 'right',
    enter: 0.36,
    exit: 0.60,
    kicker: '02 / 03 — TOLERANCE HELD',
    title: 'Burr-free to ± 0.001"',
    body: 'Controlled edge break, chamfer, and blend. We remove the burr only — your dimensions stay exactly as drawn.',
    stat: '± 0.001 IN',
  },
  {
    position: 'left',
    enter: 0.70,
    exit: 0.94,
    kicker: '03 / 03 — VERIFIED',
    title: 'Aerospace.',
    body: 'Every critical edge verified, documented, and signed off before it leaves the bench. Inspection-ready, every job, every part.',
    stat: 'INSPECTION-READY',
  },
];

const hud: Hud = {
  vignette: 'scope',
  reticle: false,
  live: true,
  topLeft: 'MAG 40×',
  topRight: 'OBJECTIVE 4.0× / NA 0.10',
  bottomRight: 'OPERATOR · MICROSCOPE BENCH',
  frameCounter: true,
};

export const MicroscopeSection: React.FC = () => {
  return (
    <ServiceBreakdown
      id="service-microscope"
      ref="SVC-01 / 04 — MICROSCOPE DEBURRING"
      introKicker="SVC-01 / 04"
      introTitle="Microscope Deburring"
      introBody="Finishing under magnification — for parts where details matter."
      framePath="/frames/microscope"
      frameCount={298}
      frameExt=".jpg"
      scrollVH={5}
      overlays={overlays}
      hud={hud}
    />
  );
};
