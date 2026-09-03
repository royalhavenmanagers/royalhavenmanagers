import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { companyData } from '../data/companyData';

export default function Services({ onOpenContact }) {
  return (
    <section id="services" className="py-24 bg-obsidian-900 bg-[#0a0a0e] text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold-glow pointer-events-none blur-3xl opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Our Professional <span className="text-gold-gradient">Services</span>
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-7">
          {companyData.services.map((svc, idx) => (
            <motion.div
              key={svc.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="glass-card p-7 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-300 border-gold-glow relative overflow-hidden"
            >
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-200 transition-colors">
                  {svc.title}
                </h3>

                {/* Feature Bullet Points */}
                <ul className="space-y-2.5 pt-3 border-t border-white/10">
                  {svc.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center text-xs font-medium text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-gold-500 mr-2 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
