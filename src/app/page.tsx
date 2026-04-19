import HeroSection from "@/components/sections/HeroSection";
import ChatWidget from "@/components/chat/ChatWidget";
import { 
  PhoneMissed, 
  Clock, 
  CalendarX2, 
  Users,
  MessageSquareReply,
  CalendarCheck,
  Zap,
  Globe,
  Quote,
  CheckCircle2
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background selection:bg-[var(--gold-primary)] selection:text-[#121212]">
      
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Problem Section */}
      <section className="py-24 bg-surface-low relative border-t border-[rgba(212,175,55,0.05)]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl mb-4">The Cost of Missed Connections</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto text-lg font-light">
              While your staff is busy serving the dining room, who is managing the digital front door?
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: PhoneMissed, title: "Missed Calls", desc: "Rush hours mean unanswered phones and lost reservations." },
              { icon: Clock, title: "After-hours Queries", desc: "Customers expect answers 24/7, even when you're closed." },
              { icon: Users, title: "Staff Burnout", desc: "Answering the same repetitive FAQs wastes valuable time." },
              { icon: CalendarX2, title: "Lost Bookings", desc: "Friction in reserving a table leads to abandoned bookings." },
            ].map((item, idx) => (
              <div key={idx} className="bg-surface p-8 rounded-2xl border border-surface-highest hover:bg-surface-high transition-colors">
                <div className="w-12 h-12 bg-surface-lowest rounded-xl flex items-center justify-center mb-6 text-[var(--gold-primary)] outline outline-1 outline-[rgba(212,175,55,0.2)]">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-3">{item.title}</h3>
                <p className="text-foreground/60 leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Solution / Features Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-5xl mb-6">A Concierge That Never Sleeps</h2>
              <p className="text-foreground/70 text-lg font-light mb-10 leading-relaxed">
                AIVaiter integrates seamlessly with your operations to ensure every customer inquiry is met with the hospitality they deserve.
              </p>
              
              <div className="space-y-8">
                {[
                  { icon: MessageSquareReply, title: "Instant FAQ Responses", desc: "Automatically handles menus, timings, location, and parking questions." },
                  { icon: CalendarCheck, title: "Smart Reservation Capture", desc: "Guides users through booking, collects info, and alerts your team." },
                  { icon: Globe, title: "Works Anywhere", desc: "Embed on your simple landing page, or let us host your digital storefront." },
                  { icon: Zap, title: "Reduce Missed Opportunities", desc: "Turn after-hours website visitors into confirmed dining guests." },
                ].map((feature, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="mt-1">
                      <div className="w-8 h-8 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[var(--gold-primary)]">
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
               <div className="glass p-8 rounded-3xl relative">
                  <div className="space-y-4">
                     <div className="flex gap-4 items-center mb-6">
                        <div className="w-10 h-10 bg-surface-low rounded-full animate-pulse" />
                        <div className="h-4 w-32 bg-surface-low rounded-md" />
                     </div>
                     <div className="h-10 bg-surface-low rounded-lg w-full" />
                     <div className="h-10 bg-surface-low rounded-lg w-5/6" />
                     <div className="h-10 bg-surface-low rounded-lg w-4/6" />
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

      {/* 4. How it works section */}
      <section className="py-24 bg-surface-lowest">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl md:text-5xl mb-16">Effortless Operations</h2>
          
          <div className="grid md:grid-cols-3 gap-8 relative max-w-5xl mx-auto">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-[var(--gold-primary)]/30 to-transparent" />
            
            {[
              { step: "01", title: "Customer Asks", desc: "A guest visits your site and asks a question about your menu or availability." },
              { step: "02", title: "AI Answers & Captures", desc: "AIVaiter answers instantly and seamlessly transitions into collecting reservation details." },
              { step: "03", title: "You Get the Lead", desc: "The booking lead is instantly sent to your dashboard or email for final confirmation." },
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full glass flex items-center justify-center font-serif text-xl text-[var(--gold-primary)] mb-6 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                  {item.step}
                </div>
                <h3 className="text-xl font-medium mb-3">{item.title}</h3>
                <p className="text-foreground/60 font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Live chatbot demo section */}
      <section id="demo" className="py-32 relative">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="font-serif text-4xl md:text-5xl mb-6">Experience the Service</h2>
          <p className="text-foreground/70 text-lg font-light mb-10">
            Interact with our live demo. Ask about our fictional restaurant &quot;Saffron Table&quot; or try booking a table for this weekend. AIVaiter is ready to assist you in the bottom right corner.
          </p>
          <div className="flex justify-center gap-4 text-sm font-light text-[var(--gold-primary)]">
            <span className="bg-[rgba(212,175,55,0.1)] px-4 py-2 rounded-full border border-[rgba(212,175,55,0.2)]">Try: &quot;What are your timings?&quot;</span>
            <span className="bg-[rgba(212,175,55,0.1)] px-4 py-2 rounded-full border border-[rgba(212,175,55,0.2)]">Try: &quot;I want to book a table&quot;</span>
          </div>
        </div>
      </section>

      {/* 6. Pricing Section */}
      <section id="pricing" className="py-24 bg-surface-low border-y border-[rgba(212,175,55,0.05)]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl mb-4">Investment in Excellence</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto text-lg font-light">
              Simple, transparent pricing designed to scale with your hospitality business.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter */}
            <div className="bg-surface p-8 rounded-2xl border border-surface-highest">
              <h3 className="text-xl font-medium mb-2">Starter</h3>
              <p className="text-foreground/60 text-sm mb-6">AI Receptionist Setup</p>
              <div className="mb-8">
                <span className="text-4xl font-serif">₹9,999</span>
                <span className="text-foreground/50">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm font-light">
                {['Custom knowledge base', 'Reservation capture', 'Embed on your site', 'Email notifications'].map((f, i) => (
                  <li key={i} className="flex gap-3 items-center"><CheckCircle2 className="w-4 h-4 text-[var(--gold-primary)]" />{f}</li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-lg border border-[var(--gold-primary)] text-[var(--gold-primary)] hover:bg-[var(--gold-primary)] hover:text-[#121212] transition-colors">Select Plan</button>
            </div>

            {/* Growth */}
            <div className="bg-gradient-to-b from-[#2a2825] to-surface p-8 rounded-2xl border border-[var(--gold-primary)]/50 relative shadow-[0_0_30px_rgba(212,175,55,0.1)]">
              <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-[var(--gold-primary)] text-[#121212] text-xs font-medium px-3 py-1 rounded-full">
                Most Popular
              </div>
              <h3 className="text-xl font-medium mb-2 text-[var(--gold-primary)]">Growth</h3>
              <p className="text-foreground/60 text-sm mb-6">AI Receptionist + Landing Page</p>
              <div className="mb-8">
                <span className="text-4xl font-serif">₹19,999</span>
                <span className="text-foreground/50">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm font-light">
                {['Everything in Starter', 'Premium landing page', 'Custom domain setup', 'SMS notifications', 'Priority support'].map((f, i) => (
                  <li key={i} className="flex gap-3 items-center"><CheckCircle2 className="w-4 h-4 text-[var(--gold-primary)]" />{f}</li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-lg bg-[var(--gold-primary)] text-[#121212] font-medium hover:brightness-110 transition-all">Select Plan</button>
            </div>

            {/* Custom */}
            <div className="bg-surface p-8 rounded-2xl border border-surface-highest">
              <h3 className="text-xl font-medium mb-2">Custom</h3>
              <p className="text-foreground/60 text-sm mb-6">Advanced Integrations</p>
              <div className="mb-8">
                <span className="text-4xl font-serif">Let&apos;s Talk</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm font-light flex-1">
                {['Direct POS integration', 'Multi-location setup', 'WhatsApp automation', 'Voice ordering API'].map((f, i) => (
                  <li key={i} className="flex gap-3 items-center"><CheckCircle2 className="w-4 h-4 text-[var(--gold-primary)]" />{f}</li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-lg border border-surface-highest hover:border-[var(--gold-primary)] transition-colors mt-[4.5rem]">Contact Us</button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Value Proposition */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <Quote className="w-12 h-12 mx-auto text-[var(--gold-primary)]/40 mb-8" />
          <p className="font-serif text-2xl md:text-3xl leading-relaxed mb-8 text-foreground/90">
            &quot;Restaurants lose up to 20% of their table bookings to unanswered calls during rush hours. Automating the digital front desk isn&apos;t just about saving time—it&apos;s about reclaiming lost revenue.&quot;
          </p>
          <div>
            <p className="font-medium text-[var(--gold-primary)]">The Hospitality Edge</p>
            <p className="text-foreground/50 text-sm">Why modern restaurants adopt AI</p>
          </div>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="py-24 relative overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-[var(--gold-primary)]/5" />
        <div className="container mx-auto px-6 relative z-10 text-center max-w-2xl">
          <h2 className="font-serif text-4xl md:text-5xl mb-6">Ready to upgrade your service?</h2>
          <p className="text-foreground/70 text-lg mb-10 font-light">
            Join the forward-thinking restaurants automating their front-of-house digital experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-[var(--gold-primary)] text-[#121212] font-medium rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2">
              WhatsApp Us
            </button>
            <button className="px-8 py-4 bg-surface-high border border-surface-highest hover:border-[var(--gold-primary)]/50 text-foreground font-medium rounded-lg transition-all flex items-center justify-center gap-2">
              Enquiry Form
            </button>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-foreground/40 border-t border-[rgba(212,175,55,0.1)]">
        &copy; {new Date().getFullYear()} AIVaiter. All rights reserved.
      </footer>

      {/* Global Chat Widget */}
      <ChatWidget />
      
    </main>
  );
}
