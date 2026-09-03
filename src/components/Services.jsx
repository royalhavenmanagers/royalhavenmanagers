import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Home, Key, Compass, UserCheck, 
  FileText, ClipboardCheck, TrendingUp, ChevronRight, CheckCircle2, Wrench 
} from 'lucide-react';
import { companyData } from '../data/companyData';

export default function Services({ onOpenContact }) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Building2': return <Building2 className="w-8 h-8" />;
      case 'Wrench': return <Wrench className="w-8 h-8" />;
      case 'Key': return <Key className="w-8 h-8" />;
      case 'Compass': return <Compass className="w-8 h-8" />;
      case 'UserCheck': return <UserCheck className="w-8 h-8" />;
      case 'FileText': return <FileText className="w-8 h-8" />;
      case 'ClipboardCheck': return <ClipboardCheck className="w-8 h-8" />;
      case 'TrendingUp': return <TrendingUp className="w-8 h-8" />;
      default: return <Building2 className="w-8 h-8" />;
    }
  };

  return (
    <section id="services" className="py-24 bg-obsidian-900 bg-[#0a0a0e] text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold-glow pointer-events-none blur-3xl opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs uppercase tracking-widest font-bold">
            <span>OUR SERVICES</span>
          </div>
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
                <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:bg-gold-gradient group-hover:text-obsidian-900 transition-colors duration-300 shadow-gold-sm">
                  {getIcon(svc.icon)}
                </div>

                <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-200 transition-colors">
                  {svc.title}
                </h3>

                <p className="text-sm text-slate-200 leading-relaxed">
                  {svc.description}
                </p>

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
