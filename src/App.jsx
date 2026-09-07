import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import PropertySlider from './components/PropertySlider';
import Leadership from './components/Leadership';
import WhyChooseUs from './components/WhyChooseUs';
import PartnersSection from './components/PartnersSection';
import Testimonials from './components/Testimonials';
import BlogSection from './components/BlogSection';
import AdminPortal from './components/AdminPortal';
import ContactModal from './components/ContactModal';
import WhatsAppWidget from './components/WhatsAppWidget';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';
import OwnerPortal from './components/portal/OwnerPortal';
import OwnerLogin from './components/portal/OwnerLogin';
import { companyData } from './data/companyData';

function OwnerPortalShell({ onReturnHome }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060608] flex flex-col items-center justify-center text-amber-300 font-serif space-y-3">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs uppercase tracking-widest font-sans font-bold text-slate-300">
          Accessing Royal Haven Secure Vault...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <OwnerLogin onReturnHome={onReturnHome} />;
  }

  return <OwnerPortal onReturnHome={onReturnHome} />;
}

function MainApp() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState('home');

  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const searchParams = new URLSearchParams(window.location.search);
      
      if (path === '/admin' || hash === 'admin' || searchParams.get('route') === 'admin') {
        setCurrentRoute('admin');
      } else if (
        path === '/portal' || 
        path.startsWith('/portal') || 
        hash === 'portal' || 
        hash.startsWith('portal') || 
        searchParams.get('route') === 'portal'
      ) {
        setCurrentRoute('portal');
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
    if (window.location.pathname === '/admin' || window.location.pathname.startsWith('/portal')) {
      window.history.pushState(null, '', '/');
    }
    window.location.hash = '';
    setCurrentRoute('home');
  };

  // If viewing admin route, render AdminPortal
  if (currentRoute === 'admin') {
    return <AdminPortal onReturnHome={handleReturnHome} />;
  }

  // If viewing owner portal route, render OwnerPortalShell
  if (currentRoute === 'portal') {
    return <OwnerPortalShell onReturnHome={handleReturnHome} />;
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
        
        {/* Dynamic Managed Properties Slider */}
        <PropertySlider onOpenContact={handleOpenContact} />
        
        <Leadership onOpenContact={handleOpenContact} />
        <WhyChooseUs onOpenContact={handleOpenContact} />
        
        {/* Client Reviews / Social Proof */}
        <Testimonials />
        
        {/* Partners & Corporate Clients Section */}
        <PartnersSection />

        {/* Public Blog & Insights Section */}
        <BlogSection onOpenContact={handleOpenContact} />
      </main>

      {/* Footer */}
      <Footer onOpenContact={handleOpenContact} />

      {/* Floating Interactive Elements */}
      <WhatsAppWidget />
      <ContactModal isOpen={isContactOpen} onClose={handleCloseContact} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
