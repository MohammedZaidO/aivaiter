"use client";

import { restaurantConfig } from "@/data/restaurant";
import { UtensilsCrossed, ArrowUpRight, MessageSquare, Mail, Phone, MapPin, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0a0a0a] pt-24 pb-12 border-t border-[rgba(212,175,55,0.08)] relative overflow-hidden">
      {/* Subtle Glow Background */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[var(--gold-primary)]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--gold-primary)] to-[var(--gold-light)] flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-[#121212]" />
              </div>
              <div>
                <h2 className="font-serif text-xl tracking-tight leading-none">AIVaiter</h2>
                <span className="text-[10px] text-[var(--gold-primary)] uppercase tracking-[0.2em] opacity-80">Concierge</span>
              </div>
            </div>
            <p className="text-foreground/50 text-sm leading-relaxed font-light">
              Redefining hospitality with intelligent automation. Ensuring every guest interaction is handled with grace and precision.
            </p>
            <div className="flex items-center gap-2 text-[var(--gold-primary)] text-[11px] font-medium uppercase tracking-widest bg-[var(--gold-primary)]/5 py-1.5 px-3 rounded-full border border-[var(--gold-primary)]/10 w-fit">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold-primary)] animate-pulse" />
              Systems Online
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest mb-8 text-foreground/90">Navigation</h4>
            <ul className="space-y-4">
              {['Home', 'Experience', 'Pricing', 'Documentation'].map((item) => (
                <li key={item}>
                  <a 
                    href={item === 'Pricing' ? '#pricing' : '#'} 
                    className="text-foreground/50 hover:text-[var(--gold-primary)] transition-colors text-sm flex items-center group gap-1"
                  >
                    {item}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Concierge Column */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest mb-8 text-foreground/90">Concierge</h4>
            <ul className="space-y-4">
              <li>
                <div className="flex items-center gap-3 text-foreground/50 text-sm">
                  <span className="w-8 h-8 rounded-lg bg-surface-high flex items-center justify-center text-[var(--gold-primary)]/40 shrink-0 border border-surface-highest">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <span>{restaurantConfig.address}, {restaurantConfig.city}</span>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-3 text-foreground/50 text-sm">
                  <span className="w-8 h-8 rounded-lg bg-surface-high flex items-center justify-center text-[var(--gold-primary)]/40 shrink-0 border border-surface-highest">
                    <Phone className="w-4 h-4" />
                  </span>
                  <span>{restaurantConfig.contactPhone}</span>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-3 text-foreground/50 text-sm">
                  <span className="w-8 h-8 rounded-lg bg-surface-high flex items-center justify-center text-[var(--gold-primary)]/40 shrink-0 border border-surface-highest">
                    <Mail className="w-4 h-4" />
                  </span>
                  <span>info@aivaiter.com</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Action Column */}
          <div className="space-y-8">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-widest mb-6 text-foreground/90">Status</h4>
              <p className="text-foreground/40 text-sm font-light mb-4">
                Ready to transform your guest experience?
              </p>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-aivaiter'))}
                className="group w-full py-4 px-6 rounded-xl bg-surface-high border border-surface-highest hover:border-[var(--gold-primary)]/30 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-[var(--gold-primary)]" />
                   <span className="text-sm font-medium">Launch AI Demo</span>
                </div>
                <MessageSquare className="w-4 h-4 text-[var(--gold-primary)] opacity-40 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
            
            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border border-surface-highest hover:border-[var(--gold-primary)]/40 transition-colors flex items-center justify-center bg-surface-high/50 cursor-pointer group">
                  <div className="w-4 h-4 bg-foreground/20 rounded-sm group-hover:bg-[var(--gold-primary)]/50 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-[rgba(212,175,55,0.05)] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-foreground/30 text-xs font-light tracking-wide order-2 md:order-1">
            &copy; {new Date().getFullYear()} AIVaiter Concierge Solutions. All rights reserved. 
            <span className="mx-2 opacity-20">|</span> 
            Designed for Excellence.
          </p>

          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 text-foreground/40 hover:text-[var(--gold-primary)] transition-colors text-xs font-medium uppercase tracking-[0.2em] order-1 md:order-2 group"
          >
            Back to Top
            <div className="w-8 h-8 rounded-full border border-surface-highest flex items-center justify-center group-hover:border-[var(--gold-primary)]/20 group-hover:bg-[var(--gold-primary)]/5 transition-all">
              <ArrowUpRight className="w-3.5 h-3.5 -rotate-45" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
