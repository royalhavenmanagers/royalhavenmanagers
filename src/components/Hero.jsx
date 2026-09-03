import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Award, CheckCircle2 } from 'lucide-react';
import { companyData } from '../data/companyData';

export default function Hero({ onOpenContact }) {
  return (
    <section id="home" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-amber-50/60 via-white to-amber-50/40 pt-10 pb-20 sm:py-24">
      {/* Background Decorative Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-200/20 pointer-events-none blur-3xl opacity-60"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-100/30 pointer-events-none blur-2xl opacity-40"></div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-40"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Copy & CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-7 text-center lg:text-left"
          >
            {/* Top Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-amber-300/80 bg-amber-50 shadow-sm">
              <Award className="w-4 h-4 text-gold-600 shrink-0" />
              <span className="text-xs sm:text-sm uppercase tracking-widest text-amber-900 font-bold">
                {companyData.tagline}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Building Trust. <br />
              <span className="text-gold-gradient-light">Managing Excellence.</span> <br />
              Creating Value.
            </h1>

            {/* Subtitle */}
            <p className="text-slate-800 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Premier property management, thorough tenant screening, proactive facility upkeep, and transparent rent remittance across <span className="text-amber-900 font-bold">Lagos State, Ogun State,</span> and surrounding environs.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3.5 pt-2">
              <div className="flex items-center text-sm font-bold text-slate-950 bg-white px-4 py-2.5 rounded-xl border border-amber-200 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-gold-600 mr-2 shrink-0" />
                <span>Professional Property Management</span>
              </div>
              <div className="flex items-center text-sm font-bold text-slate-950 bg-white px-4 py-2.5 rounded-xl border border-amber-200 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-gold-600 mr-2 shrink-0" />
                <span>Thorough Tenant Screening</span>
              </div>
              <div className="flex items-center text-sm font-bold text-slate-950 bg-white px-4 py-2.5 rounded-xl border border-amber-200 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-gold-600 mr-2 shrink-0" />
                <span>Transparent Reporting & Remittance</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onOpenContact}
                className="w-full sm:w-auto px-9 py-4 text-sm uppercase tracking-widest font-bold rounded-xl text-slate-950 bg-gold-gradient hover:brightness-110 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 group"
              >
                <span>Request Consultation</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#services"
                className="w-full sm:w-auto px-8 py-4 text-sm uppercase tracking-widest font-bold rounded-xl text-slate-950 bg-white border border-amber-300/80 hover:bg-amber-50 transition-colors duration-300 flex items-center justify-center shadow-sm"
              >
                <span>Our Services</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Visual Card Showcase */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Glow Border Frame */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-300 via-gold-400 to-amber-500 blur-lg opacity-40"></div>

              {/* Main Visual Card */}
              <div className="relative bg-white rounded-3xl p-6 border border-amber-200 shadow-xl overflow-hidden">
                <div className="relative h-72 sm:h-80 rounded-2xl overflow-hidden border border-slate-200">
                  <img 
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80" 
                    alt="Royal Haven Modern Property Management"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>

                  {/* Floating Tag */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-300 text-xs font-bold uppercase tracking-wider text-amber-900 shadow-sm">
                    Lagos & Ogun State
                  </div>
                  
                  <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                    <p className="text-xs text-gold-400 font-bold tracking-wider uppercase">Royal Haven Management Standard</p>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold">Excellence in Property. Royalty in Service.</h3>
                  </div>
                </div>

                {/* Core Pillars inside Card */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-5 border-t border-slate-100 text-center">
                  {companyData.pillars.map((pil, idx) => (
                    <div key={idx} className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/60">
                      <p className="font-serif text-sm font-black text-gold-gradient-light">{pil.label}</p>
                      <p className="text-[11px] text-slate-950 font-bold mt-0.5">{pil.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Small Floating Trust Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white border border-amber-300 p-4 rounded-2xl shadow-lg hidden sm:flex items-center space-x-3">
                <div className="p-3 bg-amber-100 rounded-xl border border-amber-300 text-gold-700">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 uppercase tracking-wider">Your Property. Our Priority.</p>
                  <p className="text-xs text-slate-800 font-bold">Transparent & Reliable Care</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
