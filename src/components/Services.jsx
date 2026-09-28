import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Building2, 
  Wrench, 
  Key, 
  Compass, 
  UserCheck, 
  FileText, 
  ClipboardCheck, 
  TrendingUp, 
  ArrowRight, 
  Sparkles 
} from 'lucide-react';
import { companyData } from '../data/companyData';

const serviceIcons = {
  Building2,
  Wrench,
  Key,
  Compass,
  UserCheck,
  FileText,
  ClipboardCheck,
  TrendingUp,
};

function getServiceIcon(iconName) {
  const IconComponent = serviceIcons[iconName] || Building2;
  return <IconComponent className="w-5 h-5" />;
}

export default function Services({ onOpenContact }) {
  return (
    <section id="services" className="py-20 sm:py-28 bg-obsidian-900 bg-[#0a0a0e] text-white relative overflow-hidden">
      {/* Background Radial Glows */}
      <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-gold-glow pointer-events-none blur-3xl opacity-15"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/10 pointer-events-none blur-3xl opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14 sm:mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs uppercase tracking-widest font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>End-to-End Property Solutions</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Our Professional <span className="text-gold-gradient">Services</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Comprehensive property management, vetted tenant matching, routine inspections, and legal safeguards tailored for Lagos State, Ogun State, and Diaspora property owners.
          </p>
        </div>

        {/* Responsive Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {companyData.services.map((svc, idx) => (
            <motion.div
              key={svc.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="glass-card flex flex-col justify-between group hover:-translate-y-2 transition-all duration-300 border-gold-glow relative overflow-hidden rounded-2xl shadow-gold-sm hover:shadow-gold-md"
            >
              <div>
                {/* Visual Image Header */}
                <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-950">
                  <img 
                    src={svc.image} 
                    alt={svc.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/40 to-transparent"></div>
                  
                  {/* Service Index Badge */}
                  <div className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-gold-500/40 text-[10px] uppercase font-bold tracking-wider text-amber-300 shadow-sm">
                    Service 0{idx + 1}
                  </div>

                  {/* Icon Emblem Box */}
                  <div className="absolute bottom-3 right-3 w-10 h-10 rounded-xl bg-obsidian-900/90 backdrop-blur-md border border-gold-500/40 flex items-center justify-center text-gold-400 group-hover:scale-110 group-hover:text-amber-200 transition-all shadow-md">
                    {getServiceIcon(svc.icon)}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-6 space-y-3">
                  <h3 className="font-serif text-lg font-bold text-white group-hover:text-amber-200 transition-colors leading-snug">
                    {svc.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal line-clamp-2">
                    {svc.description}
                  </p>

                  {/* Feature Bullet Points */}
                  <ul className="space-y-2 pt-3 border-t border-white/10 text-xs">
                    {svc.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start text-slate-200 leading-tight">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 mr-2 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 sm:p-6 pt-0 mt-2">
                <button
                  onClick={() => onOpenContact && onOpenContact({ service: svc.title })}
                  className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-obsidian-900 border border-gold-500/40 hover:bg-gold-gradient hover:text-slate-950 text-amber-200 text-xs uppercase tracking-wider font-bold transition-all duration-300 flex items-center justify-center space-x-1.5 group/btn cursor-pointer shadow-sm active:translate-y-0"
                >
                  <span>Inquire Now</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
