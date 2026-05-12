
import React from 'react';
import { ServiceBreakdown, Overlay, Hud } from './ServiceBreakdown';

const overlays: Overlay[] = [
  {
    position: 'left',
    enter: 0.06,
    exit: 0.26,
    kicker: '01 / 03 — COMPLEX GEOMETRY',
    title: 'Cross-drilled. Cross-bored. Done right.',
    body: 'Manifolds, valve bodies, hydraulic fittings — parts with intersections where multiple bores meet. We remove the burrs at every intersection, without touching the bore itself.',
    stat: 'INTERSECTING BORES',
  },
  {
    position: 'right',
    enter: 0.36,
    exit: 0.60,
    kicker: '02 / 03 — TIGHT TOLERANCE',
    title: 'Burr off. Nothing else.',
    body: 'Every burr removed, every dimension intact. The print stays as drawn — we don\'t break edges that aren\'t called out, and we don\'t round what was meant to stay sharp.',
    stat: 'NO TOLERANCE LOSS',
  },
  {
    position: 'left',
    enter: 0.70,
    exit: 0.94,
    kicker: '03 / 03 — FOR FLIGHT-CRITICAL',
    title: 'FOD doesn\'t fly.',
    body: 'On aerospace fuel and hydraulic systems, a missed burr becomes a loose particle — and Foreign Object Debris inside a system ends a flight. Every cross-drill verified before pass-off.',
    stat: 'FOD-FREE INSPECTION',
  },
];

const hud: Hud = {
  vignette: 'scope',
  reticle: false,
  live: true,
  topLeft: 'BENCH 01 — SCOPE',
  topRight: 'INSPECTION · UNDER MAGNIFICATION',
  bottomRight: 'OPERATOR · SC-PRECISION',
  frameCounter: true,
};

export const MicroscopeSection: React.FC = () => {
  return (
    <ServiceBreakdown
      id="service-microscope"
      ref="SVC-01 / 03 — MICROSCOPE DEBURRING"
      introKicker="SVC-01 / 03"
      introTitle="Microscope Deburring"
      introBody="Complicated parts. Tight tolerances. Verified under magnification."
      framePath="/frames/microscope"
      frameCount={596}
      frameExt=".jpg"
      scrollVH={5}
      overlays={overlays}
      hud={hud}
    />
  );
};
