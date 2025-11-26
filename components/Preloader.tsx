
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Preloader = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate asset loading time for the effect
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
                    className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white font-space tracking-tighter">
                            SC<span className="text-[#00FFBD]">DEBURRING</span>
                        </h1>
                        <div className="mt-6 w-48 h-[1px] bg-zinc-900 overflow-hidden relative">
                            <motion.div 
                                initial={{ x: "-100%" }}
                                animate={{ x: "0%" }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                className="absolute inset-0 bg-[#00FFBD]"
                            />
                        </div>
                        <div className="mt-2 text-xs text-zinc-600 uppercase tracking-widest font-mono">
                            System Initializing
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
