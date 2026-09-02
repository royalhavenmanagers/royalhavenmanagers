import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Compass, CheckCircle, Shield, Award, Building2, UserCheck, FileText } from 'lucide-react';
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
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs uppercase tracking-widest font-bold">
            <Award className="w-4 h-4 mr-1.5 shrink-0" />
            <span>WHO WE ARE</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            About <span className="text-gold-gradient">Royal Haven</span>
          </h2>
          <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
            {companyData.about.description}
          </p>
        </div>

        {/* Interactive Tabs: Overview, Vision & Mission, Core Values */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-2xl bg-obsidian-800 border border-gold-500/20 max-w-lg w-full justify-between">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-3 text-xs sm:text-sm uppercase tracking-wider font-bold rounded-xl transition-all duration-300 ${
                activeTab === 'overview'
                  ? 'bg-gold-gradient text-obsidian-900 shadow-gold-sm'
                  : 'text-slate-200 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('vision-mission')}
              className={`flex-1 py-3 text-xs sm:text-sm uppercase tracking-wider font-bold rounded-xl transition-all duration-300 ${
                activeTab === 'vision-mission'
                  ? 'bg-gold-gradient text-obsidian-900 shadow-gold-sm'
                  : 'text-slate-200 hover:text-white'
              }`}
            >
              Vision & Mission
            </button>
            <button
              onClick={() => setActiveTab('values')}
              className={`flex-1 py-3 text-xs sm:text-sm uppercase tracking-wider font-bold rounded-xl transition-all duration-300 ${
                activeTab === 'values'
                  ? 'bg-gold-gradient text-obsidian-900 shadow-gold-sm'
                  : 'text-slate-200 hover:text-white'
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
                <blockquote className="border-l-4 border-gold-500 pl-6 py-3 italic text-xl sm:text-2xl font-serif text-amber-200 bg-obsidian-900/60 rounded-r-2xl">
                  "{companyData.about.quote}"
                </blockquote>

                <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                  We specialize strictly in professional property management, thorough tenant screening, lettings and leasing oversight, facility maintenance, routine property inspections, and transparent rent remittance.
                </p>

                <p className="text-slate-300 text-base leading-relaxed">
                  Our mission is to protect landlord investments while providing exceptional service built on integrity, professionalism, and accountability. Every property under our care is managed with the same level of commitment as if it were our own.
                </p>
              </div>

              <div className="lg:col-span-6 grid sm:grid-cols-2 gap-5">
                <div className="glass-card p-6 space-y-2 border-gold-glow">
                  <Building2 className="w-8 h-8 text-gold-400 mb-2" />
                  <h4 className="font-serif text-lg font-bold text-white">Property Management</h4>
                  <p className="text-sm text-slate-300">Managing properties with transparency, efficiency, and maximum care.</p>
                </div>

                <div className="glass-card p-6 space-y-2 border-gold-glow">
                  <UserCheck className="w-8 h-8 text-gold-400 mb-2" />
                  <h4 className="font-serif text-lg font-bold text-white">Tenant Screening</h4>
                  <p className="text-sm text-slate-300">Thorough background checks to ensure reliable, verified tenants.</p>
                </div>

                <div className="glass-card p-6 space-y-2 border-gold-glow">
                  <FileText className="w-8 h-8 text-gold-400 mb-2" />
                  <h4 className="font-serif text-lg font-bold text-white">Legal Documentation</h4>
                  <p className="text-sm text-slate-300">Accurate documentation and verification to protect properties legally.</p>
                </div>

                <div className="glass-card p-6 space-y-2 border-gold-glow">
                  <Shield className="w-8 h-8 text-gold-400 mb-2" />
                  <h4 className="font-serif text-lg font-bold text-white">Accountability</h4>
                  <p className="text-sm text-slate-300">Prompt rent remittance and regular condition reporting for owners.</p>
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
              <div className="glass-card p-8 space-y-5 border-gold-glow relative overflow-hidden">
                <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                  <Target className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-white">Our Vision</h3>
                <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                  "{companyData.about.vision}"
                </p>
              </div>

              {/* Mission Card */}
              <div className="glass-card p-8 space-y-5 border-gold-glow relative overflow-hidden">
                <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                  <Compass className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-white">Our Mission</h3>
                <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
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
                <div key={idx} className="glass-card p-7 space-y-3 hover:-translate-y-1 transition-all duration-300 border-gold-glow">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 shrink-0">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif text-lg font-bold text-white">{val.title}</h4>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">{val.description}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>

      </div>
    </section>
  );
}
