import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Home, Key, Compass, UserCheck, 
  FileText, ClipboardCheck, TrendingUp, ChevronRight, CheckCircle2 
} from 'lucide-react';
import { companyData } from '../data/companyData';

export default function Services({ onOpenContact }) {
  const [selectedService, setSelectedService] = useState(null);

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Building2': return <Building2 className="w-7 h-7" />;
      case 'Home': return <Home className="w-7 h-7" />;
      case 'Key': return <Key className="w-7 h-7" />;
      case 'Compass': return <Compass className="w-7 h-7" />;
      case 'UserCheck': return <UserCheck className="w-7 h-7" />;
      case 'FileText': return <FileText className="w-7 h-7" />;
      case 'ClipboardCheck': return <ClipboardCheck className="w-7 h-7" />;
      case 'TrendingUp': return <TrendingUp className="w-7 h-7" />;
      default: return <Building2 className="w-7 h-7" />;
    }
  };

  return (
    <section id="services" className="py-24 bg-obsidian-900 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold-glow pointer-events-none blur-3xl opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs uppercase tracking-widest font-semibold">
            <span>EXPERTISE & SOLUTIONS</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Our Professional <span className="text-gold-gradient">Services</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Tailored real estate management, advisory, and asset protection solutions designed to protect your investments and maximize your returns.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {companyData.services.map((svc, idx) => (
            <motion.div
              key={svc.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="glass-card p-6 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-300 border-gold-glow relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:bg-gold-gradient group-hover:text-obsidian-900 transition-colors duration-300 shadow-gold-sm">
                  {getIcon(svc.icon)}
                </div>

                <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-200 transition-colors">
                  {svc.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {svc.description}
                </p>

                {/* Feature Bullet Points */}
                <ul className="space-y-2 pt-2 border-t border-white/5">
                  {svc.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center text-[11px] text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 mr-2 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <button
                  onClick={onOpenContact}
                  className="w-full py-2.5 rounded-lg border border-gold-500/30 text-gold-300 text-xs font-semibold uppercase tracking-wider hover:bg-gold-gradient hover:text-obsidian-900 transition-all duration-300 flex items-center justify-center group-hover:border-transparent"
                >
                  <span>Inquire Now</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 glass-card p-8 text-center sm:flex items-center justify-between border-gold-glow">
          <div className="text-left max-w-xl mb-4 sm:mb-0">
            <h4 className="font-serif text-xl font-bold text-white">Need a Custom Real Estate Solution?</h4>
            <p className="text-xs text-slate-300 mt-1">Our expert team prepares personalized property management proposals tailored specifically to your portfolio size and location goals.</p>
          </div>

          <button
            onClick={onOpenContact}
            className="px-6 py-3.5 text-xs uppercase tracking-widest font-bold rounded-xl text-obsidian-900 bg-gold-gradient hover:brightness-110 shadow-gold-md transition-all shrink-0"
          >
            Get Custom Proposal
          </button>
        </div>

      </div>
    </section>
  );
}
