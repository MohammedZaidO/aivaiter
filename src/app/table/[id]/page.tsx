import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Table Mode | Saffron Table",
  description: "Dine-in AI concierge for Saffron Table.",
};

export default function TablePage({ params }: { params: { id: string } }) {
  // The ChatWidget in layout.tsx will read the pathname and auto-open.
  // We just render a background to represent the restaurant setting.
  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Cinematic Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[rgba(212,175,55,0.08)] via-background to-background" />
      
      {/* Content */}
      <div className="z-10 text-center flex flex-col items-center max-w-lg">
        <div className="w-20 h-20 bg-gradient-to-tr from-[var(--gold-primary)] to-[var(--gold-light)] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.3)] mb-6 animate-float">
          <span className="text-[#121212] font-serif text-3xl font-bold">{params.id}</span>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-serif mb-4">Saffron Table</h1>
        <p className="text-foreground/70 mb-8 max-w-md text-sm md:text-base leading-relaxed">
          Welcome to Table {params.id}. Your digital concierge has automatically opened to take your order. You can use voice or text to explore the menu.
        </p>

        <div className="px-6 py-3 rounded-full border border-[var(--gold-primary)]/20 bg-surface/50 text-xs tracking-widest uppercase text-[var(--gold-primary)]">
          Table Mode Active
        </div>
      </div>
    </main>
  );
}
