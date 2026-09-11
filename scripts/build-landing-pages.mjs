/**
 * Static landing-page generator.
 *
 * The site is a single React page, so it competes for every phrase at once.
 * Google ranks pages, not sites. These are real, separately-indexable URLs
 * with their own title, description, canonical, schema and body content —
 * generated as plain HTML so no router or hydration is involved and the
 * crawler sees finished markup.
 *
 * Content rule: each page must say something the others do not. Thin
 * near-duplicates aimed at a keyword are doorway pages and get demoted, so
 * every page below answers a genuinely different question, and every claim
 * traces to the FAQ, the Quality Manual or SCD-QP-08.
 *
 * Run: node scripts/build-landing-pages.mjs
 */
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://scprecisiondeburring.com';

const PAGES = [
  {
    slug: 'microscope-deburring',
    title: 'Microscope Deburring | Cross-Drilled & Internal Passages | SC Deburring',
    desc: 'Microscope deburring for machined parts where burrs hide inside cross-drilled holes and internal passages. Pacoima, CA. Quote within one business day.',
    h1: 'Microscope deburring',
    lede: 'For the burrs you cannot see, on the features that matter most.',
    service: 'Microscope Deburring',
    body: [
      ['What microscope deburring actually is',
       `Deburring performed under magnification, typically between 10× and 40×, rather than by eye. It is not a different tool so much as a different standard of evidence: the operator can see the burr root, the edge condition either side of it, and whether the surrounding material has been disturbed.`,
       `Most deburring is judged by feel — run a finger or a pick along the edge and call it done. That works on an accessible outside edge. It does not work where the feature is 3&nbsp;mm down a bore, on the far side of an intersection, where no finger reaches and no light falls naturally.`],
      ['When a part needs it',
       `If the burr is on an external edge you can see and reach, magnification buys you very little. The parts that need it share a pattern: the burr forms somewhere the eye cannot reach, and the consequence of missing it is downstream and expensive.`,
       `In practice that means cross-drilled and intersecting bores, internal fluid passages, small threaded ports, and any feature where the drawing calls a controlled edge break on a surface you cannot inspect by eye.`],
      ['What we are looking at under the scope',
       `Three things. Whether the burr is fully removed at the root rather than folded over. Whether the edge either side is still as drawn — we remove the burr and nothing else, so an edge that was meant to stay sharp stays sharp. And whether any debris has been generated and left behind by the removal itself.`,
       `Every lot is inspected before it ships, with critical features verified under magnification, and each operation is signed and dated on the job traveler as it is completed.`],
    ],
    faq: [
      ['What magnification do you work at?', 'Typically 10× to 40×, chosen for the feature. Higher is not automatically better — too much magnification narrows the field of view and slows the work without improving the result.'],
      ['Does microscope deburring change my dimensions?', 'No. We remove the burr only. Surrounding edges stay exactly as drawn, and we do not break edges the print does not call out.'],
      ['Is it slower than hand deburring?', 'Per part, yes. It is used where the feature justifies it, not as a default on every edge of every part.'],
    ],
  },
  {
    slug: 'aerospace-deburring',
    title: 'Aerospace Deburring Services | FOD Control & Traceability | SC Deburring',
    desc: 'Aerospace deburring for Tier 1 and Tier 2 machine shops. FOD prevention, job traveler sign-off, Certificate of Conformance on every shipment. Pacoima, CA.',
    h1: 'Aerospace deburring',
    lede: 'Outside processing for machine shops whose parts have somewhere serious to go.',
    service: 'Aerospace Deburring',
    body: [
      ['Why aerospace treats burrs differently',
       `A burr left inside a hydraulic or fuel passage does not stay put. It works loose under flow and pressure and becomes foreign object debris inside a system that has no tolerance for it. That is why aerospace drawings call out edge conditions that would look excessive on a commercial part, and why the inspection standard is documentary rather than conversational.`,
       `We run a foreign object debris programme aligned to the intent of NAS412, scaled to our shop: clean-as-you-go benches, tool control, part protection between operations, and a FOD check built into final inspection.`],
      ['How the work is controlled',
       `We have no design responsibility. We work only to your purchase order, drawing, revision and flow-down requirements, and we do not alter part geometry beyond the operations you order.`,
       `A job traveler opens for each lot before work begins, carrying your PO number, part number, revision and quantity. It stays physically with the parts through every operation, and each operation is signed and dated as it completes. Parts are never separated from their traveler or mixed with another lot.`],
      ['What ships back with your parts',
       `Every shipment goes out with a Certificate of Conformance. Nonconforming material is segregated and you are notified in writing before anything questionable ships — we do not scrap, rework or ship suspect parts without your say-so, because they are your parts.`,
       `Quality records are retained for 40 years, applied uniformly across all customers.`],
      ['On certification, plainly',
       `SC Precision Deburring is not ISO 9001 or AS9100 certified. We run a written quality system — calibration control, FOD prevention, nonconforming material control and root-cause corrective action — and much of our work ships into customers' AS9100-controlled supply chains.`,
       `If certification is a hard requirement on your purchase order, tell us at the RFQ stage and we will say so plainly rather than waste a week of your time.`],
    ],
    faq: [
      ['Are you AS9100 certified?', 'No. We run a documented quality system and our work ships into AS9100-controlled supply chains, but we do not hold the certification ourselves. We say so up front.'],
      ['Do you grant right of access?', 'Yes — to customers, their customers, and regulatory authorities, covering both the facility and the quality records for their work.'],
      ['Can you work to our sampling or source-inspection requirements?', 'Flow-down requirements are identified at PO review and carried on the traveler. Tell us what the PO calls for and we will confirm before accepting the job.'],
    ],
  },
  {
    slug: 'precision-deburring-los-angeles',
    title: 'Precision Deburring Los Angeles | Pickup & Delivery | SC Deburring',
    desc: 'Precision deburring in Los Angeles. We pick up and deliver across the San Fernando Valley, Santa Clarita and Valencia. Quote within one business day.',
    h1: 'Precision deburring in Los Angeles',
    lede: 'We collect the lot and bring it back — parts are not sitting on a freight dock.',
    service: 'Precision Deburring',
    body: [
      ['Where we are, and who we work for',
       `Our shop is at 12734 Branford St, Unit 17, Pacoima, California — inside the San Fernando Valley, in the middle of the aerospace machining corridor that runs from Sun Valley up through Santa Clarita.`,
       `Our customers are precision machine shops. What comes off their CNC machines goes into aerospace, defense, medical and industrial programs. We deburr to the print; the end market is our customer's to know.`],
      ['Pickup and delivery',
       `For regular customers we run the route ourselves rather than handing your parts to a carrier. That covers Pacoima, Sun Valley, Sylmar, San Fernando, Van Nuys, North Hollywood, Burbank, Glendale, Chatsworth, Northridge, Santa Clarita and Valencia.`,
       `Everywhere else in Southern California ships standard freight, and we arrange pickup on larger jobs. Counties served: Los Angeles, Orange, Ventura, San Bernardino, Riverside and San Diego.`],
      ['Why local matters on deburring specifically',
       `Deburring usually sits between two operations that are already scheduled. The lot leaves your floor, has to come back, and every day it spends in transit is a day your own delivery date absorbs.`,
       `Being twenty minutes away is not a convenience feature — on a 3 to 5 day turnaround it is a meaningful share of the total.`],
    ],
    faq: [
      ['Do you pick up from my shop?', 'For regular customers on our Valley, Santa Clarita and Valencia run, yes. Elsewhere in Southern California we arrange freight, and pickup on larger jobs.'],
      ['What are your hours?', 'Monday to Friday, 6:00 AM to 5:00 PM.'],
      ['How fast can I get a quote?', 'Send a print and a quantity and a real number comes back within one business day.'],
    ],
  },
  {
    slug: 'cross-drilled-hole-deburring',
    title: 'Cross-Drilled Hole Deburring | Manifolds & Valve Bodies | SC Deburring',
    desc: 'Deburring cross-drilled and intersecting bores in manifolds, valve bodies and hydraulic fittings. Burrs removed at the intersection without touching the bore.',
    h1: 'Cross-drilled hole deburring',
    lede: 'Where two bores meet is where the burr hides, and where it matters most.',
    service: 'Cross-Drilled Hole Deburring',
    body: [
      ['The problem with an intersection',
       `When a second bore breaks through the wall of the first, the cutter exits into open space and leaves a burr on the far side of the intersection — inside the part, where nothing reaches it and nothing sees it.`,
       `On a manifold with a dozen ports there may be twenty or more of these. Each one is a separate operation, in a different orientation, on a feature that is only visible with the right light and the right magnification.`],
      ['Removing the burr without touching the bore',
       `The constraint is that the bore itself is usually a controlled dimension. Whatever removes the burr must not open the hole, taper the entry, or leave a radius the print does not call for.`,
       `That is why this work is done by hand and verified under magnification rather than run through a process that treats every edge the same. The tool is chosen per material and per geometry — files, blades, pencil grinders, rotary burrs, abrasive wheels.`],
      ['Parts this applies to',
       `Manifolds, valve bodies, hydraulic fittings, spools and sleeves — anything with intersecting bores or internal fluid passages. Materials we work in include stainless, aluminium, titanium, Inconel, brass, copper, Invar, carbon steel and most plastics.`,
       `Lot sizes run from a single prototype piece to fifty thousand, on the same controlled process.`],
    ],
    faq: [
      ['How do you verify a burr inside a bore is gone?', 'Under magnification, with the light placed to show the intersection. Critical features are verified before the lot passes final inspection.'],
      ['Will the bore diameter change?', 'No. We remove the burr only — the bore, the entry and any called-out edge stay as drawn.'],
      ['Can you handle blind intersections?', 'Send the print. If it is not work we should be quoting, we will tell you plainly rather than take the job and find out.'],
    ],
  },
];

const esc = (s) => s.replace(/&(?!\w+;|#)/g, '&amp;');

const page = (p) => {
  const url = `${SITE}/${p.slug}/`;
  const faqLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: p.faq.map(([q, a]) => ({
      '@type': 'Question', name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
  const serviceLd = {
    '@context': 'https://schema.org', '@type': 'Service',
    name: p.service, serviceType: p.service,
    description: p.desc,
    provider: { '@type': 'LocalBusiness', name: 'SC Precision Deburring', '@id': `${SITE}/#business`,
      address: { '@type': 'PostalAddress', streetAddress: '12734 Branford Street Unit #17',
        addressLocality: 'Pacoima', addressRegion: 'CA', postalCode: '91331', addressCountry: 'US' },
      telephone: '+1-818-389-4234' },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Los Angeles County' },
      { '@type': 'AdministrativeArea', name: 'Orange County' },
      { '@type': 'AdministrativeArea', name: 'Ventura County' },
      { '@type': 'AdministrativeArea', name: 'San Bernardino County' },
      { '@type': 'AdministrativeArea', name: 'Riverside County' },
      { '@type': 'AdministrativeArea', name: 'San Diego County' },
    ],
    url,
  };
  const crumbLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: p.h1, item: url },
    ],
  };

  const others = PAGES.filter((o) => o.slug !== p.slug);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${p.title}</title>
<meta name="description" content="${p.desc}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="website">
<meta property="og:title" content="${p.title}">
<meta property="og:description" content="${p.desc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/gallery/yelp-2.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">
<script type="application/ld+json">${JSON.stringify(serviceLd)}</script>
<script type="application/ld+json">${JSON.stringify(faqLd)}</script>
<script type="application/ld+json">${JSON.stringify(crumbLd)}</script>
<style>
:root{--bg:#050505;--panel:#06080a;--line:rgba(255,255,255,.07);--ink:#f4f4f5;--dim:#a1a1aa;--dimmer:#71717a;--acid:#CCFF00;
--sans:"Inter",system-ui,sans-serif;--display:"Space Grotesk",var(--sans)}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--sans);font-size:16px;line-height:1.7;-webkit-font-smoothing:antialiased}
a{color:inherit}
.wrap{max-width:820px;margin:0 auto;padding:0 28px}
header{position:sticky;top:0;z-index:50;background:rgba(5,5,5,.9);backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}
.bar{display:flex;align-items:center;gap:20px;height:70px;max-width:1180px;margin:0 auto;padding:0 28px}
.brand{font-family:var(--display);font-weight:700;font-size:15px;letter-spacing:.2em;text-transform:uppercase;text-decoration:none}
.sp{flex:1}
.btn{display:inline-flex;align-items:center;gap:8px;background:var(--acid);color:#000;font-weight:500;font-size:14px;padding:12px 26px;border-radius:999px;text-decoration:none;border:1px solid var(--acid);transition:all .4s cubic-bezier(.16,1,.3,1)}
.btn:hover{background:transparent;color:var(--acid)}
nav.crumb{font-size:12.5px;color:var(--dimmer);padding:26px 0 0}
nav.crumb a{color:var(--dim);text-decoration:none}
nav.crumb a:hover{color:var(--acid)}
h1{font-family:var(--display);font-weight:500;font-size:clamp(2.1rem,5.4vw,3.6rem);line-height:1.04;letter-spacing:-.03em;margin:26px 0 20px}
.lede{font-size:clamp(1.05rem,2vw,1.3rem);font-weight:300;color:var(--acid);margin:0 0 44px;line-height:1.45}
h2{font-family:var(--display);font-weight:400;font-size:clamp(1.4rem,2.6vw,1.9rem);letter-spacing:-.02em;margin:52px 0 16px}
p{color:#d4d4d8;font-weight:300;margin:0 0 18px}
.faq{margin-top:64px;border-top:1px solid var(--line);padding-top:44px}
.faq h2{margin-top:0}
.q{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:24px 26px;margin-bottom:12px}
.q h3{font-size:16px;font-weight:500;margin:0 0 10px}
.q p{margin:0;font-size:14.5px;color:var(--dim)}
.cta{margin-top:64px;background:var(--panel);border:1px solid rgba(204,255,0,.22);border-radius:16px;padding:34px}
.cta h2{margin:0 0 12px}
.cta p{margin:0 0 22px}
.more{margin-top:64px;border-top:1px solid var(--line);padding-top:34px}
.more span{font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:var(--dimmer)}
.more ul{list-style:none;padding:0;margin:16px 0 0}
.more li{margin-bottom:10px}
.more a{color:var(--dim);text-decoration:none;font-weight:300}
.more a:hover{color:var(--acid)}
footer{margin-top:70px;border-top:1px solid var(--line);padding:34px 0 70px;color:var(--dimmer);font-size:12.5px;font-weight:300;line-height:1.9}
</style>
</head>
<body>
<header><div class="bar">
  <a class="brand" href="/">SC Deburring</a><span class="sp"></span>
  <a class="btn" href="/#contact">Send a print</a>
</div></header>

<div class="wrap">
  <nav class="crumb"><a href="/">Home</a> &rsaquo; ${p.h1}</nav>
  <h1>${p.h1}</h1>
  <p class="lede">${p.lede}</p>

  ${p.body.map(([h, ...ps]) => `<h2>${h}</h2>\n  ${ps.map((x) => `<p>${esc(x)}</p>`).join('\n  ')}`).join('\n\n  ')}

  <div class="faq">
    <h2>Common questions</h2>
    ${p.faq.map(([q, a]) => `<div class="q"><h3>${esc(q)}</h3><p>${esc(a)}</p></div>`).join('\n    ')}
  </div>

  <div class="cta">
    <h2>Send a print</h2>
    <p>A drawing or a photo, a rough quantity, and any spec callouts. A real number comes back within one business day.</p>
    <a class="btn" href="/#contact">Send a print &rarr;</a>
  </div>

  <div class="more">
    <span>Related</span>
    <ul>${others.map((o) => `<li><a href="/${o.slug}/">${o.h1}</a></li>`).join('')}
      <li><a href="/">SC Precision Deburring &mdash; main site</a></li>
    </ul>
  </div>

  <footer>
    SC Precision Deburring &middot; 12734 Branford St, Unit 17, Pacoima, CA 91331 &middot; NAICS 332813<br>
    <a href="tel:+18183894234">(818) 389-4234</a> &middot;
    <a href="mailto:quotes@scprecisiondeburring.com">quotes@scprecisiondeburring.com</a> &middot; Mon&ndash;Fri 6:00 AM &ndash; 5:00 PM
  </footer>
</div>
</body>
</html>`;
};

for (const p of PAGES) {
  const dir = join(ROOT, 'public', p.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), page(p), 'utf8');
  console.log(`  /${p.slug}/`);
}

// ---- rebuild sitemap with every URL ----
const today = new Date().toISOString().slice(0, 10);
const smPath = join(ROOT, 'public', 'sitemap.xml');
let sm = readFileSync(smPath, 'utf8');
sm = sm.replace(/\n  <url>\s*<loc>https:\/\/scprecisiondeburring\.com\/[a-z-]+\/<\/loc>[\s\S]*?<\/url>/g, '');
const entries = PAGES.map((p) => `  <url>
    <loc>${SITE}/${p.slug}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n');
sm = sm.replace('</urlset>', `${entries}\n</urlset>`);
writeFileSync(smPath, sm, 'utf8');
console.log(`  sitemap.xml — ${PAGES.length + 1} URLs`);

/* ------------------------------------------------------------------ *
 * FAQ schema back into index.html as static markup.
 *
 * It previously lived in the React component, which meant it only existed
 * after the bundle ran — and FAQ is lazy-loaded, so it only existed after
 * the visitor scrolled far enough to mount it. Crawlers were served zero
 * FAQPage markup. Generated here from faqData.ts so the copy shown in the
 * UI and the copy given to Google cannot drift apart.
 * ------------------------------------------------------------------ */
const faqSrc = readFileSync(join(ROOT, 'components', 'faqData.ts'), 'utf8');
const qa = [...faqSrc.matchAll(
  /question:\s*(['"`])([\s\S]*?)\1\s*,\s*\n\s*answer:\s*(['"`])([\s\S]*?)\3\s*,/g
)].map((m) => ({ q: m[2], a: m[4] }));

if (!qa.length) {
  console.error('  !! no Q&A parsed from faqData.ts — index.html left untouched');
} else {
  const faqPageLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: qa.map(({ q, a }) => ({
      '@type': 'Question', name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
  const MARK_A = '<!-- FAQ-SCHEMA:START -->';
  const MARK_B = '<!-- FAQ-SCHEMA:END -->';
  const block = `${MARK_A}\n    <script type="application/ld+json">\n${JSON.stringify(faqPageLd, null, 2)}\n    </script>\n    ${MARK_B}`;

  const idxPath = join(ROOT, 'index.html');
  let html = readFileSync(idxPath, 'utf8');
  html = html.includes(MARK_A)
    ? html.replace(new RegExp(`${MARK_A}[\s\S]*?${MARK_B}`), block)
    : html.replace('</head>', `    ${block}\n  </head>`);
  writeFileSync(idxPath, html, 'utf8');
  console.log(`  index.html — FAQPage schema restored, ${qa.length} questions`);
}
