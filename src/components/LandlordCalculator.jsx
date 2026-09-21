import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  ShieldCheck, 
  Banknote, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Building2, 
  FileText, 
  Wrench, 
  UserCheck, 
  Clock, 
  Smartphone,
  HelpCircle
} from 'lucide-react';

// Currency presets with realistic default rent per unit
const CURRENCIES = [
  { code: 'NGN', symbol: '₦', label: 'NGN (₦)', defaultRent: 4000000, step: 250000, min: 500000, max: 35000000 },
  { code: 'USD', symbol: '$', label: 'USD ($)', defaultRent: 8000, step: 500, min: 1000, max: 80000 },
  { code: 'GBP', symbol: '£', label: 'GBP (£)', defaultRent: 6500, step: 500, min: 1000, max: 60000 },
  { code: 'CAD', symbol: 'C$', label: 'CAD (C$)', defaultRent: 10000, step: 500, min: 1500, max: 90000 },
];

export default function LandlordCalculator({ onOpenContact }) {
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [units, setUnits] = useState(4); // Default to a 4-flat residence / duplex
  const [rentPerUnit, setRentPerUnit] = useState(CURRENCIES[0].defaultRent);
  const [activeTab, setActiveTab] = useState('comparison'); // 'comparison' | 'breakdown'

  // Switch currency & update default values smoothly
  const handleCurrencyChange = (newCurr) => {
    setCurrency(newCurr);
    setRentPerUnit(newCurr.defaultRent);
  };

  // Financial calculations in clear plain English
  const calculations = useMemo(() => {
    const totalGrossAnnual = units * rentPerUnit;
    const managementFee = totalGrossAnnual * 0.10; // 10% Royal Haven standard fee
    const ownerNetAnnual = totalGrossAnnual * 0.90; // 90% direct payout
    const ownerNetMonthly = Math.round(ownerNetAnnual / 12);
    const totalGrossMonthly = Math.round(totalGrossAnnual / 12);

    return {
      totalGrossAnnual,
      managementFee,
      ownerNetAnnual,
      ownerNetMonthly,
      totalGrossMonthly,
    };
  }, [units, rentPerUnit]);

  // Format currency numbers nicely with commas
  const formatAmount = (amount) => {
    return `${currency.symbol}${Number(amount).toLocaleString('en-US')}`;
  };

  // Quick preset buttons for common Nigerian/Diaspora property types
  const quickPresets = [
    { label: '1 Luxury Flat', units: 1, rent: currency.code === 'NGN' ? 5000000 : 9000 },
    { label: 'Duplex (2 Units)', units: 2, rent: currency.code === 'NGN' ? 4500000 : 8000 },
    { label: 'Block of 4 Flats', units: 4, rent: currency.code === 'NGN' ? 3500000 : 6500 },
    { label: '8-Unit Building', units: 8, rent: currency.code === 'NGN' ? 3000000 : 5500 },
    { label: '12-Unit Estate', units: 12, rent: currency.code === 'NGN' ? 2500000 : 4800 },
  ];

  const handleApplyPreset = (preset) => {
    setUnits(preset.units);
    setRentPerUnit(preset.rent);
  };

  const handleConsultationClick = () => {
    if (onOpenContact) {
      onOpenContact({
        service: 'Full Property Management',
        location: 'Lagos State / Ogun State',
        notes: `Landlord Calculator Estimate:
- Number of Units: ${units} unit(s)
- Annual Rent per Unit: ${formatAmount(rentPerUnit)}/year
- Estimated Total Rent: ${formatAmount(calculations.totalGrossAnnual)}/year
- Estimated 90% Landlord Payout: ${formatAmount(calculations.ownerNetAnnual)}/year (${formatAmount(calculations.ownerNetMonthly)}/month)
- Inquiring about hands-free property management and guaranteed remittance.`
      });
    }
  };

  return (
    <section id="calculator" className="py-24 bg-[#08080c] text-white relative overflow-hidden border-t border-b border-amber-500/10">
      {/* Subtle Background Glows */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gold-glow pointer-events-none blur-[140px] opacity-15" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/10 pointer-events-none blur-[120px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs uppercase tracking-widest font-bold">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Landlord Income Tool</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Calculate Your <span className="text-gold-gradient">Guaranteed Rental Payout</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            See exactly how much rental income goes into your bank account every year. 
            Zero hidden costs, zero guesswork, and 100% peace of mind.
          </p>

          {/* Currency Toggle */}
          <div className="pt-2 flex items-center justify-center space-x-2">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mr-1">
              Select Currency:
            </span>
            <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-700/80 shadow-inner">
              {CURRENCIES.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => handleCurrencyChange(curr)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    currency.code === curr.code
                      ? 'bg-gold-gradient text-slate-950 shadow-md scale-105'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {curr.code} ({curr.symbol})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div className="mb-10 flex items-center justify-center">
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mr-2 hidden sm:inline">
              Quick Setup:
            </span>
            {quickPresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleApplyPreset(preset)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  units === preset.units && rentPerUnit === preset.rent
                    ? 'bg-amber-500/20 border-gold-500 text-amber-200'
                    : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:border-gold-500/50 hover:text-white'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Calculator Main Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Sliders & Inputs (5 Cols) */}
          <div className="lg:col-span-5 glass-card p-6 sm:p-8 border-gold-glow rounded-2xl space-y-7 shadow-xl">
            
            <div className="border-b border-white/10 pb-4">
              <h3 className="font-serif text-xl font-bold text-white flex items-center">
                <Building2 className="w-5 h-5 text-gold-400 mr-2 shrink-0" />
                <span>Your Property Details</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Move the sliders to match your flats or residential units.
              </p>
            </div>

            {/* Control 1: Number of Units */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center">
                  <span>Number of Flats / Units</span>
                </label>
                <div className="px-3 py-1 bg-amber-500/10 border border-gold-500/30 rounded-lg text-gold-300 font-bold text-sm">
                  {units} {units === 1 ? 'Unit' : 'Units'}
                </div>
              </div>

              <input
                type="range"
                min="1"
                max="24"
                step="1"
                value={units}
                onChange={(e) => setUnits(parseInt(e.target.value) || 1)}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
              />

              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>1 Unit (Single Home)</span>
                <span>12 Units</span>
                <span>24 Units (Estate)</span>
              </div>
            </div>

            {/* Control 2: Expected Rent Per Unit */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Annual Rent Per Unit
                </label>
                <div className="px-3 py-1 bg-amber-500/10 border border-gold-500/30 rounded-lg text-gold-300 font-bold text-sm">
                  {formatAmount(rentPerUnit)} / year
                </div>
              </div>

              <input
                type="range"
                min={currency.min}
                max={currency.max}
                step={currency.step}
                value={rentPerUnit}
                onChange={(e) => setRentPerUnit(parseInt(e.target.value) || currency.min)}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
              />

              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>Min: {formatAmount(currency.min)}</span>
                <span>Max: {formatAmount(currency.max)}</span>
              </div>
            </div>

            {/* Total Annual Rent Summary Bar */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Total Gross Rent from {units} {units === 1 ? 'Unit' : 'Units'}:</span>
                <span className="font-bold text-slate-200">{formatAmount(calculations.totalGrossAnnual)} / yr</span>
              </div>
              <div className="text-[11px] text-slate-400 leading-relaxed">
                This is the 100% total rent collected from your tenants every 12 months.
              </div>
            </div>

            {/* Transparency Note */}
            <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-gold-500/5 border border-gold-500/20 text-xs text-slate-300 leading-relaxed">
              <ShieldCheck className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-200 block mb-0.5">Simple, Transparent 10% Fee</strong>
                Royal Haven charges only 10% on collected rent. We never charge hidden management fees or unexpected service markups.
              </div>
            </div>

          </div>

          {/* Right Column: Results & Clarity Cards (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Main Result Card: What You Receive (90%) */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-obsidian-900 to-slate-950 border-2 border-gold-500/50 p-6 sm:p-8 shadow-gold-lg">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 blur-3xl pointer-events-none" />
              
              <div className="relative z-10 space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5">
                  <div>
                    <span className="text-xs uppercase tracking-widest font-bold text-gold-400 block">
                      Your Guaranteed Net Income
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
                      What You Take Home (90%)
                    </h3>
                  </div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider w-fit">
                    <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
                    <span>Direct Bank Deposit</span>
                  </div>
                </div>

                {/* Big Payout Numbers */}
                <div className="grid sm:grid-cols-2 gap-4">
                  
                  {/* Annual Remittance */}
                  <div className="p-5 rounded-xl bg-obsidian-950/80 border border-gold-500/30 space-y-1">
                    <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block">
                      Annual Net Remittance (90%)
                    </span>
                    <span className="text-3xl sm:text-4xl font-black font-serif text-gold-gradient tracking-tight block">
                      {formatAmount(calculations.ownerNetAnnual)}
                    </span>
                    <span className="text-[11px] text-slate-400 block pt-1">
                      Deposited directly to your designated bank account.
                    </span>
                  </div>

                  {/* Monthly Average Equivalent */}
                  <div className="p-5 rounded-xl bg-obsidian-950/80 border border-white/10 space-y-1">
                    <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block">
                      Monthly Average Equivalent
                    </span>
                    <span className="text-2xl sm:text-3xl font-bold font-serif text-white block">
                      {formatAmount(calculations.ownerNetMonthly)}
                    </span>
                    <span className="text-[11px] text-slate-400 block pt-1">
                      Consistent passive income without tenant headaches.
                    </span>
                  </div>

                </div>

                {/* Plain-English 10% Fee Breakdown */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">
                      Royal Haven Management Fee (10%):
                    </span>
                    <span className="font-bold text-amber-300 text-sm">
                      {formatAmount(calculations.managementFee)} / year
                    </span>
                  </div>
                  <div className="text-slate-300 text-[12px] sm:max-w-xs leading-snug">
                    Covers complete tenant vetting, rent collection, routine photo inspections, artisan oversight, and legal tenancy agreements.
                  </div>
                </div>

                {/* Action CTA Button */}
                <div className="pt-2">
                  <button
                    onClick={handleConsultationClick}
                    className="w-full py-4 text-xs sm:text-sm uppercase tracking-widest font-bold rounded-xl text-slate-950 bg-gold-gradient hover:brightness-110 shadow-gold-md hover:shadow-gold-lg transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer group"
                  >
                    <span>Have Royal Haven Manage My Property</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-center text-[11px] text-slate-400 mt-2">
                    Free Consultation &bull; Zero Upfront Setup Fees &bull; Instant Portal Access
                  </p>
                </div>

              </div>
            </div>

            {/* Comparison Tab / Switcher: Self-Managing vs Royal Haven Managed */}
            <div className="glass-card p-6 sm:p-7 rounded-2xl border-white/10 space-y-5">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h4 className="font-serif text-lg font-bold text-white flex items-center">
                  <Banknote className="w-5 h-5 text-gold-400 mr-2" />
                  <span>Why Landlords Choose Royal Haven</span>
                </h4>
                <span className="text-xs text-amber-300 font-semibold">
                  Crystal Clear Comparison
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-xs">
                
                {/* Column 1: Self Managing (The Headaches) */}
                <div className="p-4 rounded-xl bg-red-950/15 border border-red-900/30 space-y-3">
                  <div className="flex items-center space-x-2 text-red-300 font-bold uppercase tracking-wider text-[11px]">
                    <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>Managing On Your Own</span>
                  </div>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-start">
                      <span className="text-red-400 mr-1.5 font-bold">&bull;</span>
                      <span>Chasing tenants endlessly for delayed rent payments</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-400 mr-1.5 font-bold">&bull;</span>
                      <span>Artisans inflating repair costs and doing poor work</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-400 mr-1.5 font-bold">&bull;</span>
                      <span>Stressful tenant arguments and disputes at odd hours</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-400 mr-1.5 font-bold">&bull;</span>
                      <span>Difficult to monitor if you live in the diaspora (UK/US/Canada)</span>
                    </li>
                  </ul>
                </div>

                {/* Column 2: Royal Haven Managed (Hands-Free) */}
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-300 font-bold uppercase tracking-wider text-[11px]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>With Royal Haven (10% Fee)</span>
                  </div>
                  <ul className="space-y-2 text-slate-200">
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-1.5 font-bold">&bull;</span>
                      <span><strong>90% guaranteed net payout</strong> transferred directly on schedule</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-1.5 font-bold">&bull;</span>
                      <span>Vetted, verified tenants with strong income and guarantors</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-1.5 font-bold">&bull;</span>
                      <span>Routine photo inspections uploaded to your 24/7 Landlord Portal</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-1.5 font-bold">&bull;</span>
                      <span>Zero stress: we handle repairs, tenant calls, and legal compliance</span>
                    </li>
                  </ul>
                </div>

              </div>

              {/* 4 Feature Badges */}
              <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-white/5">
                <div className="flex items-center space-x-2 text-slate-300">
                  <UserCheck className="w-4 h-4 text-gold-400 shrink-0" />
                  <span className="text-[11px] font-medium">Vetted Tenants</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                  <span className="text-[11px] font-medium">Prompt Remittance</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <Wrench className="w-4 h-4 text-gold-400 shrink-0" />
                  <span className="text-[11px] font-medium">Artisan Oversight</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <Smartphone className="w-4 h-4 text-gold-400 shrink-0" />
                  <span className="text-[11px] font-medium">24/7 Online Portal</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

