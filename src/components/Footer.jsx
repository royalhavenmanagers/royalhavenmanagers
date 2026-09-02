import React from 'react';
import { Phone, Mail, MapPin, Globe, ShieldCheck, ArrowUp, Clock, ExternalLink } from 'lucide-react';
import { companyData } from '../data/companyData';

export default function Footer({ onOpenContact }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-obsidian-950 border-t border-gold-500/20 pt-20 pb-12 relative overflow-hidden text-slate-200 text-sm">
      {/* Background Decorative */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gold-glow pointer-events-none blur-3xl opacity-15"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* ========================================================= */}
        {/* OFFICE LOCATION & INTERACTIVE GOOGLE MAPS SECTION         */}
        {/* ========================================================= */}
        <div className="glass-card p-6 sm:p-10 border-gold-glow rounded-3xl overflow-hidden shadow-gold-md">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Location Details */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-amber-300 text-xs uppercase font-bold tracking-wider">
                <MapPin className="w-3.5 h-3.5 mr-1" />
                <span>OFFICE LOCATION & COVERAGE</span>
              </div>

              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Our Operational <span className="text-gold-gradient">Hub</span>
                </h3>
                <p className="text-slate-200 text-sm sm:text-base mt-2 leading-relaxed font-normal">
                  Providing professional property management, active facility oversight, and tenant vetting across premier districts in Lagos and Ogun State.
                </p>
              </div>

              {/* Office Details List */}
              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="flex items-start space-x-3 bg-obsidian-900/80 p-3.5 rounded-xl border border-white/10">
                  <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Primary Management Corridor:</strong>
                    <span className="text-slate-200">Lekki Peninsula, Victoria Island, Ikoyi & Ikeja GRA, Lagos State</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-obsidian-900/80 p-3.5 rounded-xl border border-white/10">
                  <ShieldCheck className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Ogun State Coverage:</strong>
                    <span className="text-slate-200">Abeokuta, Sagamu, Mowe & Surrounding Environs</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-obsidian-900/80 p-3.5 rounded-xl border border-white/10">
                  <Clock className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Consultation Hours:</strong>
                    <span className="text-slate-200">Monday – Saturday: 8:00 AM – 6:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Lekki+Phase+1+Lagos+Nigeria" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-gold-500/15 border border-gold-500/40 text-amber-200 text-xs uppercase tracking-wider font-bold hover:bg-gold-gradient hover:text-obsidian-900 transition-all flex items-center space-x-1.5"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button 
                  onClick={onOpenContact}
                  className="px-5 py-2.5 rounded-xl bg-gold-gradient text-obsidian-900 text-xs uppercase tracking-wider font-bold hover:brightness-110 transition-all shadow-gold-sm"
                >
                  Schedule Site Inspection
                </button>
              </div>
            </div>

            {/* Embedded Interactive Google Map */}
            <div className="lg:col-span-7 h-72 sm:h-96 w-full rounded-2xl overflow-hidden border-2 border-gold-500/30 shadow-gold-md relative">
              <iframe
                title="Royal Haven Management Coverage Map"
                src="https://maps.google.com/maps?q=Lekki+Phase+1,+Lagos,+Nigeria&t=&z=12&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'contrast(1.05) saturate(1.1)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* MAIN FOOTER GRID                                          */}
        {/* ========================================================= */}
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-white/10">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-5 space-y-5">
            <a href="#home" className="flex items-center space-x-3.5 group">
              <img 
                src="/images/logo-emblem.jpg" 
                alt="Royal Haven Logo" 
                className="h-12 w-auto object-contain rounded-xl"
              />
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold text-gold-gradient">ROYAL HAVEN</span>
                <span className="text-[10px] uppercase tracking-widest text-amber-200 font-semibold">Realty & Property Managers Ltd.</span>
              </div>
            </a>

            <p className="text-slate-200 leading-relaxed max-w-md text-sm sm:text-base font-normal">
              A premier property management and asset protection company committed to delivering reliable, transparent, and value-driven solutions for property owners across Nigeria.
            </p>

            <div className="flex items-center space-x-3 text-amber-300 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-gold-400 shrink-0" />
              <span>Building Trust. Managing Excellence. Creating Value.</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3 font-medium">
              <li><a href="#home" className="text-slate-200 hover:text-gold-400 transition-colors">Home</a></li>
              <li><a href="#about" className="text-slate-200 hover:text-gold-400 transition-colors">About Royal Haven</a></li>
              <li><a href="#services" className="text-slate-200 hover:text-gold-400 transition-colors">Our Services</a></li>
              {companyData.showPortfolio && (
                <li><a href="#portfolio" className="text-slate-200 hover:text-gold-400 transition-colors">Property Portfolio</a></li>
              )}
              <li><a href="#process" className="text-slate-200 hover:text-gold-400 transition-colors">Management Process</a></li>
              <li><a href="#leadership" className="text-slate-200 hover:text-gold-400 transition-colors">Executive Leadership</a></li>
              <li><a href="#blog" className="text-slate-200 hover:text-gold-400 transition-colors">Insights & Articles</a></li>
            </ul>
          </div>

          {/* Column 3: Official Contact */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider">Contact Information</h4>
            
            <ul className="space-y-3.5 font-medium">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <span className="text-white font-medium">Lagos State & Ogun State Environs, Nigeria</span>
              </li>

              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gold-400 shrink-0" />
                <div className="flex flex-col">
                  <a href={`tel:${companyData.phones[0]}`} className="text-slate-100 hover:text-gold-400 transition-colors font-semibold">{companyData.formattedPhones[0]}</a>
                  <a href={`tel:${companyData.phones[1]}`} className="text-slate-100 hover:text-gold-400 transition-colors font-semibold">{companyData.formattedPhones[1]}</a>
                </div>
              </li>

              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gold-400 shrink-0" />
                <a href={`mailto:${companyData.email}`} className="text-amber-200 hover:text-gold-400 transition-colors font-semibold">{companyData.email}</a>
              </li>

              <li className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-gold-400 shrink-0" />
                <span className="text-white font-medium">www.{companyData.domain}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-300 text-xs sm:text-sm">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Royal Haven Realty & Property Managers Ltd. All rights reserved.
          </p>

          <div className="flex items-center space-x-6">
            <span className="text-amber-200/90 font-mono font-bold">Domain: {companyData.domain}</span>
            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="p-3 rounded-xl bg-obsidian-900 border border-gold-500/40 text-gold-400 hover:bg-gold-gradient hover:text-obsidian-900 transition-all shadow-gold-sm cursor-pointer"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
