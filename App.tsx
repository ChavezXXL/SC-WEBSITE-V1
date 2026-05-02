
import React, { useEffect, useState, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Contact } from './components/Contact';
import { Industries } from './components/Industries';
import { Process } from './components/Process';
import { Gallery } from './components/Gallery';
import { AdminDashboard } from './components/AdminDashboard';
import { Preloader } from './components/Preloader';
import { ComparisonSection } from './components/ComparisonSection';
import { FAQ } from './components/FAQ';
import { MicroscopeSection } from './components/MicroscopeSection';
import { ManualSection } from './components/ManualSection';
import { BlendingSection } from './components/BlendingSection';
import { ServicesIntro } from './components/ServicesIntro';
import { DataProvider } from './components/DataContext';
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
                     <div className="text-4xl md:text-5xl font-bold text-white tracking-tighter">ISO</div>
                     <div className="text-xs md:text-sm text-zinc-500 uppercase tracking-widest font-medium">9001:2015 Compliance</div>
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
              <section className="py-32 md:py-44 relative overflow-hidden bg-gradient-to-b from-[#030305] via-[#0a1628] to-[#030305]">
                 <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
                   <div className="max-w-5xl">
                     <motion.div
                       initial={{ opacity: 0, y: 30 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }}
                       transition={{ duration: 0.8 }}
                     >
                       <p className="text-sm md:text-base uppercase tracking-[0.3em] text-blue-400 font-medium mb-6">The Standard We Set</p>
                       <h2 className="text-4xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight">
                         <span className="text-white">Precision is </span>
                         <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">not an option.</span>
                       </h2>
                       <p className="text-lg md:text-2xl text-zinc-400 mb-14 max-w-2xl mx-auto font-light leading-relaxed">
                         It is the absolute requirement. We handle the finishing touches that ensure safety, performance, and longevity.
                       </p>
                     </motion.div>
                     <motion.div
                       initial={{ opacity: 0, y: 20 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }}
                       transition={{ duration: 0.8, delay: 0.2 }}
                       className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12"
                     >
                       {['Aerospace', 'Medical Devices', 'Automotive', 'Hydraulics'].map((tag) => (
                          <span key={tag} className="px-5 md:px-7 py-2.5 border border-blue-500/20 bg-blue-500/5 rounded-full text-sm font-medium text-blue-200 hover:border-blue-400/50 hover:bg-blue-500/10 transition-all duration-300 cursor-default">
                            {tag}
                          </span>
                       ))}
                     </motion.div>
                     <motion.div
                       initial={{ opacity: 0 }}
                       whileInView={{ opacity: 1 }}
                       viewport={{ once: true }}
                       transition={{ duration: 0.8, delay: 0.4 }}
                     >
                       <a
                         href="#contact"
                         onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                         className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold text-sm uppercase tracking-wider rounded-full hover:bg-blue-50 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_50px_rgba(255,255,255,0.25)] transform hover:scale-105"
                       >
                         Get a Free Quote
                         <ArrowRight className="w-4 h-4" />
                       </a>
                     </motion.div>
                   </div>
                 </div>

                 {/* Animated Background */}
                 <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-30%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/8 blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-30%] right-[-10%] w-[700px] h-[700px] rounded-full bg-cyan-600/8 blur-[150px] animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] rounded-full bg-teal-500/5 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                 </div>

                 {/* Decorative lines */}
                 <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
                 <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
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
