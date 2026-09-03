import React from 'react';
import { Phone, Mail, MapPin, Globe, ShieldCheck, ArrowUp, Clock, ExternalLink } from 'lucide-react';
import { companyData } from '../data/companyData';

export default function Footer({ onOpenContact }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-obsidian-950 bg-[#060608] border-t border-gold-500/20 pt-20 pb-12 relative overflow-hidden text-slate-200 text-sm">
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

            {/* Official Social Media Channels */}
            <div className="pt-2 space-y-2">
              <span className="text-xs uppercase tracking-wider text-amber-200/80 font-bold block">Connect With Us</span>
              <div className="flex items-center space-x-3">
                <a
                  href={companyData.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Royal Haven on Instagram"
                  className="w-10 h-10 rounded-xl bg-obsidian-900 border border-gold-500/30 flex items-center justify-center text-gold-400 hover:bg-gold-gradient hover:text-obsidian-950 transition-all duration-300 shadow-gold-sm hover:scale-105"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                <a
                  href={companyData.socials.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Royal Haven on TikTok"
                  className="w-10 h-10 rounded-xl bg-obsidian-900 border border-gold-500/30 flex items-center justify-center text-gold-400 hover:bg-gold-gradient hover:text-obsidian-950 transition-all duration-300 shadow-gold-sm hover:scale-105"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43V13a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-2.91-1.07 4.79 4.79 0 0 1-1.13-1.36h5V6.69z"/>
                  </svg>
                </a>

                <a
                  href={companyData.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Royal Haven on X"
                  className="w-10 h-10 rounded-xl bg-obsidian-900 border border-gold-500/30 flex items-center justify-center text-gold-400 hover:bg-gold-gradient hover:text-obsidian-950 transition-all duration-300 shadow-gold-sm hover:scale-105"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                {companyData.socials.linkedin && (
                  <a
                    href={companyData.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Royal Haven on LinkedIn"
                    className="w-10 h-10 rounded-xl bg-obsidian-900 border border-gold-500/30 flex items-center justify-center text-gold-400 hover:bg-gold-gradient hover:text-obsidian-950 transition-all duration-300 shadow-gold-sm hover:scale-105"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                )}
              </div>
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
