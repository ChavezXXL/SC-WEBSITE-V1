
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Maximize2, X, Loader2 } from 'lucide-react';
import { useData } from './DataContext';
import { GalleryItem } from '../types';

interface GalleryProps {
  onBack: () => void;
}

const GalleryCard: React.FC<{ item: GalleryItem, index: number, onClick: () => void }> = ({ item, index, onClick }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className="group relative aspect-square bg-[#111] overflow-hidden cursor-pointer"
    >
      {/* Loading Placeholder */}
      <div className={`absolute inset-0 flex items-center justify-center bg-[#111] transition-opacity duration-500 ${loaded ? 'opacity-0' : 'opacity-100'}`}>
        <Loader2 className="w-6 h-6 text-zinc-700 animate-spin" />
      </div>

      {/* Image */}
      <img
        src={item.url}
        alt={item.title}
        onLoad={() => setLoaded(true)}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] opacity-90 group-hover:opacity-100"
      />

      {/* Subtle Dark Overlay */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />

      {/* Hover Information */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="relative z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
           <span className="block text-white font-medium uppercase tracking-widest text-xs mb-1">Project</span>
           <span className="block text-white font-space text-lg leading-tight">{item.title}</span>
        </div>
      </div>
      
      {/* Zoom Icon */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-full text-white">
              <Maximize2 className="w-4 h-4" />
          </div>
      </div>
    </motion.div>
  );
};

export const Gallery: React.FC<GalleryProps> = ({ onBack }) => {
  const { galleryItems } = useData();
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white animate-in fade-in duration-700 font-sans">
      
      <div className="fixed top-0 left-0 w-full z-40 p-6 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
         <button 
            onClick={onBack}
            className="pointer-events-auto flex items-center gap-2 text-white/70 hover:text-white transition-colors group px-5 py-2.5 rounded-full border border-white/10 bg-black/40 backdrop-blur-md hover:bg-white/10"
         >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs uppercase tracking-widest font-medium">Return Home</span>
         </button>
      </div>

      <div className="pt-32 pb-16 px-6 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold uppercase tracking-tight mb-6 font-space"
        >
          Portfolio
        </motion.h2>
        <motion.div 
            initial={{ height: 0 }}
            animate={{ height: 60 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-[1px] bg-zinc-800 mx-auto mb-6"
        />
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-zinc-500 max-w-lg mx-auto text-sm uppercase tracking-widest"
        >
          Precision Engineering in Focus
        </motion.p>
      </div>

      {/* Gallery Grid - Masonry-ish feel */}
      <div className="px-4 md:px-8 pb-32">
        {galleryItems.length === 0 ? (
            <div className="text-center text-zinc-800 py-32 uppercase tracking-widest">Gallery Empty</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 max-w-[1600px] mx-auto">
            {galleryItems.map((item, idx) => (
                <GalleryCard 
                key={item.id} 
                item={item} 
                index={idx} 
                onClick={() => setSelectedImage(item)} 
                />
            ))}
            </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-[101]"
            >
              <X className="w-8 h-8" />
            </button>

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-full h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedImage.url} 
                alt={selectedImage.title}
                className="max-w-full max-h-[85vh] object-contain shadow-2xl"
              />
              <div className="mt-8 text-center">
                  <h3 className="text-white text-xl font-space font-medium tracking-wide">{selectedImage.title}</h3>
                  <p className="text-zinc-500 text-xs uppercase tracking-widest mt-2">SC Precision Deburring</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
