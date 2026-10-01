import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Quote, ChevronRight, Sparkles } from 'lucide-react';
import { companyData } from '../data/companyData';

export default function Leadership({ onOpenContact }) {
  const [ceoImageIdx, setCeoImageIdx] = useState(0);
  const ceo = companyData.leadership[0];

  return (
    <section id="leadership" className="py-24 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/30 text-slate-900 relative overflow-hidden">
      {/* Background Decorative Radial */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-200/20 pointer-events-none blur-3xl opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Executive <span className="text-gold-gradient-light">Leadership</span>
          </h2>
        </div>

        {/* Centered CEO / MD Spotlight Card */}
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 sm:p-12 border border-amber-200/80 rounded-3xl relative overflow-hidden shadow-sm hover:shadow-md"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-12">
              
              {/* CEO Image Column with Toggle View */}
              <div className="flex flex-col items-center shrink-0">
                <div className="relative group">
                  <div className="w-48 h-60 sm:w-56 sm:h-72 rounded-2xl overflow-hidden border-2 border-amber-300/80 shadow-md">
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
                      className="mt-4 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300/80 text-xs text-amber-950 font-bold uppercase tracking-wider shadow-sm hover:bg-gold-gradient hover:text-slate-950 transition-all flex items-center space-x-1.5 mx-auto"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                      <span>{ceoImageIdx === 0 ? 'View Alternate Portrait' : 'View Classic Portrait'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* CEO Details Column */}
              <div className="flex-1 space-y-5 text-center md:text-left">
                
                <div className="space-y-2">
                  <div className="inline-block px-3.5 py-1 rounded-md bg-amber-50 border border-amber-300/80 text-amber-950 text-xs font-bold uppercase tracking-wider shadow-sm">
                    {ceo.title}
                  </div>
                  <h3 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                    {ceo.name}
                  </h3>
                </div>

                {/* Bio */}
                <p className="text-base text-slate-700 leading-relaxed pt-2">
                  {ceo.bio}
                </p>

                {/* Quote */}
                <blockquote className="bg-amber-50/80 p-5 rounded-2xl border-l-4 border-gold-500 border-y border-r border-amber-200/60 text-amber-950 text-base italic flex items-start space-x-3">
                  <Quote className="w-5 h-5 text-gold-600 shrink-0 mt-1" />
                  <span>"{ceo.quote}"</span>
                </blockquote>

                {/* Action Bar */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                  <span className="text-xs text-slate-600 font-semibold tracking-wide">
                    Office of the Managing Director • Lagos & Ogun State
                  </span>
                  <button
                    onClick={onOpenContact}
                    className="w-full sm:w-auto px-6 py-3 text-xs uppercase tracking-wider font-bold text-slate-950 bg-gold-gradient rounded-xl shadow-md hover:brightness-110 transition-all flex items-center justify-center space-x-1.5"
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
