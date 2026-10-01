import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Compass, CheckCircle, Shield, Building2, UserCheck, FileText } from 'lucide-react';
import { companyData } from '../data/companyData';

export default function About() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <section id="about" className="py-24 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/30 text-slate-900 relative overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/20 pointer-events-none blur-3xl opacity-60"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            About <span className="text-gold-gradient-light">Royal Haven</span>
          </h2>
          <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
            {companyData.about.description}
          </p>
        </div>

        {/* Interactive Tabs: Overview, Vision & Mission, Core Values */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 max-w-lg w-full justify-between shadow-sm">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-3 text-xs sm:text-sm uppercase tracking-wider font-bold rounded-xl transition-all duration-300 ${
                activeTab === 'overview'
                  ? 'bg-gold-gradient text-slate-950 shadow-sm'
                  : 'text-slate-700 hover:text-slate-950 font-semibold'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('vision-mission')}
              className={`flex-1 py-3 text-xs sm:text-sm uppercase tracking-wider font-bold rounded-xl transition-all duration-300 ${
                activeTab === 'vision-mission'
                  ? 'bg-gold-gradient text-slate-950 shadow-sm'
                  : 'text-slate-700 hover:text-slate-950 font-semibold'
              }`}
            >
              Vision & Mission
            </button>
            <button
              onClick={() => setActiveTab('values')}
              className={`flex-1 py-3 text-xs sm:text-sm uppercase tracking-wider font-bold rounded-xl transition-all duration-300 ${
                activeTab === 'values'
                  ? 'bg-gold-gradient text-slate-950 shadow-sm'
                  : 'text-slate-700 hover:text-slate-950 font-semibold'
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
                <blockquote className="border-l-4 border-gold-500 pl-6 py-3 italic text-xl sm:text-2xl font-serif text-amber-950 bg-amber-50/70 border-y border-r border-amber-200/60 rounded-r-2xl shadow-sm">
                  "{companyData.about.quote}"
                </blockquote>

                <p className="text-slate-800 text-base sm:text-lg leading-relaxed font-medium">
                  We specialize strictly in professional property management, thorough tenant screening, lettings and leasing oversight, facility maintenance, routine property inspections, and transparent rent remittance.
                </p>

                <p className="text-slate-700 text-base leading-relaxed">
                  Our mission is to protect landlord investments while providing exceptional service built on integrity, professionalism, and accountability. Every property under our care is managed with the same level of commitment as if it were our own.
                </p>
              </div>

              <div className="lg:col-span-6 grid sm:grid-cols-2 gap-5">
                <div className="bg-white p-6 space-y-2 border border-amber-200/80 rounded-2xl shadow-sm hover:shadow-md hover:border-gold-500/60 transition-all duration-300">
                  <Building2 className="w-8 h-8 text-gold-600 mb-2" />
                  <h4 className="font-serif text-lg font-bold text-slate-900">Property Management</h4>
                  <p className="text-sm text-slate-600">Managing properties with transparency, efficiency, and maximum care.</p>
                </div>

                <div className="bg-white p-6 space-y-2 border border-amber-200/80 rounded-2xl shadow-sm hover:shadow-md hover:border-gold-500/60 transition-all duration-300">
                  <UserCheck className="w-8 h-8 text-gold-600 mb-2" />
                  <h4 className="font-serif text-lg font-bold text-slate-900">Tenant Screening</h4>
                  <p className="text-sm text-slate-600">Thorough background checks to ensure reliable, verified tenants.</p>
                </div>

                <div className="bg-white p-6 space-y-2 border border-amber-200/80 rounded-2xl shadow-sm hover:shadow-md hover:border-gold-500/60 transition-all duration-300">
                  <FileText className="w-8 h-8 text-gold-600 mb-2" />
                  <h4 className="font-serif text-lg font-bold text-slate-900">Legal Documentation</h4>
                  <p className="text-sm text-slate-600">Accurate documentation and verification to protect properties legally.</p>
                </div>

                <div className="bg-white p-6 space-y-2 border border-amber-200/80 rounded-2xl shadow-sm hover:shadow-md hover:border-gold-500/60 transition-all duration-300">
                  <Shield className="w-8 h-8 text-gold-600 mb-2" />
                  <h4 className="font-serif text-lg font-bold text-slate-900">Accountability</h4>
                  <p className="text-sm text-slate-600">Prompt rent remittance and regular condition reporting for owners.</p>
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
              <div className="bg-white p-8 space-y-5 border border-amber-200/80 rounded-2xl shadow-sm hover:shadow-md relative overflow-hidden">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-gold-600">
                  <Target className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-900">Our Vision</h3>
                <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
                  "{companyData.about.vision}"
                </p>
              </div>

              {/* Mission Card */}
              <div className="bg-white p-8 space-y-5 border border-amber-200/80 rounded-2xl shadow-sm hover:shadow-md relative overflow-hidden">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-gold-600">
                  <Compass className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-900">Our Mission</h3>
                <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
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
                <div key={idx} className="bg-white p-7 space-y-3 hover:-translate-y-1 transition-all duration-300 border border-amber-200/80 rounded-2xl shadow-sm hover:shadow-md hover:border-gold-500/60">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-gold-600 shrink-0">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif text-lg font-bold text-slate-900">{val.title}</h4>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{val.description}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>

      </div>
    </section>
  );
}
