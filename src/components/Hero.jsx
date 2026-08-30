import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Award, Building, CheckCircle2 } from 'lucide-react';
import { companyData } from '../data/companyData';

export default function Hero({ onOpenContact }) {
  return (
    <section id="home" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-obsidian-900 pt-12 pb-20">
      {/* Background Decorative Gold Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-glow pointer-events-none blur-3xl opacity-40"></div>
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
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Top Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gold-500/30 bg-obsidian-800/80 backdrop-blur-md shadow-gold-sm">
              <Award className="w-4 h-4 text-gold-500" />
              <span className="text-xs uppercase tracking-widest text-gold-300 font-semibold">
                {companyData.tagline}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Building Trust. <br />
              <span className="text-gold-gradient">Managing Excellence.</span> <br />
              Creating Value.
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Professional property management, tenant screening, property sales, lettings, and real estate advisory across <span className="text-amber-200 font-medium">Lagos State, Ogun State,</span> and premier Nigerian urban centers.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
              <div className="flex items-center text-xs text-slate-300 bg-obsidian-800/60 px-3.5 py-1.5 rounded-lg border border-white/5">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 mr-2" />
                <span>100% Transparent Financial Remittance</span>
              </div>
              <div className="flex items-center text-xs text-slate-300 bg-obsidian-800/60 px-3.5 py-1.5 rounded-lg border border-white/5">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 mr-2" />
                <span>Rigorous Multi-Stage Tenant Vetting</span>
              </div>
              <div className="flex items-center text-xs text-slate-300 bg-obsidian-800/60 px-3.5 py-1.5 rounded-lg border border-white/5">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 mr-2" />
                <span>24/7 Asset & Maintenance Supervision</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onOpenContact}
                className="w-full sm:w-auto px-8 py-4 text-xs uppercase tracking-widest font-bold rounded-xl text-obsidian-900 bg-gold-gradient hover:brightness-110 shadow-gold-md hover:shadow-gold-lg transition-all duration-300 flex items-center justify-center space-x-2 group"
              >
                <span>Request Free Consultation</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#portfolio"
                className="w-full sm:w-auto px-7 py-4 text-xs uppercase tracking-widest font-semibold rounded-xl text-slate-200 border border-gold-500/40 hover:bg-gold-500/10 transition-colors duration-300 flex items-center justify-center"
              >
                <span>Explore Managed Portfolio</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Hero Visual Card Showcase */}
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
              <div className="relative glass-card p-4 sm:p-6 overflow-hidden">
                <div className="relative h-72 sm:h-80 rounded-xl overflow-hidden border border-gold-500/20">
                  <img 
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80" 
                    alt="Royal Haven Luxury Property"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/20 to-transparent"></div>

                  {/* Floating Tag */}
                  <div className="absolute top-4 left-4 bg-obsidian-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-gold-500/30 text-[10px] font-bold uppercase tracking-wider text-amber-200">
                    Lekki • Lagos State
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs text-gold-400 font-semibold tracking-wider uppercase">Featured Managed Estate</p>
                    <h3 className="font-serif text-lg font-bold">4-Bedroom Luxury Detached Duplex</h3>
                  </div>
                </div>

                {/* Stat Counters inside Card */}
                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gold-500/20 text-center">
                  {companyData.stats.slice(0, 3).map((stat, idx) => (
                    <div key={idx} className="bg-obsidian-900/60 p-2.5 rounded-xl border border-white/5">
                      <p className="font-serif text-lg sm:text-xl font-bold text-gold-gradient">{stat.value}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{stat.label}</p>
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
                  <p className="text-xs font-bold text-white uppercase tracking-wider">Your Property. Our Priority.</p>
                  <p className="text-[10px] text-slate-400">Complete asset protection & yield</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
