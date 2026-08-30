import React from 'react';
import { Phone, Mail, MapPin, Globe, ShieldCheck, ArrowUp } from 'lucide-react';
import { companyData } from '../data/companyData';

export default function Footer({ onOpenContact }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-obsidian-950 border-t border-gold-500/20 pt-20 pb-12 relative overflow-hidden text-slate-300 text-sm">
      {/* Background Decorative */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gold-glow pointer-events-none blur-3xl opacity-15"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-white/10">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-5 space-y-5">
            <a href="#home" className="flex items-center space-x-3.5 group">
              <img 
                src="/images/logo-gold.jpg" 
                alt="Royal Haven Logo" 
                className="h-12 w-auto object-contain rounded-xl border border-gold-500/30"
              />
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold text-gold-gradient">ROYAL HAVEN</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400">Realty & Property Managers Ltd.</span>
              </div>
            </a>

            <p className="text-slate-300 leading-relaxed max-w-md text-base">
              A professional real estate and property management company committed to delivering reliable, transparent, and value-driven property solutions across Nigeria.
            </p>

            <div className="flex items-center space-x-3 text-gold-400 font-semibold text-sm">
              <ShieldCheck className="w-5 h-5 text-gold-500 shrink-0" />
              <span>Building Trust. Managing Excellence. Creating Value.</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3 font-medium">
              <li><a href="#home" className="hover:text-gold-400 transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-gold-400 transition-colors">About Royal Haven</a></li>
              <li><a href="#services" className="hover:text-gold-400 transition-colors">Our Services</a></li>
              {companyData.showPortfolio && (
                <li><a href="#portfolio" className="hover:text-gold-400 transition-colors">Property Portfolio</a></li>
              )}
              <li><a href="#process" className="hover:text-gold-400 transition-colors">Management Process</a></li>
              <li><a href="#leadership" className="hover:text-gold-400 transition-colors">Leadership Team</a></li>
            </ul>
          </div>

          {/* Column 3: Official Contact */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider">Contact Information</h4>
            
            <ul className="space-y-3.5 font-medium">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <span className="text-slate-200">Lagos State & Ogun State Environs, Nigeria</span>
              </li>

              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gold-500 shrink-0" />
                <div className="flex flex-col">
                  <a href={`tel:${companyData.phones[0]}`} className="hover:text-gold-400 transition-colors">{companyData.formattedPhones[0]}</a>
                  <a href={`tel:${companyData.phones[1]}`} className="hover:text-gold-400 transition-colors">{companyData.formattedPhones[1]}</a>
                </div>
              </li>

              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gold-500 shrink-0" />
                <a href={`mailto:${companyData.email}`} className="hover:text-gold-400 transition-colors text-amber-200">{companyData.email}</a>
              </li>

              <li className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-gold-500 shrink-0" />
                <span className="text-slate-200">www.{companyData.domain}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-xs sm:text-sm">
          <p>© {new Date().getFullYear()} Royal Haven Realty & Property Managers Ltd. All rights reserved.</p>

          <div className="flex items-center space-x-6">
            <span className="text-slate-400 font-mono">Domain: {companyData.domain}</span>
            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="p-3 rounded-xl bg-obsidian-900 border border-gold-500/30 text-gold-400 hover:bg-gold-gradient hover:text-obsidian-900 transition-all shadow-gold-sm"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
