import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Award, CheckCircle2 } from 'lucide-react';
import { companyData } from '../data/companyData';

export default function Hero({ onOpenContact }) {
  return (
    <section id="home" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-obsidian-900 pt-10 pb-20 sm:py-24">
      {/* Background Decorative Gold Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gold-glow pointer-events-none blur-3xl opacity-35"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold-glow pointer-events-none blur-2xl opacity-20"></div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f26_1px,transparent_1px),linear-gradient(to_bottom,#1f1f26_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-25"></div>

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
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-gold-500/40 bg-obsidian-800/90 backdrop-blur-md shadow-gold-sm">
              <Award className="w-4 h-4 text-gold-500 shrink-0" />
              <span className="text-xs sm:text-sm uppercase tracking-widest text-gold-300 font-bold">
                {companyData.tagline}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Building Trust. <br />
              <span className="text-gold-gradient">Managing Excellence.</span> <br />
              Creating Value.
            </h1>

            {/* Subtitle - Increased size for readability */}
            <p className="text-slate-200 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Professional property management, tenant screening, leasing, estate surveying, valuation, and real estate advisory across <span className="text-amber-200 font-semibold">Lagos State, Ogun State,</span> and surrounding environs.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3.5 pt-2">
              <div className="flex items-center text-sm font-medium text-slate-200 bg-obsidian-800/90 px-4 py-2 rounded-xl border border-white/10 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-gold-500 mr-2 shrink-0" />
                <span>Professional Property Management</span>
              </div>
              <div className="flex items-center text-sm font-medium text-slate-200 bg-obsidian-800/90 px-4 py-2 rounded-xl border border-white/10 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-gold-500 mr-2 shrink-0" />
                <span>Thorough Tenant Screening</span>
              </div>
              <div className="flex items-center text-sm font-medium text-slate-200 bg-obsidian-800/90 px-4 py-2 rounded-xl border border-white/10 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-gold-500 mr-2 shrink-0" />
                <span>Transparent Reporting & Remittance</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onOpenContact}
                className="w-full sm:w-auto px-9 py-4 text-sm uppercase tracking-widest font-bold rounded-xl text-obsidian-900 bg-gold-gradient hover:brightness-110 shadow-gold-md hover:shadow-gold-lg transition-all duration-300 flex items-center justify-center space-x-2 group"
              >
                <span>Request Consultation</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#services"
                className="w-full sm:w-auto px-8 py-4 text-sm uppercase tracking-widest font-semibold rounded-xl text-slate-200 border border-gold-500/40 hover:bg-gold-500/10 transition-colors duration-300 flex items-center justify-center"
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
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-gold-500/40 via-amber-200/20 to-gold-700/40 blur-xl opacity-75 animate-pulse-slow"></div>

              {/* Main Visual Card */}
              <div className="relative glass-card p-6 overflow-hidden">
                <div className="relative h-72 sm:h-80 rounded-2xl overflow-hidden border border-gold-500/30">
                  <img 
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80" 
                    alt="Royal Haven Modern Property Management"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/30 to-transparent"></div>

                  {/* Floating Tag */}
                  <div className="absolute top-4 left-4 bg-obsidian-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-gold-500/40 text-xs font-bold uppercase tracking-wider text-amber-200">
                    Lagos & Ogun State
                  </div>
                  
                  <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                    <p className="text-xs text-gold-400 font-bold tracking-wider uppercase">Royal Haven Management Standard</p>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold">Excellence in Property. Royalty in Service.</h3>
                  </div>
                </div>

                {/* Core Pillars inside Card */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-5 border-t border-gold-500/20 text-center">
                  {companyData.pillars.map((pil, idx) => (
                    <div key={idx} className="bg-obsidian-900/80 p-3 rounded-xl border border-white/10">
                      <p className="font-serif text-sm font-bold text-gold-gradient">{pil.label}</p>
                      <p className="text-[11px] text-slate-300 font-medium mt-0.5">{pil.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Small Floating Trust Badge */}
              <div className="absolute -bottom-6 -left-6 bg-obsidian-900 border border-gold-500/40 p-4 rounded-2xl shadow-gold-md hidden sm:flex items-center space-x-3 backdrop-blur-md">
                <div className="p-3 bg-gold-500/10 rounded-xl border border-gold-500/30 text-gold-400">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white uppercase tracking-wider">Your Property. Our Priority.</p>
                  <p className="text-xs text-slate-400">Transparent & Reliable Care</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
