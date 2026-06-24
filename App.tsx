
import React, { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Industries } from './components/Industries';
import { Process } from './components/Process';
import { Preloader } from './components/Preloader';
import { ComparisonSection } from './components/ComparisonSection';
import { MicroscopeSection } from './components/MicroscopeSection';
import { ManualSection } from './components/ManualSection';
import { BlendingSection } from './components/BlendingSection';
import { ServicesIntro } from './components/ServicesIntro';
import { PrecisionCTA } from './components/PrecisionCTA';
import { DataProvider } from './components/DataContext';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy-loaded — below the fold or rarely-used. Reduces initial JS bundle.
const Contact = lazy(() => import('./components/Contact').then(m => ({ default: m.Contact })));
const FAQ = lazy(() => import('./components/FAQ').then(m => ({ default: m.FAQ })));
const Gallery = lazy(() => import('./components/Gallery').then(m => ({ default: m.Gallery })));
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
import { Facebook, Instagram, Youtube, Lock, ArrowRight } from 'lucide-react';
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

  return <div ref={nodeRef} className="text-4xl md:text-5xl font-bold text-white tracking-tighter tabular-nums" />;
};

// Visual breath between scroll-driven service sections
const SectionGap: React.FC = () => (
  <div className="relative h-32 md:h-40 bg-[#030305] flex items-center justify-center">
    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#00FFBD]/30 to-transparent" />
  </div>
);

function App() {
  const [view, setView] = useState<'home' | 'gallery' | 'admin'>('home');

  // Always start at top when switching views
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [view]);

  const handleAdminAccess = () => {
    // Cosmetic, owner-only gate (all admin data is per-browser localStorage, so
    // this is not real security). The password comes from a build-time env var
    // (VITE_ADMIN_PASSWORD) so it isn't committed in the source; set it in
    // Netlify → Site configuration → Environment variables. Falls back to a
    // default only if unset.
    const expected = ((import.meta as any).env?.VITE_ADMIN_PASSWORD as string | undefined) || 'sc-admin';
    const password = prompt("Enter Admin Password:");
    if (password === expected) {
        setView('admin');
    } else if (password) {
        alert("Incorrect password.");
    }
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
      <Preloader />
      <div className="min-h-screen bg-[#030305] text-white selection:bg-blue-500/30 selection:text-blue-200 font-sans">
        <Navbar 
          currentView={view === 'gallery' ? 'gallery' : 'home'} 
          onChangeView={(v) => setView(v)} 
        />
        
        <main>
          {view === 'home' ? (
            <>
              <Hero />
              
              {/* Intro / Stats Section */}
              <section className="py-32 border-b border-white/5 bg-[#030305] relative z-20">
                <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                  <div className="space-y-3">
                     <Counter from={0} to={10} suffix="+" />
                     <div className="text-xs md:text-sm text-zinc-500 uppercase tracking-widest font-medium">Expert Employees</div>
                  </div>
                  <div className="space-y-3">
                     <Counter from={0} to={45} suffix="+" />
                     <div className="text-xs md:text-sm text-zinc-500 uppercase tracking-widest font-medium">Industry Years</div>
                  </div>
                  <div className="space-y-3">
                     <Counter from={0} to={100} suffix="+" />
                     <div className="text-xs md:text-sm text-zinc-500 uppercase tracking-widest font-medium">Satisfied Clients</div>
                  </div>
                  <div className="space-y-3">
                     <Counter from={0} to={100} suffix="%" />
                     <div className="text-xs md:text-sm text-zinc-500 uppercase tracking-widest font-medium">Scope-Inspected</div>
                  </div>
                </div>
              </section>

              {/* Comparison Section - New Addition */}
              <ComparisonSection />

              {/* Process Section with ID for navigation */}
              <div id="process">
                <Process />
              </div>

              {/* Industries Section with ID for navigation */}
              <div id="industries" className="py-24">
                <Industries />
              </div>

              {/* Services — intro + scroll-driven breakdowns (anchor for nav) */}
              <div id="services">
                <ServicesIntro />
                <MicroscopeSection />
                <SectionGap />
                <ManualSection />
                <SectionGap />
                <BlendingSection />
              </div>

              {/* Call to Action Strip */}
              <PrecisionCTA />

              {/* Contact Section with ID */}
              <div id="contact">
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

        <footer className="bg-[#020202] py-12 border-t border-white/5 text-center relative group">
          <div className="container mx-auto px-6 flex flex-col items-center justify-center gap-6 text-zinc-600 text-sm">
            
            <div className="flex flex-col items-center gap-2">
              <span className="block font-bold text-zinc-400 text-lg tracking-wide">SC DEBURRING</span>
              <p>© {new Date().getFullYear()} SC Precision Deburring. All rights reserved.</p>
            </div>

            <div className="flex items-center gap-6">
                 {/* Social Icons */}
                 <a href="https://www.facebook.com/scdeburring/about/" target="_blank" rel="noopener noreferrer" aria-label="SC Deburring on Facebook" className="text-zinc-500 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
                 <a href="https://www.instagram.com/scdeburringllc/" target="_blank" rel="noopener noreferrer" aria-label="SC Deburring on Instagram" className="text-zinc-500 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                 <a href="https://www.youtube.com/@SCDEBURRING" target="_blank" rel="noopener noreferrer" aria-label="SC Deburring on YouTube" className="text-zinc-500 hover:text-white transition-colors"><Youtube className="w-5 h-5" /></a>
                 <a href="https://www.tiktok.com/@sc.deburring" target="_blank" rel="noopener noreferrer" aria-label="SC Deburring on TikTok" className="text-zinc-500 hover:text-white transition-colors">
                    {/* TikTok Icon */}
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                    </svg>
                 </a>
            </div>
          </div>
          
          {/* Hidden Admin Trigger */}
          <div className="absolute bottom-2 right-2 opacity-5 hover:opacity-50 transition-opacity duration-300">
             <button onClick={handleAdminAccess} className="p-2" title="Staff Access" aria-label="Staff Access">
                <Lock className="w-3 h-3 text-zinc-500" />
             </button>
          </div>
        </footer>
      </div>
    </DataProvider>
  );
}

export default App;
