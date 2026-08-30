import React from 'react';
import { MessageSquare } from 'lucide-react';
import { companyData } from '../data/companyData';

export default function WhatsAppWidget() {
  const whatsappUrl = `https://wa.me/${companyData.whatsapp}?text=Hello%20Royal%20Haven%20Realty,%20I%20would%20like%20to%20inquire%20about%20your%20property%20management%20services.`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Royal Haven on WhatsApp"
      className="fixed bottom-6 right-6 z-40 group flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-lg shadow-emerald-900/40 hover:scale-105 transition-all duration-300 border border-emerald-400/40"
    >
      <div className="relative">
        <MessageSquare className="w-5 h-5 fill-white text-emerald-600" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping"></span>
      </div>
      <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider">
        Chat on WhatsApp
      </span>
    </a>
  );
}
