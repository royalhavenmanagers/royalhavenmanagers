import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Quote, CheckCircle, Mail, Phone } from 'lucide-react';
import { companyData } from '../data/companyData';

export default function Leadership({ onOpenContact }) {
  const [ceoImageIdx, setCeoImageIdx] = useState(0);

  const ceo = companyData.leadership[0];
  const partner = companyData.leadership[1];

  return (
    <section id="leadership" className="py-24 bg-obsidian-950 relative overflow-hidden">
      {/* Background Decorative Radial */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gold-glow pointer-events-none blur-3xl opacity-25"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs uppercase tracking-widest font-semibold">
            <Award className="w-3.5 h-3.5 mr-1" />
            <span>EXECUTIVE GOVERNANCE</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Our <span className="text-gold-gradient">Leadership Team</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Guided by seasoned real estate professionals committed to integrity, client accountability, and royalty-grade property management standards.
          </p>
        </div>

        {/* Leadership Spotlight Cards */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Managing Director / CEO Spotlight */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 glass-card p-8 border-gold-glow flex flex-col justify-between relative overflow-hidden"
          >
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                
                {/* CEO Image Container with Toggle View */}
                <div className="relative group shrink-0">
                  <div className="w-36 h-44 rounded-2xl overflow-hidden border-2 border-gold-500/40 shadow-gold-md">
                    <img 
                      src={ceo.images[ceoImageIdx]} 
                      alt={ceo.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Toggle Button for Alternate Portrait */}
                  {ceo.images.length > 1 && (
                    <button
                      onClick={() => setCeoImageIdx((prev) => (prev === 0 ? 1 : 0))}
                      className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-obsidian-900 border border-gold-500/50 text-[10px] text-amber-200 px-3.5 py-0.5 rounded-full font-bold uppercase shadow-gold-sm hover:bg-gold-500 hover:text-obsidian-900 transition-colors"
                    >
                      Switch View
                    </button>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-2 text-center sm:text-left">
                  <div className="inline-block px-3 py-1 rounded-md bg-gold-500/10 border border-gold-500/30 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
                    {ceo.title}
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white">{ceo.name}</h3>
                  <p className="text-xs text-gold-400 font-medium">{ceo.role}</p>

                  <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                    <span className="text-[10px] bg-obsidian-900 px-2.5 py-1 rounded-lg border border-white/10 text-slate-300">Strategic Vision</span>
                    <span className="text-[10px] bg-obsidian-900 px-2.5 py-1 rounded-lg border border-white/10 text-slate-300">Portfolio Governance</span>
                  </div>
                </div>
              </div>

              {/* Bio & Quote */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-4 border-t border-white/5">
                {ceo.bio}
              </p>

              <blockquote className="bg-obsidian-900/80 p-4 rounded-xl border-l-4 border-gold-500 text-amber-200 text-xs sm:text-sm italic flex items-start space-x-3">
                <Quote className="w-5 h-5 text-gold-500 shrink-0" />
                <span>"{ceo.quote}"</span>
              </blockquote>
            </div>

            <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-slate-400">Direct Executive Desk</span>
              <button
                onClick={onOpenContact}
                className="px-4 py-2 text-xs uppercase tracking-wider font-bold text-obsidian-900 bg-gold-gradient rounded-lg shadow-gold-sm hover:brightness-110 transition-all"
              >
                Schedule Meeting
              </button>
            </div>
          </motion.div>

          {/* Associate Partner Spotlight */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 glass-card p-8 border-gold-glow flex flex-col justify-between relative overflow-hidden"
          >
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                
                {/* Partner Image */}
                <div className="w-36 h-44 rounded-2xl overflow-hidden border-2 border-gold-500/40 shadow-gold-md shrink-0">
                  <img 
                    src={partner.images[0]} 
                    alt={partner.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Info */}
                <div className="space-y-2 text-center sm:text-left">
                  <div className="inline-block px-3 py-1 rounded-md bg-gold-500/10 border border-gold-500/30 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
                    {partner.title}
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white">{partner.name}</h3>
                  <p className="text-xs text-gold-400 font-medium">{partner.role}</p>

                  <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                    <span className="text-[10px] bg-obsidian-900 px-2.5 py-1 rounded-lg border border-white/10 text-slate-300">Client Operations</span>
                    <span className="text-[10px] bg-obsidian-900 px-2.5 py-1 rounded-lg border border-white/10 text-slate-300">Tenancy Vetting</span>
                  </div>
                </div>
              </div>

              {/* Bio & Quote */}
              <p className="text-xs text-slate-300 leading-relaxed pt-4 border-t border-white/5">
                {partner.bio}
              </p>

              <blockquote className="bg-obsidian-900/80 p-4 rounded-xl border-l-4 border-gold-500 text-amber-200 text-xs italic flex items-start space-x-3">
                <Quote className="w-4 h-4 text-gold-500 shrink-0" />
                <span>"{partner.quote}"</span>
              </blockquote>
            </div>

            <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-slate-400">Operations & Advisory</span>
              <button
                onClick={onOpenContact}
                className="px-4 py-2 text-xs uppercase tracking-wider font-bold text-slate-200 border border-gold-500/40 rounded-lg hover:bg-gold-500/10 transition-colors"
              >
                Inquire Operations
              </button>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
