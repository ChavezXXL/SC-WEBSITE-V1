
import React, { useState, useRef } from 'react';
import { Mail, Phone, MapPin, Check, UploadCloud, FileText, X, ArrowRight, Send, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackPhoneClick, trackFormSubmit } from '../services/analytics';

export const Contact: React.FC = () => {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Microscope Deburring',
    details: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const resetForm = () => {
      setFormData({ name: '', email: '', service: 'Microscope Deburring', details: '' });
      setFileName(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    try {
      const form = formRef.current;
      if (!form) return;

      const data = new FormData(form);
      data.set('form-name', 'contact');

      const response = await fetch('/', {
        method: 'POST',
        body: data,
      });

      // In production (Netlify), a successful submission returns 200
      // In local dev, Vite may return an error status — that's expected
      const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

      if (response.ok || isLocalDev) {
        setSubmitStatus('success');
        // Fire Google Ads conversion event on successful submit
        if (!isLocalDev) trackFormSubmit();
        resetForm();
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch {
      // Network error — show success in dev, error in prod
      const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isLocalDev) {
        setSubmitStatus('success');
        resetForm();
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-zinc-950 border-t border-zinc-900 relative scroll-mt-32">
      <div className="container mx-auto px-6">

        {/* Centered hero heading */}
        <div className="max-w-4xl mx-auto text-center mb-20 md:mb-24">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="block w-8 h-px bg-[#00FFBD]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#00FFBD]">
              Get In Touch
            </span>
            <span className="block w-8 h-px bg-[#00FFBD]" />
          </div>
          <h2
            className="font-black text-white uppercase tracking-tight leading-[0.9] mb-6"
            style={{ fontSize: 'clamp(2.75rem, 7vw, 6rem)' }}
          >
            Let's discuss your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#9affde] to-[#00FFBD]">
              project.
            </span>
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
            Reach out to our team for technical specs, lead times, or a custom quote. Most quotes back within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column - Contact Info */}
          <div>

            <div className="space-y-6">
              {/* Phone - tap to call on mobile, click to copy on desktop */}
              <a
                href="tel:+18183894234"
                className="flex items-start gap-4 cursor-pointer group no-underline"
                onClick={(e) => {
                  // Fire Google Ads conversion for phone-click intent (mobile call OR desktop copy)
                  trackPhoneClick();
                  // On desktop, copy instead of calling
                  if (window.innerWidth > 768) {
                    e.preventDefault();
                    handleCopy('(818) 389-4234', 'phone');
                  }
                }}
                title="Tap to call or click to copy"
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
              </a>

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
                ref={formRef}
                name="contact"
                method="POST"
                data-netlify="true"
                encType="multipart/form-data"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <input type="hidden" name="form-name" value="contact" />

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

                {/* Success Message */}
                <AnimatePresence>
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3"
                    >
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <p className="text-sm text-green-300">Your inquiry has been sent successfully! We'll get back to you within 24 hours.</p>
                    </motion.div>
                  )}
                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3"
                    >
                      <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <p className="text-sm text-red-300">Something went wrong. Please email us directly at SCPRECISIONDEBURRING@GMAIL.COM</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-all transform active:scale-[0.98] shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 group"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Inquiry
                      <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-zinc-500">
                    Your message is sent directly to our team. We respond within 24 hours.
                </p>
              </form>
          </div>
        </div>
      </div>
    </section>
  );
};
