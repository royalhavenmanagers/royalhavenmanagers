import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Zap, TrendingUp, HeartHandshake, Layers } from 'lucide-react';

export default function WhyChooseUs({ onOpenContact }) {
  const points = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-gold-400" />,
      title: "Transparent Operations",
      description: "We believe in openness and clear communication. Our clients receive full visibility and regular updates on their properties."
    },
    {
      icon: <Award className="w-8 h-8 text-gold-400" />,
      title: "Professional Expertise",
      description: "Our team consists of trained professionals with deep industry knowledge and proven experience in real estate and property management."
    },
    {
      icon: <Zap className="w-8 h-8 text-gold-400" />,
      title: "Fast & Reliable Response",
      description: "We respond quickly to issues, maintenance requests, and client needs to ensure seamless property management."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-gold-400" />,
      title: "Maximum Return on Investment",
      description: "We implement smart strategies that increase property value, reduce vacancy, and maximize rental income."
    },
    {
      icon: <HeartHandshake className="w-8 h-8 text-gold-400" />,
      title: "Trusted By Property Owners",
      description: "Our integrity, consistency, and results have earned us the trust of landlords, investors, and corporate clients."
    },
    {
      icon: <Layers className="w-8 h-8 text-gold-400" />,
      title: "End-to-End Property Solutions",
      description: "From acquisition to management and advisory, we provide comprehensive solutions under one roof."
    }
  ];

  return (
    <section className="py-24 bg-obsidian-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs uppercase tracking-widest font-bold">
            <span>WHY CHOOSE US</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Why Choose <span className="text-gold-gradient">Royal Haven</span>
          </h2>
          <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
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
                <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center group-hover:bg-gold-gradient group-hover:text-obsidian-900 transition-colors shadow-gold-sm">
                  {pt.icon}
                </div>

                <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-200 transition-colors">
                  {pt.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                  {pt.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Bar */}
        <div className="mt-16 bg-obsidian-950 p-8 sm:p-10 rounded-2xl border border-gold-500/30 text-center flex flex-col sm:flex-row items-center justify-between shadow-gold-md gap-6">
          <div className="text-left max-w-xl">
            <h4 className="font-serif text-xl sm:text-2xl font-bold text-white">Your Property is Not Just Managed — It's Protected.</h4>
            <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">At Royal Haven Realty & Property Managers Ltd., your property is handled with the highest level of care.</p>
          </div>
          
          <button
            onClick={onOpenContact}
            className="px-8 py-4 text-xs uppercase tracking-widest font-bold rounded-xl text-obsidian-900 bg-gold-gradient hover:brightness-110 transition-all shrink-0"
          >
            Speak With Us Today
          </button>
        </div>

      </div>
    </section>
  );
}
