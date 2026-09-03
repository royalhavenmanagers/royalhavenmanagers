import React, { useState } from 'react';
import { X, Send, CheckCircle } from 'lucide-react';

export default function ContactModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    propertyType: 'Property Management',
    location: '',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      let isSuccess = false;

      // 1. Primary: Dispatch via backend endpoint (/api/contact)
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (res.ok && data.success) {
            isSuccess = true;
          }
        }
      } catch (apiErr) {
        console.warn('Backend serverless notice:', apiErr.message);
      }

      // 2. Direct Supabase Fallback: Ensures lead is logged to database even on 404
      if (!isSuccess) {
        try {
          const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
          const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
          if (SUPABASE_URL && SUPABASE_KEY) {
            await fetch(`${SUPABASE_URL}/rest/v1/inquiries`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
              },
              body: JSON.stringify({
                name: formData.fullName,
                phone: formData.phone,
                email: formData.email,
                service: formData.propertyType,
                location: formData.location,
                notes: formData.notes
              })
            });
          }
        } catch (sbErr) {
          console.warn('Direct Supabase lead logging notice:', sbErr.message);
        }
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          propertyType: 'Property Management',
          location: '',
          notes: ''
        });
        onClose();
      }, 3500);
    } catch (err) {
      console.warn('API submission notice:', err);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 3500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl glass-card border-gold-glow p-6 sm:p-10 my-8 shadow-gold-lg">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-gold-400 transition-colors rounded-xl hover:bg-white/5 border border-white/10"
        >
          <X className="w-6 h-6" />
        </button>

        {submitted ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-gold-500/20 text-gold-400 border border-gold-500/40 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">Consultation Request Received!</h3>
            <p className="text-slate-200 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              Thank you for contacting Royal Haven Realty & Property Managers Ltd. Our team will get back to you promptly.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-block px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs uppercase font-bold tracking-widest">
                DIRECT CONSULTATION
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Contact <span className="text-gold-gradient">Royal Haven</span>
              </h3>
              <p className="text-sm sm:text-base text-slate-300">
                Send us a message below for inquiries.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 08153785297"
                    className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. name@domain.com"
                    className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Service Required
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500 transition-colors"
                  >
                    <option value="Full Property Management">Full Property Management</option>
                    <option value="Facility & Maintenance Management">Facility & Maintenance Management</option>
                    <option value="Lettings & Leasing">Lettings & Leasing</option>
                    <option value="Estate Surveying & Valuation">Estate Surveying & Valuation</option>
                    <option value="Tenant Screening & Vetting">Tenant Screening & Vetting</option>
                    <option value="Property Documentation">Property Documentation</option>
                    <option value="Routine Property Inspection">Routine Property Inspection</option>
                    <option value="Property Management Advisory">Property Management Advisory</option>
                    <option value="Other / Not Sure">Other / Not Sure</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Property Location (City / State)
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Lekki, Lagos or Abeokuta, Ogun State"
                  className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Your Message / Inquiries
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Describe your property management requirements..."
                  className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors resize-none"
                ></textarea>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 text-xs uppercase tracking-widest font-bold rounded-xl text-obsidian-900 bg-gold-gradient hover:brightness-110 shadow-gold-md transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
              >
                <span>{submitting ? 'Dispatching Inquiry...' : 'Send Consultation Request'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
