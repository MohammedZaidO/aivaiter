"use client";

import { useState } from "react";
import HeroSection from "@/components/sections/HeroSection";
import ContactSection from "@/components/sections/ContactSection";
import EnquiryModal from "@/components/modals/EnquiryModal";
import { 
  PhoneMissed, 
  Clock, 
  CalendarX2, 
  Users,
  MessageSquareReply,
  CalendarCheck,
  Globe,
  Zap,
  Quote,
  CheckCircle2,
  Trophy,
  Users2
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [enquiryModal, setEnquiryModal] = useState({ isOpen: false, plan: "" });

  const openEnquiry = (plan: string = "") => {
    setEnquiryModal({ isOpen: true, plan });
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-background selection:bg-[var(--gold-primary)] selection:text-[#121212]">
      
      {/* 1. Hero Section */}
      <HeroSection onEnquiry={() => openEnquiry()} onViewPlans={() => scrollTo('pricing')} />

      {/* 2. Operational Value Section */}
      <section className="py-24 bg-surface-low relative border-t border-[rgba(212,175,55,0.05)]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl mb-4">Minimize Friction, Maximize Revenue</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto text-lg font-light">
              Don&apos;t let busy rush hours or after-hours inquiries stop your growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: PhoneMissed, title: "Unanswered Calls", desc: "Rush hours often mean lost reservations. Let AI handle the overflow." },
              { icon: Users2, title: "Group Enquiries", desc: "Automate complex group and event booking requests instantly." },
              { icon: Trophy, title: "Staff Efficiency", desc: "Free your team from repetitive FAQs so they can focus on guests." },
              { icon: CalendarX2, title: "Booking Abandonment", desc: "Reduce friction with an always-on, multilingual booking assistant." },
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-surface p-8 rounded-2xl border border-surface-highest hover:bg-surface-high transition-colors"
              >
                <div className="w-12 h-12 bg-surface-lowest rounded-xl flex items-center justify-center mb-6 text-[var(--gold-primary)] shadow-inner">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-3">{item.title}</h3>
                <p className="text-foreground/60 leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Concierge Features */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-5xl mb-6">Excellence in Every Interaction</h2>
              <p className="text-foreground/70 text-lg font-light mb-10 leading-relaxed">
                AIVaiter represents your brand with the precision and grace of a master Maître d&apos;, ensuring every guest feels valued.
              </p>
              
              <div className="space-y-8">
                {[
                  { icon: MessageSquareReply, title: "Intelligent Enquiries", desc: "Handles menu questions, dietary specifics, and parking details." },
                  { icon: CalendarCheck, title: "Multi-Flow Bookings", desc: "Supports standard reservations, group events, and special pre-orders." },
                  { icon: Globe, title: "True Multilingualism", desc: "Speak to guests natively in English or Hindi without translation lag." },
                  { icon: Zap, title: "Instant Lead Capture", desc: "Push booking details directly to your email or management dashboard." },
                ].map((feature, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="mt-1">
                      <div className="w-8 h-8 rounded-full bg-[rgba(212,175,55,0.1)] group-hover:bg-[var(--gold-primary)]/20 flex items-center justify-center text-[var(--gold-primary)] transition-colors">
                        <feature.icon className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-1">{feature.title}</h4>
                      <p className="text-foreground/60 font-light">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
               <div className="absolute inset-0 bg-[var(--gold-primary)]/5 blur-3xl rounded-full" />
               <div className="glass p-8 rounded-3xl relative border border-[var(--gold-primary)]/10">
                  <div className="space-y-6">
                     <div className="flex gap-4 items-center mb-6">
                        <div className="w-10 h-10 bg-surface-low rounded-full bg-gradient-to-tr from-[var(--gold-primary)] to-[var(--gold-light)]" />
                        <div className="h-4 w-32 bg-surface-low rounded-md" />
                     </div>
                     <div className="flex justify-start">
                        <div className="h-10 bg-surface-low rounded-lg w-full animate-pulse" />
                     </div>
                     <div className="flex justify-end">
                        <div className="h-10 bg-[var(--gold-primary)]/10 rounded-lg w-4/6" />
                     </div>
                     <div className="flex justify-start">
                        <div className="h-24 bg-surface-low rounded-lg w-5/6" />
                     </div>
                     <div className="mt-8 pt-6 border-t border-[rgba(212,175,55,0.1)] flex justify-between">
                         <div className="h-8 bg-[var(--gold-primary)]/20 rounded-md w-24" />
                         <div className="h-8 bg-surface-low rounded-md w-24" />
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Concierge Hub (Contact) */}
      <ContactSection />

      {/* 5. Pricing Section */}
      <section id="pricing" className="py-24 bg-surface-low border-y border-[rgba(212,175,55,0.05)]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl mb-4">Investment in Automation</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto text-lg font-light">
              Premium solutions curated for modern hospitality businesses.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-surface p-8 rounded-2xl border border-surface-highest flex flex-col"
            >
              <h3 className="text-xl font-medium mb-2">Essential</h3>
              <p className="text-foreground/60 text-sm mb-6">Foundation AI Concierge</p>
              <div className="mb-8">
                <span className="text-4xl font-serif">₹9,999</span>
                <span className="text-foreground/50">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm font-light flex-1">
                {['Custom knowledge base', '24/7 Reservation capture', 'Chat/Voice interaction', 'Email lead notifications'].map((f, i) => (
                  <li key={i} className="flex gap-3 items-center"><CheckCircle2 className="w-4 h-4 text-[var(--gold-primary)]" />{f}</li>
                ))}
              </ul>
              <button 
                onClick={() => openEnquiry("Essential")}
                className="w-full py-3 rounded-lg border border-[var(--gold-primary)]/40 text-[var(--gold-primary)] hover:bg-[var(--gold-primary)] hover:text-[#121212] transition-colors"
              >
                Select Plan
              </button>
            </motion.div>

            {/* Growth */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-b from-[#2a2825] to-surface p-8 rounded-2xl border border-[var(--gold-primary)] relative shadow-[0_0_40px_rgba(212,175,55,0.1)] flex flex-col"
            >
              <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-[var(--gold-primary)] text-[#121212] font-semibold px-4 py-1.5 rounded-full uppercase tracking-tighter" style={{ fontSize: '10px' }}>
                Highly Recommended
              </div>
              <h3 className="text-xl font-medium mb-2 text-[var(--gold-primary)]">Professional</h3>
              <p className="text-foreground/60 text-sm mb-6">Concierge + Modern Presence</p>
              <div className="mb-8">
                <span className="text-4xl font-serif">₹19,999</span>
                <span className="text-foreground/50">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm font-light flex-1">
                {['Everything in Essential', 'Premium storefront page', 'Custom domain setup', 'SMS status alerts', 'Priority 2-hour support'].map((f, i) => (
                  <li key={i} className="flex gap-3 items-center"><CheckCircle2 className="w-4 h-4 text-[var(--gold-primary)]" />{f}</li>
                ))}
              </ul>
              <button 
                onClick={() => openEnquiry("Professional")}
                className="w-full py-3 rounded-lg bg-[var(--gold-primary)] text-[#121212] font-medium hover:brightness-110 transition-all shadow-lg"
              >
                Elevate Service
              </button>
            </motion.div>

            {/* Custom */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-surface p-8 rounded-2xl border border-surface-highest flex flex-col"
            >
              <h3 className="text-xl font-medium mb-2">Enterprise</h3>
              <p className="text-foreground/60 text-sm mb-6">Bespoke Integrations</p>
              <div className="mb-8">
                <span className="text-4xl font-serif">Bespoke</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm font-light flex-1">
                {['POS system integration', 'Multi-location network', 'Custom API development', 'Dedicated account manager'].map((f, i) => (
                  <li key={i} className="flex gap-3 items-center"><CheckCircle2 className="w-4 h-4 text-[var(--gold-primary)]" />{f}</li>
                ))}
              </ul>
              <button 
                onClick={() => openEnquiry("Enterprise")}
                className="w-full py-3 rounded-lg border border-surface-highest hover:border-[var(--gold-primary)] transition-colors"
              >
                Consult Our Team
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. Hospitality Quote */}
      <section className="py-32 relative bg-surface-lowest">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <Quote className="w-12 h-12 mx-auto text-[var(--gold-primary)]/20 mb-10" />
          <p className="font-serif text-3xl md:text-4xl leading-relaxed mb-10 text-foreground/90 italic">
            &quot;Exceptional service is found in the speed and grace of your response. AIVaiter ensures your brand never misses a beat.&quot;
          </p>
          <div className="h-px w-24 bg-[var(--gold-primary)]/40 mx-auto mb-6" />
          <p className="font-medium tracking-widest text-[var(--gold-primary)] uppercase text-sm">Mohammed Zaid | Founder</p>
        </div>
      </section>

      {/* 7. Final CTA */}
      <section className="py-24 relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[var(--gold-primary)]/5 opacity-50" />
        <div className="container mx-auto px-6 relative z-10 text-center max-w-2xl">
          <h2 className="font-serif text-4xl md:text-6xl mb-8">Ready to evolve?</h2>
          <p className="text-foreground/70 text-lg mb-12 font-light leading-relaxed">
            Join the hospitality brands redefining the guest reception experience through intelligent automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={() => openEnquiry()}
              className="px-10 py-5 bg-[var(--gold-primary)] text-[#121212] font-semibold rounded-full hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-2"
            >
              Get Started Now
            </button>
            <button 
              onClick={() => scrollTo('contact')}
              className="px-10 py-5 bg-surface-high border border-surface-highest hover:border-[var(--gold-primary)]/40 text-foreground font-medium rounded-full transition-all"
            >
              Schedule Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Enquiry Modal */}
      <EnquiryModal 
        isOpen={enquiryModal.isOpen} 
        onClose={() => setEnquiryModal({ ...enquiryModal, isOpen: false })}
        initialPlan={enquiryModal.plan}
      />
    </main>
  );
}
