type FaqItem = {
  group: 'QUALITY' | 'CAPABILITIES' | 'LOGISTICS' | 'QUOTING';
  category: string;
  question: string;
  answer: string;
};

export const faqs: FaqItem[] = [
  {
    group: 'CAPABILITIES',
    category: 'BASICS',
    question: 'What is deburring, and why does my part need it?',
    answer: "Deburring removes the sharp edges and raised material left by machining, stamping, or cutting. Burrs cause stress fractures, become FOD inside fluid systems, and ruin coatings. It's the final step that turns a machined part into one that's ready to fly.",
  },
  {
    group: 'CAPABILITIES',
    category: 'CAPABILITY',
    question: 'What kinds of parts do you specialize in?',
    answer: "Complex geometry — manifolds, valve bodies, hydraulic fittings, and anything with cross-drilled or intersecting bores. Built for parts where burrs hide inside and tolerances are tight. Aerospace and medical mainly.",
  },
  {
    group: 'CAPABILITIES',
    category: 'MATERIALS',
    question: 'What materials can you deburr?',
    answer: "Stainless, aluminum, titanium, Inconel, brass, copper, Invar, carbon steel — plus most plastics. We match the technique to the material so dimensions stay exact.",
  },
  {
    group: 'QUALITY',
    category: 'PRECISION',
    question: 'Can you hold tight tolerances on critical parts?',
    answer: "Yes. We remove the burr only. Surrounding edges stay exactly as drawn — we don't round what should stay sharp.",
  },
  {
    group: 'CAPABILITIES',
    category: 'COMPLEXITY',
    question: 'Can you handle cross-drilled holes and internal passages?',
    answer: "It's our specialty. Intersections where bores meet are where most shops miss burrs that turn into FOD. We use microscope inspection and the right tooling to clean every one.",
  },
  {
    group: 'LOGISTICS',
    category: 'VOLUME',
    question: 'Do you handle prototypes and production runs?',
    answer: "Both — one-off prototypes to thousands per batch. The process scales to match the volume.",
  },
  {
    group: 'LOGISTICS',
    category: 'LEAD TIME',
    question: "What's your typical turnaround?",
    answer: "Quotes back in 24 hours. Most jobs run 3–5 business days. Faster if your timeline calls for it.",
  },
  {
    group: 'QUALITY',
    category: 'QUALITY',
    question: 'How do you ensure quality?',
    answer: "Every lot receives a final inspection before delivery, with critical features verified under magnification and documented sign-off on every batch.",
  },
  {
    group: 'LOGISTICS',
    category: 'LOGISTICS',
    question: 'Do you offer pickup and delivery?',
    answer: "Local pickup and delivery for regular customers in LA and the San Fernando Valley. Standard freight everywhere else — pickup arranged for larger jobs.",
  },
  {
    group: 'QUOTING',
    category: 'QUOTING',
    question: "What do you need to send a quote?",
    answer: "A drawing or photo, an approximate quantity, and any spec callouts. Quote back in 24 hours.",
  },
  {
    group: 'LOGISTICS',
    category: 'LOCATION',
    question: 'Where is SC Precision Deburring located?',
    answer: "Pacoima, California — 12734 Branford Street, Unit 17, in the San Fernando Valley. We serve all of Southern California: Los Angeles, Orange, Ventura, San Bernardino, Riverside, and San Diego counties.",
  },
  {
    group: 'QUALITY',
    category: 'CERTIFICATIONS',
    question: 'Are you ISO 9001 or AS9100 certified?',
    answer: "We're not currently ISO 9001 or AS9100 certified. We run a documented, repeatable quality process: final inspection of every lot, critical features verified under magnification, and written sign-off on every batch.",
  },
  {
    group: 'CAPABILITIES',
    category: 'TECHNIQUE',
    question: 'What is microscope deburring?',
    answer: "Deburring performed under magnification — typically 10x to 40x — for parts where burrs hide inside cross-drilled holes, internal passages, or tight features the naked eye can't catch. Standard for aerospace manifolds, valve bodies, and high-tolerance medical devices.",
  },
  {
    group: 'CAPABILITIES',
    category: 'INDUSTRIES',
    question: 'Do you work with aerospace, defense, and medical OEMs?',
    answer: "Our customers are precision machine shops, and what comes off their CNC machines goes into aerospace, defense, medical and industrial programs. We deburr to the print — the end market is our customer's to know. If it was machined, we can finish it. Much of our work ships into our customers' AS9100-controlled supply chains; we are not ourselves certified.",
  },
  {
    group: 'QUOTING',
    category: 'PRICING',
    question: 'How much does deburring cost?',
    answer: "Depends on part complexity, material, and quantity — but quotes come back in 24 hours, free, with no minimum order. Small simple batches start at a few dollars per part; complex aerospace work prices per print and spec callout.",
  },
];
