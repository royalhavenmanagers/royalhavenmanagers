import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Quote, ChevronRight, Sparkles } from 'lucide-react';
import { companyData } from '../data/companyData';

export default function Leadership({ onOpenContact }) {
  const [ceoImageIdx, setCeoImageIdx] = useState(0);
  const ceo = companyData.leadership[0];

  return (
    <section id="leadership" className="py-24 bg-obsidian-950 bg-[#060608] text-white relative overflow-hidden">
      {/* Background Decorative Radial */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gold-glow pointer-events-none blur-3xl opacity-25"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Executive <span className="text-gold-gradient">Leadership</span>
          </h2>
        </div>

        {/* Centered CEO / MD Spotlight Card */}
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8 sm:p-12 border-gold-glow relative overflow-hidden shadow-gold-md"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-12">
              
              {/* CEO Image Column with Toggle View */}
              <div className="flex flex-col items-center shrink-0">
                <div className="relative group">
                  <div className="w-48 h-60 sm:w-56 sm:h-72 rounded-2xl overflow-hidden border-2 border-gold-500/50 shadow-gold-md">
                    <img 
                      src={ceo.images[ceoImageIdx]} 
                      alt={ceo.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Toggle Button for Alternate Portrait */}
                  {ceo.images && ceo.images.length > 1 && (
                    <button
                      onClick={() => setCeoImageIdx((prev) => (prev === 0 ? 1 : 0))}
                      className="mt-4 px-4 py-1.5 rounded-full bg-obsidian-900 border border-gold-500/60 text-xs text-amber-200 font-bold uppercase tracking-wider shadow-gold-sm hover:bg-gold-gradient hover:text-obsidian-900 transition-all flex items-center space-x-1.5 mx-auto"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{ceoImageIdx === 0 ? 'View Alternate Portrait' : 'View Classic Portrait'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* CEO Details Column */}
              <div className="flex-1 space-y-5 text-center md:text-left">
                
                <div className="space-y-2">
                  <div className="inline-block px-3.5 py-1 rounded-md bg-gold-500/10 border border-gold-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                    {ceo.title}
                  </div>
                  <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    {ceo.name}
                  </h3>
                </div>

                {/* Bio */}
                <p className="text-base text-slate-200 leading-relaxed pt-2">
                  {ceo.bio}
                </p>

                {/* Quote */}
                <blockquote className="bg-obsidian-900/90 p-5 rounded-2xl border-l-4 border-gold-500 text-amber-200 text-base italic flex items-start space-x-3">
                  <Quote className="w-5 h-5 text-gold-500 shrink-0 mt-1" />
                  <span>"{ceo.quote}"</span>
                </blockquote>

                {/* Action Bar */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
                  <span className="text-xs text-amber-200 font-bold tracking-wide">
                    Office of the Managing Director • Lagos & Ogun State
                  </span>
                  <button
                    onClick={onOpenContact}
                    className="w-full sm:w-auto px-6 py-3 text-xs uppercase tracking-wider font-bold text-obsidian-900 bg-gold-gradient rounded-xl shadow-gold-sm hover:brightness-110 transition-all flex items-center justify-center space-x-1.5"
                  >
                    <span>Request Executive Consultation</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
