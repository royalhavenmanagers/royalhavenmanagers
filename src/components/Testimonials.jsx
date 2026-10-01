import React from 'react';
import { motion } from 'framer-motion';
import { Quote, MapPin } from 'lucide-react';
import { companyData } from '../data/companyData';

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-gradient-to-b from-amber-50/30 via-white to-amber-50/40 text-slate-900 relative overflow-hidden">
      {/* Background Decorative */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200/20 pointer-events-none blur-3xl opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Trusted By <span className="text-gold-gradient-light">Property Owners</span>
          </h2>
          <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
            See what property owners say about our management service and responsiveness.
          </p>
        </div>

        {/* 2-Card Responsive Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {companyData.testimonials.map((test, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white p-8 sm:p-10 flex flex-col justify-between border border-amber-200/80 rounded-2xl relative group hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-md hover:border-gold-500/60"
            >
              <div className="space-y-4">
                {/* Quote Icon */}
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-gold-600 group-hover:scale-105 transition-transform">
                  <Quote className="w-6 h-6" />
                </div>

                <p className="text-base sm:text-lg text-slate-800 italic leading-relaxed pt-2">
                  "{test.comment}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-serif font-bold text-slate-900 text-lg">{test.name}</h4>
                  <p className="text-xs text-amber-800 font-bold">{test.role}</p>
                </div>

                <div className="flex items-center text-xs text-slate-700 font-semibold bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200/80 self-start sm:self-auto">
                  <MapPin className="w-3.5 h-3.5 text-gold-600 mr-1.5 shrink-0" />
                  <span>{test.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
