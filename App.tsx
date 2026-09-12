
import React, { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Industries } from './components/Industries';
import { Process } from './components/Process';
import { ComparisonSection } from './components/ComparisonSection';
import { MicroscopeSection } from './components/MicroscopeSection';
import { ManualSection } from './components/ManualSection';
import { BlendingSection } from './components/BlendingSection';
import { ServicesIntro } from './components/ServicesIntro';
import { AlsoOffered } from './components/AlsoOffered';
import { ServiceArea } from './components/ServiceArea';
import { DataProvider } from './components/DataContext';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy-loaded — below the fold or rarely-used. Reduces initial JS bundle.
const Contact = lazy(() => import('./components/Contact').then(m => ({ default: m.Contact })));
const FAQ = lazy(() => import('./components/FAQ').then(m => ({ default: m.FAQ })));
const Gallery = lazy(() => import('./components/Gallery').then(m => ({ default: m.Gallery })));
const AdminDashboard = import.meta.env.DEV ? lazy(() => import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard }))) : () => null;
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { motion, useInView, animate } from 'framer-motion';

// Animated Counter Component
const Counter = ({ from, to, duration = 2, suffix = "" }: { from: number; to: number; duration?: number; suffix?: string }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!nodeRef.current || !isInView) return;

    const node = nodeRef.current;
    const controls = animate(from, to, {
      duration,
      onUpdate(value) {
        node.textContent = Math.round(value).toLocaleString() + suffix;
      },
      ease: "easeOut"
    });

    return () => controls.stop();
  }, [from, to, duration, isInView, suffix]);

  return <div ref={nodeRef} className="text-4xl md:text-5xl font-bold text-white tracking-tighter tabular-nums">{from.toLocaleString() + suffix}</div>;
};

// Visual breath between scroll-driven service sections
const SectionGap: React.FC = () => (
  <div className="relative h-32 md:h-40 bg-[#030305] flex items-center justify-center">
    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#CCFF00]/30 to-transparent" />
  </div>
);

function App() {
  const [view, setView] = useState<'home' | 'gallery' | 'admin'>('home');

  // Always start at top when switching views
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [view]);

  // Staff access lives at /#admin (off the public footer). Works on load and
  // when the hash is typed later.
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        // clear the hash so cancelling the prompt doesn't retrigger on refresh
        history.replaceState(null, '', window.location.pathname);
        handleAdminAccess();
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdminAccess = () => {
    if (import.meta.env.DEV) setView('admin');
  };

  if (view === 'admin') {
    return (
      <DataProvider>
        <ErrorBoundary>
          <Suspense fallback={<div className="min-h-screen bg-[#030305] flex items-center justify-center text-zinc-500 font-mono text-xs uppercase tracking-widest">Loading…</div>}>
            <AdminDashboard onExit={() => setView('home')} />
          </Suspense>
        </ErrorBoundary>
      </DataProvider>
    );
  }

  return (
    <DataProvider>
      <div className="min-h-screen bg-[#030305] text-white selection:bg-[#CCFF00]/30 selection:text-[#E4FF7A] font-sans">
        <Navbar 
          currentView={view === 'gallery' ? 'gallery' : 'home'} 
          onChangeView={(v) => setView(v)} 
        />
        
        <main>
          {view === 'home' ? (
            <>
              <Hero />
              
              {/* Intro / Stats Section
                  "100% Microscope-Inspected" was ambiguous — it read as though
                  every square millimetre of every part goes under a scope. The
                  defensible version is the one we actually run: every lot gets a
                  final inspection, and the critical features are the ones
                  verified under magnification. Stated as two separate facts. */}
              <section className="py-32 border-b border-white/5 bg-[#030305] relative z-20">
                <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
                  <div className="space-y-3">
                     <Counter from={0} to={10} suffix="+" />
                     <div className="text-xs md:text-sm text-zinc-400 uppercase tracking-widest font-medium">Deburr Technicians</div>
                  </div>
                  <div className="space-y-3">
                     <Counter from={0} to={45} suffix="+" />
                     <div className="text-xs md:text-sm text-zinc-400 uppercase tracking-widest font-medium">Years Combined Experience</div>
                  </div>
                  <div className="space-y-3">
                     <Counter from={0} to={100} suffix="%" />
                     <div className="text-xs md:text-sm text-zinc-400 uppercase tracking-widest font-medium">Final Inspection</div>
                  </div>
                </div>
                <p className="container mx-auto px-6 mt-10 text-center text-xs md:text-sm text-zinc-500 font-light tracking-wide">
                  Critical features verified under magnification.
                </p>
              </section>

              {/* Comparison Section - New Addition */}
              <ComparisonSection />

              {/* Process Section (anchor id lives on the section itself, which
                  carries scroll-mt for the fixed navbar) */}
              <div>
                <Process />
              </div>

              {/* Industries Section (anchor id on the section itself) */}
              <div className="py-24">
                <Industries />
              </div>

              {/* Services — intro + scroll-driven breakdowns (anchor for nav).
                  No scroll offset: the intro is a full-viewport centered section,
                  so a flush landing frames it perfectly. */}
              <div id="services">
                <ServicesIntro />
                <MicroscopeSection />
                <SectionGap />
                <ManualSection />
                <SectionGap />
                <BlendingSection />
              </div>


              {/* Secondary capabilities — marking, final inspection, local pickup & delivery */}
              <AlsoOffered />

              {/* Local service area — answers "do you cover me?" and carries the
                  local search signal the schema claims but the body never backed */}
              <ServiceArea />


              {/* Contact Section (anchor id on the section inside Contact) */}
              <div>
                <ErrorBoundary>
                  <Suspense fallback={<div className="h-32 bg-[#030305]" />}>
                    <Contact />
                  </Suspense>
                </ErrorBoundary>
              </div>

              {/* FAQ Section - Moved below Contact as requested */}
              <ErrorBoundary>
                <Suspense fallback={<div className="h-32 bg-[#030305]" />}>
                  <FAQ />
                </Suspense>
              </ErrorBoundary>
            </>
          ) : (
            <ErrorBoundary>
              <Suspense fallback={<div className="min-h-screen bg-[#030305] flex items-center justify-center text-zinc-500 font-mono text-xs uppercase tracking-widest">Loading gallery…</div>}>
                <Gallery onBack={() => setView('home')} />
              </Suspense>
            </ErrorBoundary>
          )}
        </main>

        <footer className="bg-[#020202] py-14 border-t border-white/5 text-center relative">
          <div className="container mx-auto px-6 flex flex-col items-center justify-center gap-8 text-zinc-600 text-sm">

            <div className="flex flex-col items-center gap-2">
              <span className="block font-bold text-zinc-300 text-lg tracking-wide">SC DEBURRING</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600">Precision Deburring &amp; Finishing</span>
            </div>

            {/* NAP block — matches the LocalBusiness schema exactly */}
            <div className="flex flex-col items-center gap-0 text-zinc-400">
              <a
                href="https://www.google.com/maps/search/?api=1&query=12734+Branford+St+Unit+17+Pacoima+CA+91331"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] flex items-center px-2 text-center hover:text-[#CCFF00] transition-colors"
              >
                12734 Branford St, Unit 17, Pacoima, CA 91331
              </a>
              <a href="tel:+18183894234" className="min-h-[44px] flex items-center px-2 hover:text-[#CCFF00] transition-colors">(818) 389-4234</a>
              <a href="mailto:quotes@scprecisiondeburring.com" className="min-h-[44px] flex items-center px-2 text-center hover:text-[#CCFF00] transition-colors">quotes@scprecisiondeburring.com</a>
              <span className="py-2.5 text-zinc-500">Mon–Fri · 6:00 AM – 5:00 PM</span>
            </div>

            {/* Landing pages. Generated by scripts/build-landing-pages.mjs into
                public/<slug>/, so these are plain document navigations, not client
                routes. Without them the four pages are orphans — listed in the
                sitemap but linked from nowhere, which is the weakest possible
                signal you can send about a page you want ranked. */}
            <nav aria-label="Deburring services" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-0 max-w-2xl">
              {[
                ['/microscope-deburring/', 'Microscope deburring'],
                ['/aerospace-deburring/', 'Aerospace deburring'],
                ['/precision-deburring-los-angeles/', 'Precision deburring in Los Angeles'],
                ['/cross-drilled-hole-deburring/', 'Cross-drilled hole deburring'],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className="min-h-[44px] inline-flex items-center px-1 text-[13px] text-zinc-500 hover:text-[#CCFF00] transition-colors duration-300"
                >
                  {label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-1">
                 {/* Social Icons — p-3 around a 20px icon lands the hit area at
                     44px without changing how big the icon looks. */}
                 <a href="https://www.facebook.com/scdeburring/about/" target="_blank" rel="noopener noreferrer" aria-label="SC Deburring on Facebook" className="p-3 text-zinc-500 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
                 <a href="https://www.instagram.com/scdeburringllc/" target="_blank" rel="noopener noreferrer" aria-label="SC Deburring on Instagram" className="p-3 text-zinc-500 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                 <a href="https://www.youtube.com/@SCDEBURRING" target="_blank" rel="noopener noreferrer" aria-label="SC Deburring on YouTube" className="p-3 text-zinc-500 hover:text-white transition-colors"><Youtube className="w-5 h-5" /></a>
                 <a href="https://www.tiktok.com/@sc.deburring" target="_blank" rel="noopener noreferrer" aria-label="SC Deburring on TikTok" className="p-3 text-zinc-500 hover:text-white transition-colors">
                    {/* TikTok Icon */}
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                    </svg>
                 </a>
            </div>

            <p className="text-zinc-600">© {new Date().getFullYear()} SC Precision Deburring. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </DataProvider>
  );
}

export default App;
