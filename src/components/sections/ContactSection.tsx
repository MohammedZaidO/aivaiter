"use client";

import { useState } from "react";
import { restaurantConfig, serviceConfig } from "@/data/restaurant";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, Headset, User, Sparkles } from "lucide-react";

export default function ContactSection() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="py-24 relative bg-surface-lowest">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          
          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-3xl md:text-5xl mb-6">Service Enquiries</h2>
            <p className="text-foreground/60 text-lg font-light mb-10 leading-relaxed">
              Interested in implementing AIVaiter for your establishment? Reach out to discuss your specific requirements or request a custom setup.
            </p>

            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-xl bg-surface-high flex items-center justify-center text-[var(--gold-primary)] shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.05)]">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[var(--gold-primary)] uppercase tracking-widest mb-1">Founder</h4>
                  <p className="text-foreground/80 font-light">{serviceConfig.founder}</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-xl bg-surface-high flex items-center justify-center text-[var(--gold-primary)] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[var(--gold-primary)] uppercase tracking-widest mb-1">Direct Line</h4>
                  <p className="text-foreground/80 font-light">{serviceConfig.phone}</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-xl bg-surface-high flex items-center justify-center text-[var(--gold-primary)] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[var(--gold-primary)] uppercase tracking-widest mb-1">Business Email</h4>
                  <p className="text-foreground/80 font-light">{serviceConfig.email}</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-gradient-to-tr from-[var(--gold-primary)]/10 to-transparent border border-[var(--gold-primary)]/10">
               <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-5 h-5 text-[var(--gold-primary)]" />
                  <h4 className="font-medium">Consultation</h4>
               </div>
               <p className="text-sm text-foreground/60 mb-6 font-light leading-relaxed">
                  We offer bespoke AI configurations tailored to your menu, booking rules, and guest interaction style.
               </p>
               <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-aivaiter'))}
                className="text-sm font-medium text-[var(--gold-primary)] hover:underline flex items-center gap-2"
               >
                  Try the Demo Concierge <Send className="w-3 h-3" />
               </button>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-surface p-8 md:p-10 rounded-3xl border border-surface-highest shadow-2xl relative overflow-hidden"
          >
            {isSubmitted ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif mb-2">Message Sent</h3>
                <p className="text-foreground/60 font-light">Thank you. Our hospitality team will be in touch shortly.</p>
              </div>
            ) : (
              <>
                <h3 className="font-serif text-2xl mb-8">Direct Enquiry</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-light text-foreground/60 mb-2">Your Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-surface-high border border-surface-highest rounded-xl px-4 py-3 outline-none focus:border-[var(--gold-primary)]/50 transition-all font-light" 
                      placeholder="e.g. Rahul Sharma"
                      value={formState.name}
                      onChange={e => setFormState({...formState, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-foreground/60 mb-2">Email Address</label>
                    <input 
                      required
                      type="email" 
                      className="w-full bg-surface-high border border-surface-highest rounded-xl px-4 py-3 outline-none focus:border-[var(--gold-primary)]/50 transition-all font-light" 
                      placeholder="rahul@example.com"
                      value={formState.email}
                      onChange={e => setFormState({...formState, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-foreground/60 mb-2">Message</label>
                    <textarea 
                      required
                      rows={4}
                      className="w-full bg-surface-high border border-surface-highest rounded-xl px-4 py-3 outline-none focus:border-[var(--gold-primary)]/50 transition-all font-light resize-none" 
                      placeholder="Tell us about your event or enquiry..."
                      value={formState.message}
                      onChange={e => setFormState({...formState, message: e.target.value})}
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-4 bg-[var(--gold-primary)] text-[#121212] font-medium rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    Submit Enquiry <ArrowSend />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ArrowSend() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="translate-x-1 group-hover:translate-x-2 transition-transform">
      <path d="M1 8H15M15 8L8 1M15 8L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
