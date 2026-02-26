
import React, { useState, useRef } from 'react';
import { Mail, Phone, MapPin, Check, UploadCloud, FileText, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Contact: React.FC = () => {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [showFileReminder, setShowFileReminder] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Microscope Deburring',
    details: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = (text: string, type: 'phone' | 'email' | 'address') => {
    navigator.clipboard.writeText(text);
    if (type === 'phone') {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } else if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openEmailDraft = () => {
    const subject = encodeURIComponent(`Project Inquiry: ${formData.service} - ${formData.name}`);
    
    let rawBody = `Name: ${formData.name}\n`;
    rawBody += `Email: ${formData.email}\n`;
    rawBody += `Service: ${formData.service}\n\n`;
    rawBody += `Project Details:\n${formData.details}\n\n`;
    
    if (fileName) {
        rawBody += `\n[ATTACHMENT REMINDER: Please attach the file "${fileName}" manually to this email]`;
    }

    const body = encodeURIComponent(rawBody);
    window.location.href = `mailto:SCPRECISIONDEBURRING@GMAIL.COM?subject=${subject}&body=${body}`;
    setShowFileReminder(false);
    
    // Reset form after a brief delay to allow the mailto to fire
    setTimeout(() => {
        setFormData({ name: '', email: '', service: 'Microscope Deburring', details: '' });
        setFileName(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (fileName) {
        setShowFileReminder(true);
    } else {
        openEmailDraft();
    }
  };

  return (
    <section id="contact" className="py-24 bg-zinc-950 border-t border-zinc-900 relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column - Contact Info */}
          <div>
            <h2 className="text-4xl font-bold text-white mb-6">Let's discuss your project.</h2>
            <p className="text-zinc-400 mb-10 text-lg">
              Reach out to our engineering team for technical specs, lead times, or a custom quote.
            </p>

            <div className="space-y-6">
              {/* Phone */}
              <div 
                className="flex items-start gap-4 cursor-pointer group"
                onClick={() => handleCopy('(818) 389-4234', 'phone')}
                title="Click to copy phone number"
              >
                <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 text-blue-400 group-hover:border-blue-500 transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-medium flex items-center gap-2">
                    Call Us
                    {copiedPhone && <span className="text-xs text-green-400 font-normal flex items-center animate-in fade-in slide-in-from-left-2"><Check className="w-3 h-3 mr-1"/> Copied</span>}
                  </h4>
                  <p className="text-zinc-500 group-hover:text-blue-400 transition-colors">(818) 389-4234</p>
                </div>
              </div>
              
              {/* Email */}
              <div 
                className="flex items-start gap-4 cursor-pointer group"
                onClick={() => handleCopy('SCPRECISIONDEBURRING@GMAIL.COM', 'email')}
                title="Click to copy email address"
              >
                <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 text-blue-400 group-hover:border-blue-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-medium flex items-center gap-2">
                    Email Us
                    {copiedEmail && <span className="text-xs text-green-400 font-normal flex items-center animate-in fade-in slide-in-from-left-2"><Check className="w-3 h-3 mr-1"/> Copied</span>}
                  </h4>
                  <p className="text-zinc-500 group-hover:text-blue-400 transition-colors uppercase break-all">SCPRECISIONDEBURRING@GMAIL.COM</p>
                </div>
              </div>

              {/* Address */}
              <div 
                className="flex items-start gap-4 cursor-pointer group"
                 onClick={() => handleCopy('12734 Branford Street Unit #17', 'address')}
                 title="Click to copy address"
              >
                <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 text-blue-400 group-hover:border-blue-500 transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-medium flex items-center gap-2">
                      Visit HQ
                      {copiedAddress && <span className="text-xs text-green-400 font-normal flex items-center animate-in fade-in slide-in-from-left-2"><Check className="w-3 h-3 mr-1"/> Copied</span>}
                  </h4>
                  <p className="text-zinc-500 group-hover:text-blue-400 transition-colors">12734 Branford Street Unit #17</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="glass-panel p-8 rounded-2xl border border-white/5">
              <form 
                onSubmit={handleSubmit}
                className="space-y-6" 
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Full Name</label>
                    <input 
                      name="name" 
                      value={formData.name}
                      onChange={handleChange}
                      type="text" 
                      required
                      className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder-zinc-600"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Email Address</label>
                    <input 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email" 
                      required
                      className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder-zinc-600"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Service Interest</label>
                  <div className="relative">
                      <select 
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer hover:bg-zinc-900"
                      >
                      <option>Microscope Deburring</option>
                      <option>Manual Deburring</option>
                      <option>Sand Blasting</option>
                      <option>Blending</option>
                      <option>General Inquiry</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                          <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Project Details</label>
                  <textarea 
                      name="details"
                      value={formData.details}
                      onChange={handleChange}
                      rows={4} 
                      required
                      className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder-zinc-600 resize-none" 
                      placeholder="Tell us about part materials, volumes, and requirements..."
                  ></textarea>
                </div>

                {/* File Upload Section */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Attach Drawings/Prints</label>
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-zinc-700 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#00FFBD]/50 hover:bg-zinc-900/50 transition-all group"
                    >
                        <input 
                            type="file" 
                            name="attachment" 
                            ref={fileInputRef} 
                            className="hidden" 
                            onChange={handleFileChange}
                        />
                        {fileName ? (
                            <div className="flex items-center gap-3 bg-[#00FFBD]/10 px-4 py-2 rounded-full border border-[#00FFBD]/20">
                                <FileText className="w-4 h-4 text-[#00FFBD]" />
                                <span className="text-sm text-[#00FFBD] font-medium">{fileName}</span>
                                <button 
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFileName(null);
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}
                                    className="hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <UploadCloud className="w-8 h-8 text-zinc-500 mb-2 group-hover:text-[#00FFBD] transition-colors" />
                                <p className="text-sm text-zinc-400 group-hover:text-zinc-300">
                                    Click to attach file <br/>
                                    <span className="text-xs text-zinc-600">(Drawings, Prints, Specs)</span>
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-lg transition-all transform active:scale-[0.98] shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 group"
                >
                  <Mail className="w-5 h-5" />
                  Compose Email Request
                  <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-center text-xs text-zinc-500">
                    Opens your default email client with your details pre-filled.
                </p>
              </form>
          </div>
        </div>
      </div>

      {/* Attachment Reminder Modal */}
      <AnimatePresence>
        {showFileReminder && (
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
             onClick={() => setShowFileReminder(false)}
          >
             <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-zinc-900 border border-amber-500/30 p-8 rounded-2xl max-w-md w-full shadow-2xl relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
             >
                <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
                
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
                        <UploadCloud className="w-8 h-8 text-amber-500" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">Manual Attachment Required</h3>
                    
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                        Due to browser security policies, we cannot automatically attach files to your email draft.
                        <br/><br/>
                        Please remember to manually attach <span className="text-white font-bold bg-zinc-800 px-2 py-0.5 rounded">{fileName}</span> once your email app opens.
                    </p>

                    <div className="flex gap-3 w-full">
                        <button 
                            onClick={() => setShowFileReminder(false)}
                            className="flex-1 py-3 bg-zinc-800 text-zinc-300 hover:text-white rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={openEmailDraft}
                            className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            I Understand, Open Email
                        </button>
                    </div>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
