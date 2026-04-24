"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle2, User, Phone, Building2 } from "lucide-react";
import { serviceConfig } from "@/data/restaurant";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: string;
}

export default function EnquiryModal({ isOpen, onClose, initialPlan = "" }: EnquiryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    businessName: "",
    plan: initialPlan,
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (initialPlan) {
      setFormData(prev => ({ ...prev, plan: initialPlan }));
    }
  }, [initialPlan]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // In a real app, send to API here
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-surface border border-[rgba(212,175,55,0.2)] rounded-3xl overflow-hidden shadow-2xl"
          >
            {isSubmitted ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-serif mb-4">Request Received</h3>
                <p className="text-foreground/60 font-light leading-relaxed">
                  Thank you for your interest in AIVaiter. {serviceConfig.founder} will reach out to you within 24 hours.
                </p>
              </div>
            ) : (
              <div className="p-8 md:p-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="font-serif text-3xl mb-2">Service Enquiry</h2>
                    <p className="text-sm text-foreground/50">Elevate your hospitality with AI</p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-2 hover:bg-surface-high rounded-full transition-colors text-foreground/40 hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-foreground/40 font-medium ml-1">Your Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gold-primary)]/50" />
                        <input 
                          required
                          type="text"
                          className="w-full bg-surface-high border border-surface-highest rounded-xl pl-11 pr-4 py-3 outline-none focus:border-[var(--gold-primary)]/50 transition-all font-light"
                          placeholder="Rahul Sharma"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-foreground/40 font-medium ml-1">Contact (Phone/Email)</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gold-primary)]/50" />
                        <input 
                          required
                          type="text"
                          className="w-full bg-surface-high border border-surface-highest rounded-xl pl-11 pr-4 py-3 outline-none focus:border-[var(--gold-primary)]/50 transition-all font-light"
                          placeholder="+91 or email"
                          value={formData.contact}
                          onChange={e => setFormData({...formData, contact: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-foreground/40 font-medium ml-1">Restaurant / Business Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gold-primary)]/50" />
                      <input 
                        required
                        type="text"
                        className="w-full bg-surface-high border border-surface-highest rounded-xl pl-11 pr-4 py-3 outline-none focus:border-[var(--gold-primary)]/50 transition-all font-light"
                        placeholder="The Saffron Table"
                        value={formData.businessName}
                        onChange={e => setFormData({...formData, businessName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-foreground/40 font-medium ml-1">Selected Interest / Plan</label>
                    <select
                      className="w-full bg-surface-high border border-surface-highest rounded-xl px-4 py-3 outline-none focus:border-[var(--gold-primary)]/50 transition-all font-light appearance-none text-foreground/80"
                      value={formData.plan}
                      onChange={e => setFormData({...formData, plan: e.target.value})}
                    >
                      <option value="">General Consultation</option>
                      <option value="Essential">Essential Plan (₹9,999/mo)</option>
                      <option value="Professional">Professional Plan (₹19,999/mo)</option>
                      <option value="Enterprise">Enterprise Solution</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-foreground/40 font-medium ml-1">Additional Note</label>
                    <textarea 
                      rows={3}
                      className="w-full bg-surface-high border border-surface-highest rounded-xl px-4 py-3 outline-none focus:border-[var(--gold-primary)]/50 transition-all font-light resize-none"
                      placeholder="Tell us about your specific goals..."
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-[var(--gold-primary)] text-[#121212] font-semibold rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[var(--gold-primary)]/10"
                  >
                    Submit Request <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
