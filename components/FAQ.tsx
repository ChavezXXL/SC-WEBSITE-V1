
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "What kind of parts do you deburr?",
    answer: "We deburr everything from aerospace, medical, and automotive parts to general machine shop work. If it has sharp edges or needs a clean finish, we handle it."
  },
  {
    question: "Do you handle both small and large orders?",
    answer: "Yes. We can take on anything from one-off prototypes to big production runs—no job is too small or too big."
  },
  {
    question: "How fast can you turn around a job?",
    answer: "Most jobs are done in a few days, sometimes sooner. Need it fast? Let us know—we’ll work with your timeline."
  },
  {
    question: "Can you pick up and deliver parts?",
    answer: "Yes, we offer local pickup and delivery for our regular customers. For others, just ask and we’ll see what we can do."
  },
  {
    question: "What do you need to quote a job?",
    answer: "Just send us a photo or drawing, your part count, and any specs. We’ll get you a quote fast."
  }
];

export const FAQ: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-zinc-950 border-t border-white/5">
      {/* Tab / Trigger Area */}
      <div className="container mx-auto px-6 py-8 flex justify-center">
        <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`
                group relative flex items-center gap-3 px-8 py-3 rounded-full 
                transition-all duration-300 ease-out border
                ${isOpen 
                    ? 'bg-[#00FFBD]/10 text-[#00FFBD] border-[#00FFBD]/30 shadow-[0_0_20px_rgba(0,255,189,0.15)]' 
                    : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
                }
            `}
        >
            <HelpCircle className={`w-4 h-4 transition-colors ${isOpen ? 'text-[#00FFBD]' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
            <span className="text-xs font-bold uppercase tracking-widest">
                {isOpen ? 'Close Q&A' : 'Have Questions? View FAQ'}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Collapsible Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="relative py-24 bg-[#0b0f2b] border-t border-[#00FFBD]/20 shadow-inner shadow-black/50">
                {/* Background Blob Animation */}
                <motion.div 
                    animate={{ 
                    y: [0, 50, -70, 0],
                    scale: [1, 1.06, 1.01, 1] 
                    }}
                    transition={{ 
                    duration: 17, 
                    ease: "easeInOut", 
                    repeat: Infinity, 
                    repeatType: "reverse" 
                    }}
                    className="absolute right-[-10%] top-[20%] w-[600px] h-[600px] rounded-full bg-[#00ffbd]/10 blur-[90px] pointer-events-none"
                />

                <div className="container mx-auto px-6 relative z-10 max-w-4xl">
                    <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-3xl md:text-5xl font-black text-center mb-12 tracking-tight"
                    >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-[#00FFBD]">
                        Frequently Asked Questions
                    </span>
                    </motion.h2>

                    <div className="flex flex-col gap-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05, duration: 0.4 }}
                        className={`
                            group rounded-2xl border-[1px] overflow-hidden transition-all duration-300
                            ${openIndex === index 
                            ? 'bg-[#122041] border-[#00FFBD]/40 shadow-[0_4px_20px_rgba(0,255,189,0.1)]' 
                            : 'bg-[#122041]/30 border-[#00FFBD]/10 hover:bg-[#122041]/60 hover:border-[#00FFBD]/20'}
                        `}
                        >
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="w-full text-left px-6 py-6 flex items-center justify-between gap-6 outline-none"
                        >
                            <span className={`text-lg font-bold transition-colors ${openIndex === index ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                            {faq.question}
                            </span>
                            
                            {/* Custom Animated Icon */}
                            <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center transition-transform duration-500 ${openIndex === index ? 'rotate-[45deg] scale-110' : 'rotate-0'}`}>
                            <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                                <circle cx="18" cy="18" r="16" stroke="#00FFBD" strokeWidth="2.5" className="opacity-80"/>
                                <line x1="18" y1="11" x2="18" y2="25" stroke="#00FFBD" strokeWidth="2.5" strokeLinecap="round"/>
                                <line x1="11" y1="18" x2="25" y2="18" stroke="#00FFBD" strokeWidth="2.5" strokeLinecap="round"/>
                            </svg>
                            </div>
                        </button>

                        <AnimatePresence>
                            {openIndex === index && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                            >
                                <div className="px-6 pb-8 text-base leading-relaxed text-[#d8ffe9]/80 font-light max-w-3xl">
                                {faq.answer}
                                </div>
                            </motion.div>
                            )}
                        </AnimatePresence>
                        </motion.div>
                    ))}
                    </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
