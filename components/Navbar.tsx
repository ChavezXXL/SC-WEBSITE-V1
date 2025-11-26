
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  currentView: 'home' | 'gallery';
  onChangeView: (view: 'home' | 'gallery') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onChangeView }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id?: string, view?: 'home' | 'gallery') => {
    setMobileMenuOpen(false);
    
    const targetView = view || 'home';
    
    if (currentView !== targetView) {
      onChangeView(targetView);
      if (targetView === 'home' && id) {
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          } else {
             window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 100);
      } else if (targetView === 'home') {
         window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      if (id) {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <div className="fixed top-6 inset-x-0 z-50 flex justify-center pointer-events-none">
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-auto transition-all duration-500 ease-out mx-4 ${
            scrolled || mobileMenuOpen
              ? 'bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 py-3 px-6 rounded-full w-full max-w-5xl' 
              : 'bg-transparent border-transparent py-4 px-6 w-full max-w-7xl'
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div 
              onClick={() => handleNavClick(undefined, 'home')}
              className="flex items-center gap-3 cursor-pointer group relative z-50"
            >
              {!logoError ? (
                <img 
                  src="https://i.imgur.com/wbRrGxM.png" 
                  onError={() => setLogoError(true)}
                  alt="SC Deburring" 
                  className={`object-contain transition-all duration-300 ${scrolled ? 'h-10' : 'h-12 md:h-14'}`}
                />
              ) : (
                <span className="font-space font-bold text-white text-lg tracking-wide group-hover:text-blue-200 transition-colors">
                  SC<span className="text-[#00FFBD]">DEBURRING</span>
                </span>
              )}
            </div>

            {/* Desktop Links - Centered if possible, but kept right for standard nav feel */}
            <div className={`hidden md:flex items-center gap-1 transition-all duration-300 ${scrolled ? 'bg-transparent' : 'bg-black/20 backdrop-blur-md rounded-full px-2 py-1 border border-white/5'}`}>
              {[
                { name: 'Process', id: 'process', view: 'home' },
                { name: 'Industries', id: 'industries', view: 'home' },
                { name: 'Capabilities', id: 'services', view: 'home' },
                { name: 'Gallery', id: undefined, view: 'gallery' },
              ].map((item) => (
                <button 
                  key={item.name} 
                  onClick={() => handleNavClick(item.id, item.view as 'home' | 'gallery')} 
                  className={`relative px-5 py-2 text-xs font-medium uppercase tracking-widest rounded-full transition-all duration-300 group overflow-hidden ${
                    currentView === item.view && !item.id && item.view === 'gallery'
                      ? 'text-black bg-white' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  {/* Hover Glint */}
                  <span className="absolute inset-0 bg-white/5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full"></span>
                </button>
              ))}
              
              <div className="w-[1px] h-4 bg-zinc-800 mx-2"></div>

              <button 
                onClick={() => handleNavClick('contact', 'home')}
                className="px-5 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-blue-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transform hover:scale-105"
              >
                Get Quote
              </button>
            </div>

            {/* Mobile Toggle */}
            <button 
              className="md:hidden text-white p-2 relative z-50 bg-white/10 rounded-full backdrop-blur-md"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-40 bg-black/90 md:hidden flex items-center justify-center"
          >
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center gap-8"
            >
              {[
                 { name: 'Process', id: 'process', view: 'home' },
                 { name: 'Industries', id: 'industries', view: 'home' },
                 { name: 'Services', id: 'services', view: 'home' },
                 { name: 'Gallery', id: undefined, view: 'gallery' },
                 { name: 'Contact', id: 'contact', view: 'home' }
              ].map((item) => (
                <button 
                  key={item.name} 
                  onClick={() => handleNavClick(item.id, item.view as 'home' | 'gallery')}
                  className="text-2xl font-light text-white tracking-widest uppercase hover:text-[#00FFBD] transition-colors"
                >
                  {item.name}
                </button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
