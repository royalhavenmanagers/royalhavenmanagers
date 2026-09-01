import React from 'react';
import { motion } from 'framer-motion';
import { Handshake, Building } from 'lucide-react';
import { companyData } from '../data/companyData';

export default function PartnersSection() {
  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Subtle Radial */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 pointer-events-none blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-amber-500/40 bg-amber-950/60 text-amber-300 text-xs uppercase tracking-widest font-bold">
            <Handshake className="w-4 h-4 mr-1.5 text-gold-400 shrink-0" />
            <span>TRUSTED PARTNERSHIPS & CLIENTS</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Companies & Partners We <span className="text-gold-gradient">Work With</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Collaborating with leading financial institutions, state housing bodies, and estate developers to deliver excellence.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {companyData.partners.map((partner, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-slate-800/90 border border-slate-700/80 hover:border-gold-500/60 p-5 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 group hover:-translate-y-1 transition-all shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-bold font-serif text-base tracking-wider text-gold-400 group-hover:scale-105 transition-transform">
                <Building className="w-6 h-6 text-gold-400" />
              </div>

              <div>
                <h4 className="font-serif font-bold text-white text-sm group-hover:text-amber-300 transition-colors leading-tight">
                  {partner.name}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 font-medium">
                  {partner.category}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
