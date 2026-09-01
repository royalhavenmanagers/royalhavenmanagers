import React, { useState, useEffect } from 'react';
import { Phone, Mail, Menu, X, ChevronRight, ShieldCheck, Lock } from 'lucide-react';
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
    { name: 'Blog', href: '#blog' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Top Announcement & Direct Contact Bar */}
      <div className="bg-slate-950 border-b border-amber-500/20 text-sm py-2.5 text-slate-300 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center text-amber-200 font-semibold">
              <ShieldCheck className="w-4 h-4 text-gold-400 mr-2 shrink-0" />
              Royal Haven Realty & Property Managers Ltd.
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-300">Lagos State & Ogun State Environs</span>
          </div>

          <div className="flex items-center space-x-6">
            <a href={`tel:${companyData.phones[0]}`} className="flex items-center hover:text-gold-400 transition-colors font-medium">
              <Phone className="w-4 h-4 text-gold-400 mr-1.5" />
              <span>{companyData.formattedPhones[0]}</span>
            </a>
            <a href={`mailto:${companyData.email}`} className="flex items-center hover:text-gold-400 transition-colors font-medium">
              <Mail className="w-4 h-4 text-gold-400 mr-1.5" />
              <span>{companyData.email}</span>
            </a>
            <a href="#admin" className="flex items-center text-amber-300 hover:text-white transition-colors font-medium border-l border-slate-800 pl-4">
              <Lock className="w-3.5 h-3.5 mr-1 text-gold-400" />
              <span>Admin Portal</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Light Glass Navbar */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-amber-200/60 py-3.5 shadow-sm' 
          : 'bg-white/80 backdrop-blur-sm border-b border-slate-100 py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <a href="#home" className="flex items-center space-x-3.5 group">
            <img 
              src="/images/logo-gold.jpg" 
              alt="Royal Haven Logo" 
              className="h-12 sm:h-14 w-auto object-contain rounded-xl border border-amber-300/60 group-hover:scale-105 transition-transform duration-300 shadow-sm"
            />
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-gold-gradient leading-tight">
                ROYAL HAVEN
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-600 font-sans font-semibold">
                Realty & Property Managers Ltd.
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-base text-slate-800 hover:text-gold-600 font-semibold tracking-wide transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gold-500 hover:after:w-full after:transition-all after:duration-300"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Call To Action Button */}
          <div className="hidden sm:flex items-center space-x-4">
            <button
              onClick={onOpenContact}
              className="relative inline-flex items-center justify-center px-6 py-3 text-xs uppercase tracking-wider font-bold rounded-xl text-slate-950 bg-gold-gradient hover:brightness-110 transition-all duration-300 shadow-sm hover:shadow-md group"
            >
              <span>Contact Us</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="lg:hidden p-2.5 rounded-xl border border-amber-300/70 text-slate-900 bg-amber-50/50 hover:bg-amber-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-white/98 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-8 animate-fadeIn">
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <img src="/images/logo-gold.jpg" alt="Logo" className="h-12 w-auto object-contain rounded-lg" />
                <span className="font-serif text-xl font-bold text-gold-gradient">ROYAL HAVEN</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 text-slate-700 hover:text-slate-950 rounded-lg border border-slate-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col space-y-5 mt-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl font-semibold text-slate-900 hover:text-gold-600 transition-colors flex items-center justify-between border-b border-slate-100 pb-3"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-5 h-5 text-gold-500" />
                </a>
              ))}
              
              <a
                href="#admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-bold text-amber-800 hover:text-amber-900 flex items-center space-x-2 pt-2"
              >
                <Lock className="w-4 h-4 text-gold-600" />
                <span>Admin Portal Login</span>
              </a>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-200">
            <a 
              href={`tel:${companyData.phones[0]}`}
              className="flex items-center justify-center space-x-2 py-4 rounded-xl border border-amber-300 text-slate-900 text-base font-semibold bg-amber-50/50"
            >
              <Phone className="w-5 h-5 text-gold-600" />
              <span>Call Us: {companyData.phones[0]}</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full py-4 text-center text-sm uppercase tracking-widest font-bold rounded-xl text-slate-950 bg-gold-gradient shadow-sm"
            >
              Request Consultation
            </button>
          </div>
        </div>
      )}
    </>
  );
}
