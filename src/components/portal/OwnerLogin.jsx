import React, { useState, useEffect } from 'react';
import { Lock, Mail, ArrowLeft, ShieldCheck, KeyRound, Sparkles, AlertCircle, CheckCircle, User, Phone, Landmark, CreditCard, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi, isSupabaseConfigured, supabase } from '../../lib/supabaseClient';
import { companyData } from '../../data/companyData';

export default function OwnerLogin({ onReturnHome }) {
  const { login, signup } = useAuth();
  
  // Auth mode: 'signin', 'signup', or 'reset-password'
  const [authMode, setAuthMode] = useState('signin');

  // Sign In fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sign Up fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  // New Password fields (for recovery from email link)
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password reset modal state (for requesting the link)
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState({ loading: false, success: '', error: '' });

  // Detect #reset-password in URL or recovery token from Supabase
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash || '';
      if (hash.includes('reset-password') || hash.includes('type=recovery') || hash.includes('access_token')) {
        setAuthMode('reset-password');
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);

    // Also listen to Supabase auth event for PASSWORD_RECOVERY
    let sub = null;
    if (isSupabaseConfigured && supabase) {
      const { data } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'PASSWORD_RECOVERY') {
          setAuthMode('reset-password');
        }
      });
      sub = data.subscription;
    }

    return () => {
      window.removeEventListener('hashchange', checkHash);
      if (sub) sub.unsubscribe();
    };
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    const res = await login(email, password);
    if (!res.success) {
      setErrorMessage(res.error || 'Invalid credentials. Please check your email or password.');
    }
    setIsSubmitting(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (signupPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (signupPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    const res = await signup({
      email,
      password: signupPassword,
      fullName,
      phone,
      bankName,
      accountNumber,
      accountName
    });

    if (res.success) {
      if (res.autoLogin) {
        // Automatically logged in by AuthContext
      } else {
        setSuccessMessage(res.message || 'Account created successfully! Please sign in.');
        setAuthMode('signin');
        setPassword('');
      }
    } else {
      setErrorMessage(res.error || 'Failed to create account.');
    }
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
          success: 'Password reset link sent! Check your inbox.',
          error: ''
        });
      } else {
        setResetStatus({
          loading: false,
          success: 'Reset link dispatched to your email.',
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

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isSupabaseConfigured) {
        await authApi.updatePassword(newPassword);
        setSuccessMessage('Your password has been reset successfully! You can now sign in with your new password.');
        setAuthMode('signin');
        setPassword(newPassword);
        window.location.hash = '#portal';
      } else {
        setSuccessMessage('Password updated successfully!');
        setAuthMode('signin');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update password. Link may have expired.');
    } finally {
      setIsSubmitting(false);
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
        <div className="text-center space-y-3 mb-6">
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
        </div>

        {/* Card */}
        <div className="glass-card p-6 sm:p-8 border-gold-glow shadow-gold-lg relative backdrop-blur-xl">
          
          {/* Mode Switcher Tabs (Hidden during Password Reset) */}
          {authMode !== 'reset-password' ? (
            <div className="grid grid-cols-2 gap-2 p-1 bg-obsidian-900 rounded-xl border border-gold-500/20 mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setErrorMessage('');
                }}
                className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  authMode === 'signin'
                    ? 'bg-gold-gradient text-obsidian-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setErrorMessage('');
                }}
                className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  authMode === 'signup'
                    ? 'bg-gold-gradient text-obsidian-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Register Property Owner
              </button>
            </div>
          ) : (
            <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl mb-6 flex items-center space-x-2 text-amber-300 text-xs font-semibold">
              <KeyRound className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Password Recovery: Set Your New Password</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-xs flex items-start space-x-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ======================================================= */}
          {/* 1. RESET PASSWORD FORM                                  */}
          {/* ======================================================= */}
          {authMode === 'reset-password' && (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-amber-200/90 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min. 6 characters)"
                    className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-200/90 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 text-xs font-bold uppercase tracking-wider text-obsidian-950 bg-gold-gradient rounded-xl hover:shadow-gold-md transition-all flex items-center justify-center space-x-2 font-bold disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Updating Password...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save New Password &amp; Proceed</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    window.location.hash = '#portal';
                  }}
                  className="text-xs text-slate-400 hover:text-amber-300 transition-colors"
                >
                  Return to Sign In
                </button>
              </div>
            </form>
          )}

          {/* ======================================================= */}
          {/* 2. SIGN IN FORM                                         */}
          {/* ======================================================= */}
          {authMode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-amber-200/90 uppercase tracking-wider mb-1.5">
                  Registered Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. owner@example.com"
                    className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-amber-200/90 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email);
                      setShowForgotModal(true);
                      setResetStatus({ loading: false, success: '', error: '' });
                    }}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 text-xs font-bold uppercase tracking-wider text-obsidian-950 bg-gold-gradient rounded-xl hover:shadow-gold-md transition-all flex items-center justify-center space-x-2 font-bold disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Access Owner Dashboard</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ======================================================= */}
          {/* 3. SIGN UP FORM (Register New Property Owner)           */}
          {/* ======================================================= */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-amber-200/90 uppercase tracking-wider mb-1">
                  Full Name / Entity Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Chief Adeleke Johnson"
                    className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-amber-200/90 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="owner@gmail.com"
                      className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-200/90 uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 800 000 0000"
                      className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-amber-200/90 uppercase tracking-wider mb-1">
                    Create Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Min. 6 chars"
                    className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-200/90 uppercase tracking-wider mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Remittance Banking Information (Optional for easy payouts) */}
              <div className="p-3 bg-obsidian-900/80 rounded-xl border border-gold-500/20 space-y-2.5">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Landmark className="w-3.5 h-3.5 text-gold-400" />
                  <span>Direct Remittance Bank Details (Optional)</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="Bank (e.g. Zenith)"
                      className="w-full bg-obsidian-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="10-Digit NUBAN"
                      className="w-full bg-obsidian-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="Account Name"
                      className="w-full bg-obsidian-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 text-xs font-bold uppercase tracking-wider text-obsidian-950 bg-gold-gradient rounded-xl hover:shadow-gold-md transition-all flex items-center justify-center space-x-2 font-bold disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Create &amp; Enter Owner Dashboard</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer Security Notice */}
          <div className="mt-5 pt-5 border-t border-slate-800 text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-Bit Encrypted &amp; Row-Level Database Security</span>
            </div>

            <p className="text-[11px] text-slate-400">
              Need assistance?{' '}
              <a
                href={`https://wa.me/${companyData.whatsapp}?text=Hello%20Royal%20Haven,%20I%20am%20a%20property%20owner%20and%20need%20assistance%20registering%20my%20Owner%20Portal%20account.`}
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
                  placeholder="e.g. owner@example.com"
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
