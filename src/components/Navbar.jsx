import React, { useState, useEffect } from 'react';
import { Phone, Mail, Menu, X, ChevronRight, ShieldCheck } from 'lucide-react';
import { companyData } from '../data/companyData';

export default function Navbar({ onOpenContact }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'Services', href: '#services' },
    ...(companyData.showPortfolio ? [{ name: 'Portfolio', href: '#portfolio' }] : []),
    { name: 'Process', href: '#process' },
    { name: 'Leadership', href: '#leadership' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Top Announcement & Direct Contact Bar */}
      <div className="bg-obsidian-950 border-b border-gold-500/10 text-sm py-2.5 text-slate-300 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center text-amber-200/90 font-semibold">
              <ShieldCheck className="w-4 h-4 text-gold-500 mr-2 shrink-0" />
              Royal Haven Realty & Property Managers Ltd.
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">Lagos State & Ogun State Environs</span>
          </div>

          <div className="flex items-center space-x-6">
            <a href={`tel:${companyData.phones[0]}`} className="flex items-center hover:text-gold-400 transition-colors font-medium">
              <Phone className="w-4 h-4 text-gold-500 mr-1.5" />
              <span>{companyData.formattedPhones[0]}</span>
            </a>
            <a href={`mailto:${companyData.email}`} className="flex items-center hover:text-gold-400 transition-colors font-medium">
              <Mail className="w-4 h-4 text-gold-500 mr-1.5" />
              <span>{companyData.email}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-obsidian-900/95 backdrop-blur-md border-b border-gold-500/20 py-4 shadow-gold-sm' 
          : 'bg-obsidian-900/70 backdrop-blur-sm border-b border-white/5 py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <a href="#home" className="flex items-center space-x-3.5 group">
            <img 
              src="/images/logo-gold.jpg" 
              alt="Royal Haven Logo" 
              className="h-12 sm:h-14 w-auto object-contain rounded-xl border border-gold-500/30 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-gold-gradient leading-tight">
                ROYAL HAVEN
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-300 font-sans">
                Realty & Property Managers Ltd.
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-base text-slate-200 hover:text-gold-400 font-semibold tracking-wide transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gold-500 hover:after:w-full after:transition-all after:duration-300"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Call To Action Button */}
          <div className="hidden sm:flex items-center space-x-4">
            <button
              onClick={onOpenContact}
              className="relative inline-flex items-center justify-center px-6 py-3 text-xs uppercase tracking-wider font-bold rounded-xl text-obsidian-900 bg-gold-gradient hover:brightness-110 transition-all duration-300 shadow-gold-sm hover:shadow-gold-md group"
            >
              <span>Contact Us</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="lg:hidden p-2.5 rounded-xl border border-gold-500/40 text-gold-400 hover:bg-gold-500/10 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-obsidian-950/98 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-8 animate-fadeIn">
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-gold-500/20">
              <div className="flex items-center space-x-3">
                <img src="/images/logo-gold.jpg" alt="Logo" className="h-12 w-auto object-contain rounded-lg" />
                <span className="font-serif text-xl font-bold text-gold-gradient">ROYAL HAVEN</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 text-gold-400 hover:text-white rounded-lg border border-gold-500/30"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col space-y-6 mt-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl font-semibold text-slate-100 hover:text-gold-400 transition-colors flex items-center justify-between border-b border-slate-800/80 pb-4"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-5 h-5 text-gold-500" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-gold-500/20">
            <a 
              href={`tel:${companyData.phones[0]}`}
              className="flex items-center justify-center space-x-2 py-4 rounded-xl border border-gold-500/40 text-gold-300 text-base font-semibold bg-obsidian-900"
            >
              <Phone className="w-5 h-5 text-gold-500" />
              <span>Call Us: {companyData.phones[0]}</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full py-4 text-center text-sm uppercase tracking-widest font-bold rounded-xl text-obsidian-900 bg-gold-gradient shadow-gold-sm"
            >
              Request Consultation
            </button>
          </div>
        </div>
      )}
    </>
  );
}
