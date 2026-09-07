import React, { useState } from 'react';
import { Lock, Mail, ArrowLeft, ShieldCheck, KeyRound, Sparkles, MessageCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi, isSupabaseConfigured } from '../../lib/supabaseClient';
import { companyData } from '../../data/companyData';

export default function OwnerLogin({ onReturnHome }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Password reset modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState({ loading: false, success: '', error: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const res = await login(email, password);
    if (!res.success) {
      setErrorMessage(res.error || 'Invalid credentials. Please check your email or password.');
    }
    setIsSubmitting(false);
  };

  const handleQuickDemo = async () => {
    setEmail('owner@royalhaven.com.ng');
    setPassword('demo1234');
    setIsSubmitting(true);
    await login('owner@royalhaven.com.ng', 'demo1234');
    setIsSubmitting(false);
  };

  const handleSendResetLink = async (e) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetStatus({ loading: true, success: '', error: '' });

    try {
      if (isSupabaseConfigured) {
        await authApi.resetPassword(resetEmail);
        setResetStatus({
          loading: false,
          success: 'Password reset link sent! Check your inbox to set a new password.',
          error: ''
        });
      } else {
        setResetStatus({
          loading: false,
          success: 'Demo mode: In cloud deployment, a secure reset token is emailed to you.',
          error: ''
        });
      }
    } catch (err) {
      setResetStatus({
        loading: false,
        success: '',
        error: err.message || 'Failed to send reset link.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#060608] bg-obsidian-950 text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Royal Radial Orbs */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gold-glow pointer-events-none blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-gold-glow pointer-events-none blur-3xl opacity-15"></div>

      {/* Top Bar with Return Home */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={onReturnHome}
          className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 bg-obsidian-900/90 border border-gold-500/30 rounded-full hover:border-gold-500 hover:text-amber-300 transition-all flex items-center space-x-2 backdrop-blur-md shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Royal Haven</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        
        {/* Brand Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-200 via-gold-500 to-amber-700 p-0.5 shadow-gold-md">
            <div className="w-full h-full bg-obsidian-950 rounded-[14px] flex items-center justify-center">
              <Lock className="w-7 h-7 text-amber-300" />
            </div>
          </div>
          
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Property Owner <span className="text-gold-gradient">Portal</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Secure asset oversight, real-time rent tracking, lease updates &amp; transparent remittance statements.
          </p>

          {/* Quick Demo Access Button */}
          <div className="pt-2">
            <button
              onClick={handleQuickDemo}
              type="button"
              className="px-4 py-2 rounded-full bg-amber-500/10 border border-gold-500/40 text-amber-300 hover:bg-gold-gradient hover:text-obsidian-950 text-xs font-bold transition-all shadow-gold-sm flex items-center space-x-2 mx-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Click for Instant Demo as Owner (Chief Alabi)</span>
            </button>
          </div>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8 border-gold-glow shadow-gold-lg relative backdrop-blur-xl">
          
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-start space-x-3">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-amber-200/90 uppercase tracking-wider mb-2">
                Owner Registered Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. owner@royalhaven.com.ng"
                  className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-all font-sans"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-amber-200/90 uppercase tracking-wider">
                  Access Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-all font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-wider shadow-gold-md hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Owner Portal'}</span>
            </button>
          </form>

          {/* Security Assurance Tag */}
          <div className="mt-6 pt-6 border-t border-slate-800 text-center space-y-3">
            <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-Bit Encrypted &amp; Row-Level Database Security</span>
            </div>

            {/* Direct WhatsApp Concierge Assistance */}
            <p className="text-[11px] text-slate-400">
              Need account onboarding?{' '}
              <a
                href={`https://wa.me/${companyData.whatsapp}?text=Hello%20Royal%20Haven,%20I%20am%20a%20property%20owner%20and%20need%20assistance%20accessing%20my%20Owner%20Portal.`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 font-bold inline-flex items-center space-x-1"
              >
                <span>WhatsApp Owner Concierge</span>
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/90 backdrop-blur-md animate-fadeIn">
          <div className="glass-card max-w-md w-full p-6 sm:p-8 border-gold-glow shadow-gold-lg relative">
            <h3 className="font-serif text-lg font-bold text-white mb-2">
              Reset Owner Portal Password
            </h3>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Enter your registered email address. We will send a secure password reset link directly to your inbox via Supabase.
            </p>

            {resetStatus.success && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{resetStatus.success}</span>
              </div>
            )}

            {resetStatus.error && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{resetStatus.error}</span>
              </div>
            )}

            <form onSubmit={handleSendResetLink} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-amber-200 mb-1">
                  Registered Email
                </label>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="e.g. owner@royalhaven.com.ng"
                  className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetStatus.loading}
                  className="px-5 py-2.5 rounded-xl bg-gold-gradient text-obsidian-950 text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {resetStatus.loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
