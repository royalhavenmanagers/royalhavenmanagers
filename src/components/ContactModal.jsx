import React, { useState } from 'react';
import { X, Send, Phone, Mail, MapPin, CheckCircle, Clock } from 'lucide-react';
import { companyData } from '../data/companyData';

export default function ContactModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    propertyType: 'Property Management',
    location: '',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl glass-card border-gold-glow p-6 sm:p-8 my-8 shadow-gold-lg">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-gold-400 transition-colors rounded-lg hover:bg-white/5"
        >
          <X className="w-6 h-6" />
        </button>

        {submitted ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-gold-500/20 text-gold-400 border border-gold-500/40 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-white">Consultation Request Received!</h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto">
              Thank you for contacting Royal Haven Realty & Property Managers Ltd. One of our executive property consultants will contact you within 24 hours.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-block px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-[10px] uppercase font-bold tracking-widest">
                DIRECT CONSULTATION BOOKING
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Request a <span className="text-gold-gradient">Personal Consultation</span>
              </h3>
              <p className="text-xs text-slate-300">
                Provide your property details below for a customized management proposal and valuation assessment.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Chief Adeleke Johnson"
                    className="w-full bg-obsidian-900 border border-gold-500/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 08153785297"
                    className="w-full bg-obsidian-900 border border-gold-500/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. adeleke@domain.com"
                    className="w-full bg-obsidian-900 border border-gold-500/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Service Required
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    className="w-full bg-obsidian-900 border border-gold-500/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500 transition-colors"
                  >
                    <option value="Property Management">Property Management</option>
                    <option value="Property Sales">Property Sales & Buying</option>
                    <option value="Lettings & Leasing">Lettings & Leasing</option>
                    <option value="Valuation & Surveying">Estate Surveying & Valuation</option>
                    <option value="Tenant Screening">Tenant Screening</option>
                    <option value="Documentation">Property Legal Documentation</option>
                    <option value="Real Estate Advisory">Real Estate Advisory</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Property Location (City / State)
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Lekki Phase 1, Lagos or Abeokuta, Ogun State"
                  className="w-full bg-obsidian-900 border border-gold-500/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Additional Notes / Specific Requirements
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Describe your property (number of units, current occupancy, or specific questions)..."
                  className="w-full bg-obsidian-900 border border-gold-500/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 text-xs uppercase tracking-widest font-bold rounded-xl text-obsidian-900 bg-gold-gradient hover:brightness-110 shadow-gold-md transition-all flex items-center justify-center space-x-2"
              >
                <span>Submit Consultation Request</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
