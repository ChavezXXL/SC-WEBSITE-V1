
import React, { useEffect, useState, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Contact } from './components/Contact';
import { Industries } from './components/Industries';
import { Process } from './components/Process';
import { Gallery } from './components/Gallery';
import { AdminDashboard } from './components/AdminDashboard';
import { Preloader } from './components/Preloader';
import { ComparisonSection } from './components/ComparisonSection';
import { FAQ } from './components/FAQ';
import { DataProvider } from './components/DataContext';
import { Facebook, Instagram, Youtube, Lock } from 'lucide-react';
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

function App() {
  const [view, setView] = useState<'home' | 'gallery' | 'admin'>('home');
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);

  const handleAdminAccess = () => {
    const password = prompt("Enter Admin Password:");
    if (password === "admin") {
        setView('admin');
    } else if (password) {
        alert("Incorrect password.");
    }
  };

  if (view === 'admin') {
    return (
      <DataProvider>
        <AdminDashboard onExit={() => setView('home')} />
      </DataProvider>
    );
  }

  return (
    <DataProvider>
      <Preloader />
      <div className="min-h-screen bg-[#030305] text-white selection:bg-blue-500/30 selection:text-blue-200 font-sans">
        <Navbar currentView={view} onChangeView={(v) => setView(v)} />
        
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
                     <div className="text-4xl md:text-5xl font-bold text-white tracking-tighter">ISO</div>
                     <div className="text-xs md:text-sm text-zinc-500 uppercase tracking-widest font-medium">9001:2015 Certified</div>
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

              {/* Services Section with ID for navigation */}
              <div id="services">
                <Services />
              </div>
              
              {/* Call to Action Strip */}
              <section className="py-40 bg-zinc-900 relative overflow-hidden">
                 <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
                   <div className="max-w-4xl">
                     <h2 className="text-4xl md:text-7xl font-bold mb-8 tracking-tight text-white">
                       Precision is not an option.
                     </h2>
                     <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto font-light">
                       It is the absolute requirement. We handle the finishing touches that ensure safety, performance, and longevity.
                     </p>
                     <div className="flex flex-wrap justify-center gap-4">
                       {['Aerospace', 'Medical Devices', 'Automotive', 'Hydraulics'].map((tag) => (
                          <span key={tag} className="px-6 py-2 border border-white/10 bg-white/5 rounded-full text-sm font-medium text-zinc-300 hover:border-white/30 transition-colors">
                            {tag}
                          </span>
                       ))}
                     </div>
                   </div>
                 </div>
                 
                 {/* Abstract Background Decoration */}
                 <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                    <div className="absolute top-[-50%] left-[-20%] w-[800px] h-[800px] rounded-full bg-blue-900 blur-[120px]"></div>
                    <div className="absolute bottom-[-50%] right-[-20%] w-[800px] h-[800px] rounded-full bg-cyan-900 blur-[120px]"></div>
                 </div>
              </section>

              {/* Contact Section with ID */}
              <div id="contact">
                <Contact />
              </div>

              {/* FAQ Section - Moved below Contact as requested */}
              <FAQ />
            </>
          ) : (
            <Gallery onBack={() => setView('home')} />
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
                 <a href="https://www.facebook.com/scdeburring/about/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
                 <a href="https://www.instagram.com/scdeburringllc/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                 <a href="https://www.youtube.com/@SCDEBURRING" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors"><Youtube className="w-5 h-5" /></a>
                 <a href="https://www.tiktok.com/@sc.deburring" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
                    {/* TikTok Icon */}
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                    </svg>
                 </a>
            </div>
          </div>
          
          {/* Hidden Admin Trigger */}
          <div className="absolute bottom-2 right-2 opacity-5 hover:opacity-50 transition-opacity duration-300">
             <button onClick={handleAdminAccess} className="p-2" title="Staff Access">
                <Lock className="w-3 h-3 text-zinc-500" />
             </button>
          </div>
        </footer>
      </div>
    </DataProvider>
  );
}

export default App;
