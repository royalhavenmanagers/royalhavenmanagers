import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, FileCheck, Search, Users, Wrench, BarChart3 } from 'lucide-react';
import { companyData } from '../data/companyData';

export default function ProcessTimeline({ onOpenContact }) {
  const getStepIcon = (idx) => {
    switch(idx) {
      case 0: return <Search className="w-6 h-6 text-gold-400" />;
      case 1: return <FileCheck className="w-6 h-6 text-gold-400" />;
      case 2: return <ShieldCheck className="w-6 h-6 text-gold-400" />;
      case 3: return <Users className="w-6 h-6 text-gold-400" />;
      case 4: return <Wrench className="w-6 h-6 text-gold-400" />;
      case 5: return <BarChart3 className="w-6 h-6 text-gold-400" />;
      default: return <CheckCircle2 className="w-6 h-6 text-gold-400" />;
    }
  };

  return (
    <section id="process" className="py-24 bg-obsidian-900 bg-[#0a0a0e] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs uppercase tracking-widest font-bold">
            <span>OUR MANAGEMENT PROCESS</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Our Property <span className="text-gold-gradient">Management Process</span>
          </h2>
          <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
            Our proven process ensures that every property is professionally managed with transparency, efficiency, and accountability.
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
                  <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getStepIcon(idx)}
                  </div>
                  <span className="font-serif text-4xl font-extrabold text-gold-gradient opacity-60 group-hover:opacity-100 transition-opacity">
                    {item.step}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-white mb-3 group-hover:text-amber-200 transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center text-gold-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Verified Process
                </span>
                <span className="text-slate-400 font-mono font-medium">Step {idx + 1} of 6</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Quote Banner */}
        <div className="mt-16 bg-gradient-to-r from-obsidian-800 via-obsidian-700 to-obsidian-800 rounded-2xl p-8 border border-gold-500/30 text-center max-w-4xl mx-auto shadow-gold-sm">
          <blockquote className="font-serif text-xl sm:text-2xl text-amber-200 italic mb-6 leading-relaxed">
            "We manage your property like it's our own. Your investment. Our priority."
          </blockquote>

          <button
            onClick={onOpenContact}
            className="px-8 py-4 text-xs uppercase tracking-widest font-bold rounded-xl text-obsidian-900 bg-gold-gradient hover:brightness-110 shadow-gold-md transition-all"
          >
            Start Management Onboarding
          </button>
        </div>

      </div>
    </section>
  );
}
