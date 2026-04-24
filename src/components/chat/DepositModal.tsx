"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, ShieldCheck, Lock, CheckCircle2 } from "lucide-react";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: {
    type: string;
    details: string;
    amount: string;
  };
}

export default function DepositModal({ isOpen, onClose, summary }: DepositModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-surface border border-surface-highest rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-surface-highest flex justify-between items-center">
              <div>
                <h3 className="text-xl font-medium tracking-tight">Requirement Secured</h3>
                <p className="text-xs text-foreground/50 uppercase tracking-widest mt-1">Payment Demo Overlay</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-surface-high flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="bg-surface-low rounded-2xl p-6 mb-8 border border-surface-highest/50">
                 <div className="flex justify-between items-start mb-4">
                    <div>
                       <p className="text-xs text-[var(--gold-primary)] font-medium mb-1 uppercase tracking-tighter">{summary.type}</p>
                       <h4 className="text-lg font-medium">{summary.details}</h4>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                 </div>
                 <div className="pt-4 border-t border-surface-highest flex justify-between items-end">
                    <span className="text-sm text-foreground/50 font-light">Refundable Deposit</span>
                    <span className="text-2xl font-serif text-[var(--gold-primary)]">{summary.amount}</span>
                 </div>
              </div>

              <div className="space-y-4 mb-8">
                 <div className="flex gap-4 items-center p-4 bg-surface-high/50 rounded-xl border border-surface-highest/30">
                    <div className="w-10 h-10 rounded-lg bg-surface-low flex items-center justify-center text-[var(--gold-primary)]">
                       <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                       <p className="text-sm font-medium">Stripe Payment Gateway</p>
                       <p className="text-xs text-foreground/40 font-light italic">Demo Environment Active</p>
                    </div>
                 </div>
                 
                 <div className="flex items-center justify-center gap-6 py-2">
                    <div className="flex items-center gap-1.5 text-[10px] text-foreground/40 font-light uppercase tracking-widest">
                       <ShieldCheck className="w-3 h-3" /> Secure SSL
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-foreground/40 font-light uppercase tracking-widest">
                       <Lock className="w-3 h-3" /> Encrypted
                    </div>
                 </div>
              </div>

              <button 
                className="w-full py-4 bg-[var(--gold-primary)] text-[#121212] font-semibold rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 group"
                onClick={() => alert("This is a demo payment integration. In a production environment, this would redirect to Stripe Checkout.")}
              >
                Proceed to Checkout
                <ArrowRight />
              </button>
              
              <p className="mt-4 text-center text-[10px] text-foreground/30 font-light leading-relaxed">
                This transaction is protected by advanced fraud detection. <br />
                Terms of service and refund policy apply.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-1 transition-transform">
      <path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
