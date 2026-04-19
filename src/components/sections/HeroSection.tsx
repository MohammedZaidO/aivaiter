import { ArrowRight, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
      {/* Background element */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--gold-primary)]/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[var(--gold-light)]/5 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-surface-low border border-[rgba(212,175,55,0.3)] text-sm text-[var(--gold-primary)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--gold-primary)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--gold-light)]"></span>
            </span>
            Meet The Ethereal Maître d&apos;
          </div>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight mb-6">
            AI receptionist for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold-primary)] to-[#fffdf5]">
              restaurants and cafés
            </span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-xl font-light leading-relaxed">
            Answer customer questions, capture bookings, and reduce missed calls automatically. Elevate your hospitality with intelligent, always-on service.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="#pricing"
              className="px-8 py-4 bg-gradient-to-tr from-[var(--gold-primary)] to-[var(--gold-light)] text-[#121212] font-medium rounded-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-2 group"
            >
              Book a Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="#demo"
              className="px-8 py-4 bg-surface-high border border-surface-highest hover:border-[var(--gold-primary)]/50 text-foreground font-medium rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-[var(--gold-primary)]" />
              Try Live Demo
            </Link>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-full">
          <div className="relative glass rounded-2xl p-6 ambient-shadow overflow-hidden">
            {/* Glossy top reflection */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--gold-light)]/50 to-transparent" />
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[var(--gold-primary)] to-[var(--gold-light)] p-[1px]">
                <div className="w-full h-full bg-surface-high rounded-full flex items-center justify-center">
                  <span className="text-[var(--gold-primary)] font-serif text-xl">A</span>
                </div>
              </div>
              <div>
                <h3 className="font-serif text-xl">AIVaiter</h3>
                <p className="text-sm text-[var(--gold-primary)]/80">Always active</p>
              </div>
            </div>

            <div className="space-y-4 font-sans text-sm pb-10">
              <div className="flex justify-end">
                <div className="bg-surface-low border border-surface-highest rounded-2xl px-4 py-3 max-w-[85%] rounded-tr-none">
                  Do you have tables available for 2 people tonight at 8 PM?
                </div>
              </div>
              
              <div className="flex justify-start">
                <div className="bg-gradient-to-br from-surface-highest to-surface-high rounded-2xl px-4 py-3 max-w-[85%] rounded-tl-none border border-transparent">
                  Yes, we have a table available at 8:00 PM for 2 guests. Shall I book that for you under what name?
                </div>
              </div>

              <div className="flex justify-end">
                <div className="bg-surface-low border border-surface-highest rounded-2xl px-4 py-3 max-w-[85%] rounded-tr-none relative group cursor-pointer transition-all hover:bg-surface-high">
                   Under the name James.
                   {/* subtle interaction hint */}
                   <div className="absolute inset-0 rounded-2xl ring-1 ring-[var(--gold-primary)]/0 group-hover:ring-[var(--gold-primary)]/50 transition-all" />
                </div>
              </div>
            </div>

            {/* Input Mockup */}
            <div className="absolute bottom-6 left-6 right-6">
               <div className="flex w-full bg-surface-highest border border-[rgba(212,175,55,0.1)] rounded-full px-4 py-3 items-center">
                  <span className="text-foreground/40 text-sm">Great, setting up your booking...</span>
                  <div className="w-6 h-6 ml-auto bg-[var(--gold-primary)] rounded-full flex items-center justify-center">
                    <ArrowRight className="w-3 h-3 text-[#121212]" />
                  </div>
               </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
