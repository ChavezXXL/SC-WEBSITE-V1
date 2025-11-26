
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Check } from 'lucide-react';

export const Contact: React.FC = () => {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Microscope Deburring',
    details: ''
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Quote Request from ${formData.name}`;
    const body = `Name: ${formData.name}
Email: ${formData.email}
Service Interest: ${formData.service}

Project Details:
${formData.details}`;

    // Opens user's default email client with pre-filled fields
    window.location.href = `mailto:scprecisiondeburring@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-24 bg-zinc-950 border-t border-zinc-900">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
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

          <div className="glass-panel p-8 rounded-2xl">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Full Name</label>
                  <input 
                    name="name" 
                    value={formData.name}
                    onChange={handleChange}
                    type="text" 
                    required
                    className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all" 
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
                    className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Service Interest</label>
                <select 
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                >
                  <option>Microscope Deburring</option>
                  <option>Manual Deburring</option>
                  <option>Sand Blasting</option>
                  <option>Blending</option>
                  <option>General Inquiry</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Project Details</label>
                <textarea 
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    rows={4} 
                    required
                    className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all" 
                    placeholder="Tell us about part materials, volumes, and requirements..."
                ></textarea>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-lg transition-all transform active:scale-95 shadow-lg shadow-blue-900/20">
                Submit Request (Opens Email)
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
