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
    <section id="services" className="py-20 sm:py-28 bg-white text-slate-900 relative overflow-hidden">
      {/* Background Radial Glows */}
      <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-amber-200/20 pointer-events-none blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-100/30 pointer-events-none blur-3xl opacity-60"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14 sm:mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border border-amber-300/80 bg-amber-50 text-amber-900 text-xs uppercase tracking-widest font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>End-to-End Property Solutions</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Our Professional <span className="text-gold-gradient-light">Services</span>
          </h2>

          <p className="text-slate-700 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
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
              className="bg-white flex flex-col justify-between group hover:-translate-y-2 transition-all duration-300 border border-amber-200/80 hover:border-gold-500/60 relative overflow-hidden rounded-2xl shadow-sm hover:shadow-lg"
            >
              <div>
                {/* Visual Image Header */}
                <div className="relative h-44 sm:h-48 overflow-hidden bg-amber-50">
                  <img 
                    src={svc.image} 
                    alt={svc.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  {/* Subtle translucent gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
                  
                  {/* Service Index Badge */}
                  <div className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-amber-200/80 text-[10px] uppercase font-bold tracking-wider text-amber-950 shadow-sm">
                    Service 0{idx + 1}
                  </div>

                  {/* Icon Emblem Box */}
                  <div className="absolute bottom-3 right-3 w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md border border-amber-200/80 flex items-center justify-center text-gold-600 group-hover:scale-110 group-hover:text-amber-700 transition-all shadow-sm">
                    {getServiceIcon(svc.icon)}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-6 space-y-3">
                  <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors leading-snug">
                    {svc.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-2">
                    {svc.description}
                  </p>

                  {/* Feature Bullet Points */}
                  <ul className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                    {svc.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start text-slate-700 leading-tight">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gold-600 mr-2 shrink-0 mt-0.5" />
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
                  className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-amber-50 border border-amber-300/80 hover:bg-gold-gradient hover:text-slate-950 text-amber-950 text-xs uppercase tracking-wider font-bold transition-all duration-300 flex items-center justify-center space-x-1.5 group/btn cursor-pointer shadow-sm active:translate-y-0"
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
