import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Zap, TrendingUp, HeartHandshake, Layers } from 'lucide-react';
import { companyData } from '../data/companyData';

export default function WhyChooseUs({ onOpenContact }) {
  const points = [
    {
      icon: <ShieldCheck className="w-7 h-7 text-gold-400" />,
      title: "Transparent Operations",
      description: "Complete visibility with clear statements, open communication, and regular property health reports."
    },
    {
      icon: <Award className="w-7 h-7 text-gold-400" />,
      title: "Professional Expertise",
      description: "Our certified real estate team possesses deep industry knowledge across Lagos, Ogun, and national markets."
    },
    {
      icon: <Zap className="w-7 h-7 text-gold-400" />,
      title: "Fast & Reliable Response",
      description: "Rapid resolution of maintenance requests, tenant inquiries, and emergency property needs."
    },
    {
      icon: <TrendingUp className="w-7 h-7 text-gold-400" />,
      title: "Maximum ROI",
      description: "Smart yield strategies that increase asset value, minimize rental vacancy, and optimize cash flow."
    },
    {
      icon: <HeartHandshake className="w-7 h-7 text-gold-400" />,
      title: "Trusted By Property Owners",
      description: "Built on integrity, consistency, and results earned across private landlords and corporate clients."
    },
    {
      icon: <Layers className="w-7 h-7 text-gold-400" />,
      title: "End-to-End Property Solutions",
      description: "From property acquisition to tenant screening, maintenance, and valuation — all under one roof."
    }
  ];

  return (
    <section className="py-24 bg-obsidian-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs uppercase tracking-widest font-semibold">
            <span>THE ROYAL HAVEN DIFFERENCE</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Why Choose <span className="text-gold-gradient">Royal Haven</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            We are committed to delivering exceptional property management and real estate solutions with integrity, professionalism, and a client-first approach.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {points.map((pt, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="glass-card p-8 border-gold-glow flex flex-col justify-between group hover:-translate-y-2 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center group-hover:bg-gold-gradient group-hover:text-obsidian-900 transition-colors shadow-gold-sm">
                  {pt.icon}
                </div>

                <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-200 transition-colors">
                  {pt.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {pt.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Bar */}
        <div className="mt-16 bg-obsidian-950 p-8 rounded-2xl border border-gold-500/30 text-center flex flex-col sm:flex-row items-center justify-between shadow-gold-md">
          <div className="text-left mb-4 sm:mb-0">
            <h4 className="font-serif text-lg font-bold text-white">Your Property is Not Just Managed — It's Protected.</h4>
            <p className="text-xs text-slate-400">Experience royalty-grade real estate care tailored to your goals.</p>
          </div>
          
          <button
            onClick={onOpenContact}
            className="px-6 py-3 text-xs uppercase tracking-widest font-bold rounded-xl text-obsidian-900 bg-gold-gradient hover:brightness-110 transition-all shrink-0"
          >
            Speak With An Expert
          </button>
        </div>

      </div>
    </section>
  );
}
