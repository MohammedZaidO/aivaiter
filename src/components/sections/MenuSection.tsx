"use client";

import { restaurantConfig } from "@/data/restaurant";
import { motion } from "framer-motion";
import { Utensils } from "lucide-react";

export default function MenuSection() {
  const menu = (restaurantConfig as any).featuredMenu || [];

  return (
    <section id="menu" className="py-24 relative overflow-hidden bg-surface-low/30">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-[var(--gold-primary)]/10 border border-[var(--gold-primary)]/20 text-xs text-[var(--gold-primary)] uppercase tracking-widest">
            <Utensils className="w-3 h-3" />
            Seasonal Favorites
          </div>
          <h2 className="font-serif text-3xl md:text-5xl mb-4">A Taste of Tradition</h2>
          <p className="text-foreground/60 max-w-2xl mx-auto text-lg font-light">
            Hand-picked selections from our master chefs, featuring authentic flavors and the finest local ingredients.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {menu.map((cat: any, idx: number) => (
            <div key={idx} className="space-y-8">
              <h3 className="font-serif text-2xl pb-2 border-b border-[var(--gold-primary)]/20 text-[var(--gold-primary)]">
                {cat.category}
              </h3>
              <div className="space-y-8">
                {cat.items.map((item: any, itemIdx: number) => (
                  <motion.div 
                    key={itemIdx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: itemIdx * 0.1 }}
                    className="group"
                  >
                    <div className="flex justify-between items-baseline mb-2">
                      <h4 className="text-xl font-medium tracking-wide group-hover:text-[var(--gold-primary)] transition-colors">
                        {item.name}
                      </h4>
                      <div className="flex-1 mx-4 border-b border-dotted border-foreground/10 group-hover:border-[var(--gold-primary)]/30 transition-colors" />
                      <span className="font-serif text-[var(--gold-primary)]">{item.price}</span>
                    </div>
                    <p className="text-foreground/50 font-light text-sm leading-relaxed max-w-md">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-foreground/40 italic mb-8">
            * This is a selection of our signature offerings. Ask the AI concierge for the full menu or dietary specifics.
          </p>
          <a 
            href="#demo"
            className="inline-flex px-8 py-3 rounded-full border border-[var(--gold-primary)]/30 text-[var(--gold-primary)] hover:bg-[var(--gold-primary)] hover:text-[#121212] transition-all font-medium"
          >
            Ask about the Full Menu
          </a>
        </div>
      </div>
    </section>
  );
}
