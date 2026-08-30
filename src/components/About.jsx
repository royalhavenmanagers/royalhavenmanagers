import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Compass, Gem, CheckCircle, Shield, Award } from 'lucide-react';
import { companyData } from '../data/companyData';

export default function About() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <section id="about" className="py-24 bg-obsidian-950 relative overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-glow pointer-events-none blur-3xl opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs uppercase tracking-widest font-semibold">
            <Award className="w-3.5 h-3.5 mr-1" />
            <span>WHO WE ARE</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            About <span className="text-gold-gradient">Royal Haven</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {companyData.about.description}
          </p>
        </div>

        {/* Interactive Tabs: Overview, Vision & Mission, Core Values */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-2xl bg-obsidian-800 border border-gold-500/20 max-w-md w-full justify-between">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-3 text-xs uppercase tracking-wider font-bold rounded-xl transition-all duration-300 ${
                activeTab === 'overview'
                  ? 'bg-gold-gradient text-obsidian-900 shadow-gold-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('vision-mission')}
              className={`flex-1 py-3 text-xs uppercase tracking-wider font-bold rounded-xl transition-all duration-300 ${
                activeTab === 'vision-mission'
                  ? 'bg-gold-gradient text-obsidian-900 shadow-gold-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Vision & Mission
            </button>
            <button
              onClick={() => setActiveTab('values')}
              className={`flex-1 py-3 text-xs uppercase tracking-wider font-bold rounded-xl transition-all duration-300 ${
                activeTab === 'values'
                  ? 'bg-gold-gradient text-obsidian-900 shadow-gold-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Core Values
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="min-h-[380px]">
          {activeTab === 'overview' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-6 space-y-6">
                <blockquote className="border-l-4 border-gold-500 pl-6 py-2 italic text-lg sm:text-xl font-serif text-amber-200 bg-obsidian-900/60 rounded-r-2xl">
                  "{companyData.about.quote}"
                </blockquote>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Every property under our care is managed with the exact level of commitment as if it were our own. We combine extensive local market knowledge in Lagos, Ikeja, Lekki, Victoria Island, Ajah, and Ogun State with high operational standards to maximize rental yields and minimize vacancies.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-obsidian-800/80 border border-gold-500/20 flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Investment Protection</h4>
                      <p className="text-xs text-slate-400 mt-1">Rigorous audits, lease governance, and prompt upkeep.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-obsidian-800/80 border border-gold-500/20 flex items-start space-x-3">
                    <Gem className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Royalty in Service</h4>
                      <p className="text-xs text-slate-400 mt-1">First-class landlord & tenant relationship management.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                <div className="glass-card p-6 text-center space-y-2 border-gold-glow">
                  <span className="font-serif text-3xl sm:text-4xl font-extrabold text-gold-gradient">50+</span>
                  <p className="text-xs uppercase tracking-wider text-slate-300 font-bold">Managed Properties</p>
                  <p className="text-[11px] text-slate-400">Residential, Commercial & Serviced Units</p>
                </div>

                <div className="glass-card p-6 text-center space-y-2 border-gold-glow">
                  <span className="font-serif text-3xl sm:text-4xl font-extrabold text-gold-gradient">98%</span>
                  <p className="text-xs uppercase tracking-wider text-slate-300 font-bold">Client Retention</p>
                  <p className="text-[11px] text-slate-400">Long-term Landlord Partnerships</p>
                </div>

                <div className="glass-card p-6 text-center space-y-2 border-gold-glow">
                  <span className="font-serif text-3xl sm:text-4xl font-extrabold text-gold-gradient">95%</span>
                  <p className="text-xs uppercase tracking-wider text-slate-300 font-bold">Average Occupancy</p>
                  <p className="text-[11px] text-slate-400">Low Vacancy & Fast Lettings</p>
                </div>

                <div className="glass-card p-6 text-center space-y-2 border-gold-glow">
                  <span className="font-serif text-3xl sm:text-4xl font-extrabold text-gold-gradient">100%</span>
                  <p className="text-xs uppercase tracking-wider text-slate-300 font-bold">Financial Transparency</p>
                  <p className="text-[11px] text-slate-400">Direct Statements & Remittance</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'vision-mission' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid md:grid-cols-2 gap-8"
            >
              {/* Vision Card */}
              <div className="glass-card p-8 space-y-4 border-gold-glow relative overflow-hidden">
                <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-white">Our Vision</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  "{companyData.about.vision}"
                </p>
              </div>

              {/* Mission Card */}
              <div className="glass-card p-8 space-y-4 border-gold-glow relative overflow-hidden">
                <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-white">Our Mission</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  "{companyData.about.mission}"
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'values' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {companyData.values.map((val, idx) => (
                <div key={idx} className="glass-card p-6 space-y-3 hover:-translate-y-1 transition-all duration-300 border-gold-glow">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif text-lg font-bold text-white">{val.title}</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{val.description}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>

      </div>
    </section>
  );
}
