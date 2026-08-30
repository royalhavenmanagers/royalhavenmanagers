import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, DollarSign, FileCheck, Search, Users, Wrench, BarChart3 } from 'lucide-react';
import { companyData } from '../data/companyData';

export default function ProcessTimeline({ onOpenContact }) {
  const getStepIcon = (idx) => {
    switch(idx) {
      case 0: return <Search className="w-5 h-5 text-gold-400" />;
      case 1: return <FileCheck className="w-5 h-5 text-gold-400" />;
      case 2: return <ShieldCheck className="w-5 h-5 text-gold-400" />;
      case 3: return <Users className="w-5 h-5 text-gold-400" />;
      case 4: return <Wrench className="w-5 h-5 text-gold-400" />;
      case 5: return <BarChart3 className="w-5 h-5 text-gold-400" />;
      default: return <CheckCircle2 className="w-5 h-5 text-gold-400" />;
    }
  };

  return (
    <section id="process" className="py-24 bg-obsidian-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs uppercase tracking-widest font-semibold">
            <span>STRUCTURED METHODOLOGY</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Our Property <span className="text-gold-gradient">Management Process</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            A clear, transparent 6-step approach to protecting your real estate investment, ensuring reliable tenancy, and maximizing rental returns.
          </p>
        </div>

        {/* Process Timeline Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {companyData.process.map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card p-8 border-gold-glow relative group flex flex-col justify-between hover:-translate-y-2 transition-all duration-300"
            >
              <div>
                {/* Step Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getStepIcon(idx)}
                  </div>
                  <span className="font-serif text-3xl font-extrabold text-gold-gradient opacity-60 group-hover:opacity-100 transition-opacity">
                    {item.step}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-white mb-3 group-hover:text-amber-200 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center text-gold-400">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Verified Step
                </span>
                <span className="text-slate-500 font-mono">Phase {idx + 1} of 6</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Benefit Banner */}
        <div className="mt-16 bg-gradient-to-r from-obsidian-800 via-obsidian-700 to-obsidian-800 rounded-2xl p-8 border border-gold-500/30 text-center max-w-4xl mx-auto shadow-gold-sm">
          <blockquote className="font-serif text-xl sm:text-2xl text-amber-200 italic mb-4">
            "Professional management isn't just collecting rent — it's protecting your investment, reducing risk, and creating long-term value."
          </blockquote>

          <button
            onClick={onOpenContact}
            className="px-8 py-3.5 text-xs uppercase tracking-widest font-bold rounded-xl text-obsidian-900 bg-gold-gradient hover:brightness-110 shadow-gold-md transition-all"
          >
            Start Property Onboarding
          </button>
        </div>

      </div>
    </section>
  );
}
