import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import PropertySlider from './components/PropertySlider';
import ProcessTimeline from './components/ProcessTimeline';
import Leadership from './components/Leadership';
import WhyChooseUs from './components/WhyChooseUs';
import Testimonials from './components/Testimonials';
import ContactModal from './components/ContactModal';
import WhatsAppWidget from './components/WhatsAppWidget';
import Footer from './components/Footer';

export default function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleOpenContact = () => setIsContactOpen(true);
  const handleCloseContact = () => setIsContactOpen(false);

  return (
    <div className="min-h-screen bg-obsidian-900 text-slate-100 font-sans selection:bg-gold-500 selection:text-obsidian-900">
      {/* Sticky Header */}
      <Navbar onOpenContact={handleOpenContact} />

      {/* Main Page Sections */}
      <main>
        <Hero onOpenContact={handleOpenContact} />
        <About />
        <Services onOpenContact={handleOpenContact} />
        <PropertySlider onOpenContact={handleOpenContact} />
        <ProcessTimeline onOpenContact={handleOpenContact} />
        <Leadership onOpenContact={handleOpenContact} />
        <WhyChooseUs onOpenContact={handleOpenContact} />
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
