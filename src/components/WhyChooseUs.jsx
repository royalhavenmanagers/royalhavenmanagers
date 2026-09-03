import React from 'react';
import { motion } from 'framer-motion';

export default function WhyChooseUs({ onOpenContact }) {
  const points = [
    {
      title: "Transparent Operations",
      description: "We believe in openness and clear communication. Our clients receive full visibility, financial statements, and regular inspection updates on their properties."
    },
    {
      title: "Professional Expertise",
      description: "Our team consists of trained estate managers with deep industry knowledge and proven experience in property management and tenancy compliance."
    },
    {
      title: "Maximum Return on Investment",
      description: "We implement smart preventative maintenance and tenant vetting strategies that protect property value, minimize vacancies, and secure prompt rental income."
    }
  ];

  return (
    <section className="hidden md:block py-24 bg-obsidian-900 bg-[#0a0a0e] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Why Choose <span className="text-gold-gradient">Royal Haven</span>
          </h2>
        </div>

        {/* 3 Grid Cards (Desktop/Tablet only) */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {points.map((pt, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card p-8 border-gold-glow flex flex-col justify-between group hover:-translate-y-2 transition-all duration-300"
            >
              <div className="space-y-4">
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

      </div>
    </section>
  );
}
