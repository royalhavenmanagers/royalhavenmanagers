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
            Collaborating with trusted lifestyle brands, wellness partners, and digital innovators to deliver royalty-grade service.
          </p>
        </div>

        {/* Partners Grid - 4 Verified Partners */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {companyData.partners.map((partner, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-slate-800/90 border border-slate-700/90 hover:border-gold-500/70 p-6 rounded-2xl flex flex-col items-center justify-between text-center space-y-4 group hover:-translate-y-1.5 transition-all duration-300 shadow-lg min-h-[190px]"
            >
              {/* Logo container with dark backdrop for high contrast logos */}
              <div className="w-20 h-20 rounded-2xl bg-slate-950 p-2.5 border border-slate-700/80 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-md">
                {partner.logo ? (
                  <img 
                    src={partner.logo} 
                    alt={partner.name} 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Building className="w-8 h-8 text-gold-400" />
                )}
              </div>

              <div>
                <h4 className="font-serif font-bold text-white text-base group-hover:text-amber-300 transition-colors leading-tight">
                  {partner.name}
                </h4>
                <p className="text-xs text-amber-200/80 mt-1.5 font-medium leading-relaxed">
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
