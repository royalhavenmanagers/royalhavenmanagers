import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import PropertySlider from './components/PropertySlider';
import ProcessTimeline from './components/ProcessTimeline';
import Leadership from './components/Leadership';
import WhyChooseUs from './components/WhyChooseUs';
import PartnersSection from './components/PartnersSection';
import Testimonials from './components/Testimonials';
import BlogSection from './components/BlogSection';
import AdminPortal from './components/AdminPortal';
import ContactModal from './components/ContactModal';
import WhatsAppWidget from './components/WhatsAppWidget';
import Footer from './components/Footer';
import { companyData } from './data/companyData';

export default function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState('home');

  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const searchParams = new URLSearchParams(window.location.search);
      
      if (path === '/admin' || hash === 'admin' || searchParams.get('route') === 'admin') {
        setCurrentRoute('admin');
      } else {
        setCurrentRoute('home');
      }
    };

    handleRouteChange();
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const handleOpenContact = () => setIsContactOpen(true);
  const handleCloseContact = () => setIsContactOpen(false);

  const handleReturnHome = () => {
    if (window.location.pathname === '/admin') {
      window.history.pushState(null, '', '/');
    }
    window.location.hash = '';
    setCurrentRoute('home');
  };

  // If viewing admin route, render AdminPortal
  if (currentRoute === 'admin') {
    return <AdminPortal onReturnHome={handleReturnHome} />;
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-gold-500 selection:text-slate-950">
      {/* Sticky Header */}
      <Navbar onOpenContact={handleOpenContact} />

      {/* Main Page Sections */}
      <main>
        <Hero onOpenContact={handleOpenContact} />
        <About />
        <Services onOpenContact={handleOpenContact} />
        
        {/* Render Property Slider only if showPortfolio is explicitly enabled */}
        {companyData.showPortfolio && <PropertySlider onOpenContact={handleOpenContact} />}
        
        <ProcessTimeline onOpenContact={handleOpenContact} />
        <Leadership onOpenContact={handleOpenContact} />
        <WhyChooseUs onOpenContact={handleOpenContact} />
        
        {/* Partners & Corporate Clients Section */}
        <PartnersSection />

        {/* Public Blog & Insights Section */}
        <BlogSection onOpenContact={handleOpenContact} />
        
        <Testimonials />
      </main>

      {/* Footer */}
      <Footer onOpenContact={handleOpenContact} />

      {/* Floating Interactive Elements */}
      <WhatsAppWidget />
      <ContactModal isOpen={isContactOpen} onClose={handleCloseContact} />
    </div>
  );
}
