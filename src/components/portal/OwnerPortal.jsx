import React, { useState, useEffect } from 'react';
import { 
  Building2, Home, Users, DollarSign, Wrench, ClipboardCheck, 
  FileText, ShieldCheck, LogOut, ArrowLeft, Printer, Download, 
  AlertTriangle, CheckCircle, Clock, ChevronRight, Eye, Phone, 
  Mail, Calendar, Sparkles, MessageCircle, ExternalLink, Filter, Plus, Globe,
  Activity, TrendingUp, BarChart3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { portalStore } from '../../data/portalStore';
import { companyData } from '../../data/companyData';
import StatementPrintView from './StatementPrintView';

export default function OwnerPortal({ onReturnHome }) {
  const { profile, logout } = useAuth();

  // Data states
  const [properties, setProperties] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [documents, setDocuments] = useState([]);

  // Selected property filter ('all' or property id)
  const [selectedPropertyId, setSelectedPropertyId] = useState('all');

  // Navigation tab
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'units', 'financials', 'maintenance', 'inspections', 'documents'

  // Print Statement Modal State
  const [activeStatementForPrint, setActiveStatementForPrint] = useState(null);

  // Selected Unit detail modal state
  const [selectedUnitDetail, setSelectedUnitDetail] = useState(null);

  // Multi-Currency Diaspora Mode ('NGN', 'USD', 'CAD', 'GBP', 'EUR')
  const [selectedCurrency, setSelectedCurrency] = useState('NGN');

  // Onboard New Property Modal State
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [onboardFormData, setOnboardFormData] = useState({
    propertyName: '',
    address: '',
    city: 'Lagos',
    state: 'Lagos State',
    propertyType: 'Residential Block of Flats',
    unitsCount: '6',
    targetRent: '2500000',
    preferredInspectionDate: '',
    notes: ''
  });
  const [onboardSuccessMessage, setOnboardSuccessMessage] = useState('');

  const CURRENCY_RATES = {
    NGN: { rate: 1, symbol: '₦', code: 'NGN', label: 'NGN (₦)' },
    USD: { rate: 1520, symbol: '$', code: 'USD', label: 'USD ($)' },
    CAD: { rate: 1120, symbol: 'C$', code: 'CAD', label: 'CAD (C$)' },
    GBP: { rate: 1980, symbol: '£', code: 'GBP', label: 'GBP (£)' },
    EUR: { rate: 1650, symbol: '€', code: 'EUR', label: 'EUR (€)' }
  };

  const loadPortalData = () => {
    const allProps = portalStore.getProperties();
    const assigned = profile?.assignedProperties || [];
    const ownerEmail = profile?.email ? profile.email.toLowerCase().trim() : '';
    const ownerId = profile?.id || '';
    
    // An owner sees their assigned properties (by name/ID or by ownerEmail/ownerId)
    const ownerProps = (profile?.role === 'super_admin' || profile?.role === 'property_manager')
      ? allProps
      : allProps.filter(p => {
          const matchAssigned = assigned.length > 0 && assigned.some(a => a && (p.name?.toLowerCase().includes(a.toLowerCase()) || p.id === a));
          const matchEmail = Boolean(ownerEmail && p.ownerEmail && p.ownerEmail.toLowerCase().trim() === ownerEmail);
          const matchId = Boolean(ownerId && p.ownerId && p.ownerId === ownerId);
          return matchAssigned || matchEmail || matchId;
        });

    setProperties(ownerProps);
    const propIds = new Set(ownerProps.map(p => p.id));
    const propNames = new Set(ownerProps.map(p => p.name?.toLowerCase().trim()));

    setTransactions(portalStore.getTransactions().filter(t => 
      propIds.has(t.propertyId) || 
      (t.propertyName && propNames.has(t.propertyName.toLowerCase().trim())) ||
      (ownerEmail && t.ownerEmail && t.ownerEmail.toLowerCase().trim() === ownerEmail)
    ));
    setMaintenance(portalStore.getMaintenance().filter(m => propIds.has(m.propertyId)));
    setInspections(portalStore.getInspections().filter(i => propIds.has(i.propertyId)));
    setDocuments(portalStore.getDocuments().filter(d => propIds.has(d.propertyId)));
  };

  useEffect(() => {
    loadPortalData();
  }, [profile]);

  // Format currency helper supporting NGN, USD, CAD, GBP, EUR
  const formatCurrency = (nairaAmount) => {
    const num = Number(nairaAmount) || 0;
    if (selectedCurrency === 'NGN') {
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 0
      }).format(num);
    }
    const curr = CURRENCY_RATES[selectedCurrency];
    const converted = Math.round(num / curr.rate);
    return `${curr.symbol}${converted.toLocaleString('en-US')}`;
  };

  // Helper for lease expiry status badges
  const getLeaseBadge = (unit) => {
    if (unit.status !== 'occupied' || !unit.tenant) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-600">
          Vacant
        </span>
      );
    }
    if (!unit.tenant.leaseEnd) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-600">
          Occupied
        </span>
      );
    }
    const today = new Date();
    const endDate = new Date(unit.tenant.leaseEnd);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-950 text-red-300 border border-red-700 animate-pulse">
          ⚠️ Lease Expired ({Math.abs(diffDays)}d ago)
        </span>
      );
    } else if (diffDays <= 30) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-950 text-amber-300 border border-amber-500 animate-pulse">
          ⚡ Renewal Due in {diffDays} Days
        </span>
      );
    } else if (diffDays <= 90) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-950/70 text-amber-200 border border-amber-600/50">
          ⏳ Expiring Soon ({diffDays} Days)
        </span>
      );
    } else {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-600">
          ✓ Active Lease ({diffDays}d left)
        </span>
      );
    }
  };

  // 1-Click WhatsApp Remittance Sharing
  const handleShareRemittanceWhatsApp = (tx) => {
    const gross = formatCurrency(tx.deductions?.grossRent || tx.amount);
    const fee = formatCurrency(tx.deductions?.managementFee || 0);
    const maint = formatCurrency(tx.deductions?.maintenanceCost || 0);
    const net = formatCurrency(tx.deductions?.netRemitted || tx.amount);

    const message = `📋 *ROYAL HAVEN REMITTANCE STATEMENT*\n` +
      `----------------------------------------\n` +
      `🏢 *Property:* ${tx.propertyName}\n` +
      `📅 *Date:* ${tx.date}\n` +
      `🔢 *Reference Code:* ${tx.referenceCode}\n` +
      `----------------------------------------\n` +
      `💵 *Gross Rent Collected:* ${gross}\n` +
      `💼 *Management Fee (10%):* -${fee}\n` +
      `🔧 *Audited Maintenance:* -${maint}\n` +
      `💰 *Net Remitted to Bank:* *${net}*\n` +
      `🏦 *Beneficiary Account:* ${tx.beneficiaryBank || profile?.bank_name} (${tx.beneficiaryAccount || profile?.account_number})\n` +
      `✅ *Status:* Paid & Reconciled\n` +
      `----------------------------------------\n` +
      `Royal Haven Realty & Property Managers Ltd.\n` +
      `Managing Director: Ibrahim Ridwan Olasunkanmi\n` +
      `Web: www.royalhaven.com.ng`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Handle Onboard Property Form Submission
  const handleOnboardPropertySubmit = (e) => {
    e.preventDefault();
    if (!onboardFormData.propertyName || !onboardFormData.address) {
      alert("Please provide the Property Name and Address.");
      return;
    }

    const unitsCount = Math.max(1, parseInt(onboardFormData.unitsCount, 10) || 1);
    const targetRent = Number(onboardFormData.targetRent) || 0;
    const newPropId = `prop-${Date.now()}`;

    const newProperty = {
      id: newPropId,
      name: onboardFormData.propertyName.trim(),
      address: onboardFormData.address.trim(),
      city: onboardFormData.city || 'Lagos',
      state: onboardFormData.state || 'Lagos State',
      propertyType: onboardFormData.propertyType,
      status: 'under_onboarding_audit',
      ownerEmail: profile?.email || '',
      ownerId: profile?.id || '',
      unitsCount: unitsCount,
      notes: onboardFormData.notes,
      preferredInspectionDate: onboardFormData.preferredInspectionDate,
      units: Array.from({ length: unitsCount }, (_, i) => ({
        id: `unit-${newPropId}-${i + 1}`,
        unitNumber: `Flat ${i + 1}`,
        floorPlanType: 'Apartment',
        rentAmount: targetRent,
        serviceCharge: 0,
        bedrooms: 3,
        bathrooms: 3,
        status: 'vacant'
      }))
    };

    portalStore.addProperty(newProperty);

    // Save to Onboarding Submissions Queue so Admin gets instant review & approval action
    portalStore.addOnboardingSubmission({
      ownerId: profile?.id || '',
      ownerName: profile?.full_name || 'Property Owner',
      ownerEmail: profile?.email || '',
      ownerPhone: profile?.phone || '',
      propertyName: onboardFormData.propertyName.trim(),
      address: onboardFormData.address.trim(),
      city: onboardFormData.city || 'Lagos',
      state: onboardFormData.state || 'Lagos State',
      propertyType: onboardFormData.propertyType,
      unitsCount: unitsCount,
      targetRent: targetRent,
      notes: onboardFormData.notes,
      preferredInspectionDate: onboardFormData.preferredInspectionDate,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    });

    // Update owner assigned properties
    if (profile?.id) {
      const currentAssigned = profile.assignedProperties || [];
      const updatedAssigned = [...currentAssigned, newProperty.name];
      portalStore.updateOwner(profile.id, { assignedProperties: updatedAssigned });
    }

    // Attempt to log an inquiry lead in the background so admin gets notified
    try {
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: profile?.full_name || 'Registered Property Owner',
          phone: profile?.phone || 'Not Provided',
          email: profile?.email || 'owner@royalhaven.com.ng',
          propertyType: onboardFormData.propertyType,
          location: `${onboardFormData.address}, ${onboardFormData.city}`,
          notes: `[ONBOARDING REQUEST via Portal]: ${unitsCount} units of ${onboardFormData.propertyType}. Estimated Rent: ${targetRent}/unit. Inspection Request: ${onboardFormData.preferredInspectionDate || 'Flexible'}. Notes: ${onboardFormData.notes || 'None'}`
        })
      }).catch(() => {});
    } catch {}

    loadPortalData();
    setShowOnboardModal(false);
    setOnboardSuccessMessage(`"${newProperty.name}" submitted! Royal Haven management desk has initiated the onboarding and physical inspection schedule.`);
    setTimeout(() => setOnboardSuccessMessage(''), 8000);
  };

  // Filtered properties based on selector
  const visibleProperties = selectedPropertyId === 'all'
    ? properties
    : properties.filter(p => p.id === selectedPropertyId);

  // Flattened units across visible properties
  const visibleUnits = visibleProperties.flatMap(p => 
    (p.units || []).map(u => ({ ...u, propertyName: p.name, propertyId: p.id }))
  );

  // Filtered transactions
  const visibleTransactions = selectedPropertyId === 'all'
    ? transactions
    : transactions.filter(t => t.propertyId === selectedPropertyId);

  // Filtered maintenance
  const visibleMaintenance = selectedPropertyId === 'all'
    ? maintenance
    : maintenance.filter(m => m.propertyId === selectedPropertyId);

  // Filtered inspections
  const visibleInspections = selectedPropertyId === 'all'
    ? inspections
    : inspections.filter(i => i.propertyId === selectedPropertyId);

  // Filtered documents
  const visibleDocuments = selectedPropertyId === 'all'
    ? documents
    : documents.filter(d => d.propertyId === selectedPropertyId);

  // Calculate Metrics
  const totalUnitsCount = visibleUnits.length;
  const occupiedUnitsCount = visibleUnits.filter(u => u.status === 'occupied').length;
  const vacantUnitsCount = totalUnitsCount - occupiedUnitsCount;
  const occupancyPercentage = totalUnitsCount > 0 ? Math.round((occupiedUnitsCount / totalUnitsCount) * 100) : 0;

  const totalGrossRent = visibleUnits.reduce((acc, u) => acc + (Number(u.rentAmount) || 0), 0);
  const totalRemitted = visibleTransactions
    .filter(t => t.type === 'owner_remittance')
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  const openMaintenanceCount = visibleMaintenance.filter(m => m.status !== 'completed').length;

  const renewalDueCount = visibleUnits.filter(u => {
    if (u.status !== 'occupied' || !u.tenant?.leaseEnd) return false;
    const diff = Math.ceil((new Date(u.tenant.leaseEnd) - new Date()) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 60;
  }).length;

  const getMonthlyChartData = () => {
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const monthMap = {};
    months.forEach(m => {
      monthMap[m] = { month: m, gross: 0, net: 0 };
    });

    const remittances = visibleTransactions.filter(t => t.type === 'owner_remittance');
    if (remittances.length > 0) {
      remittances.forEach(t => {
        const d = new Date(t.date || Date.now());
        const mName = d.toLocaleString('en-US', { month: 'short' });
        const gross = Number(t.deductions?.grossRent || t.amount || 0);
        const net = Number(t.deductions?.netRemitted || t.amount || 0);
        if (monthMap[mName]) {
          monthMap[mName].gross += gross;
          monthMap[mName].net += net;
        }
      });
    }

    const values = Object.values(monthMap);
    const totalNet = values.reduce((sum, v) => sum + v.net, 0);

    if (totalNet === 0 && totalGrossRent > 0) {
      const monthlyGross = Math.round(totalGrossRent / 12);
      const monthlyNet = Math.round(monthlyGross * 0.9);
      return months.map(m => ({
        month: m,
        gross: monthlyGross,
        net: monthlyNet
      }));
    }
    return values;
  };

  const chartData = getMonthlyChartData();
  const maxChartValue = Math.max(...chartData.map(d => Math.max(d.gross, d.net)), 1000);

  // Render Statement Print View if active
  if (activeStatementForPrint) {
    return (
      <StatementPrintView
        statement={activeStatementForPrint}
        ownerProfile={profile || { full_name: 'Valued Property Owner' }}
        onClose={() => setActiveStatementForPrint(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#08080A] bg-obsidian-950 text-slate-100 font-sans selection:bg-gold-500 selection:text-slate-950">
      
      {/* Administrator Live Session Banner */}
      {profile?.isAdminImpersonating && (
        <div className="bg-gradient-to-r from-amber-600 via-gold-500 to-amber-600 text-slate-950 font-bold px-4 sm:px-8 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs shadow-md border-b border-amber-400">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-slate-950" />
            <span>Master Admin Access: You are actively managing <strong>{profile?.full_name}</strong>'s portfolio.</span>
          </div>
          <button
            onClick={() => {
              window.location.hash = '#admin';
            }}
            className="px-3.5 py-1 bg-slate-950 text-gold-300 hover:text-white rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
          >
            ← Return to Admin Portal
          </button>
        </div>
      )}

      {/* Demo Account Preview Banner */}
      {profile?.isDemoAccount && (
        <div className="bg-gradient-to-r from-amber-950 via-obsidian-900 to-amber-950 text-amber-200 px-4 sm:px-8 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs border-b border-gold-500/40 shadow-sm">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Interactive Demo Session:</strong> You are previewing a luxury portfolio in Lekki Phase 1 with live charts &amp; tenant records.
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={logout}
              className="px-3 py-1 bg-gold-gradient text-slate-950 rounded-lg text-[11px] font-bold uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer"
            >
              Exit Demo &amp; Sign In
            </button>
          </div>
        </div>
      )}

      {/* Top Professional Executive Header */}
      <header className="sticky top-0 z-40 bg-obsidian-900/95 border-b border-gold-500/25 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Portal Branding */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-200 via-gold-500 to-amber-600 p-0.5 shadow-gold-sm shrink-0">
              <div className="w-full h-full bg-obsidian-950 rounded-[10px] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-amber-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-serif text-base sm:text-lg font-bold text-white tracking-wide">
                  ROYAL HAVEN
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-gold-500/20 text-amber-300 border border-gold-500/40">
                  Owner Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Managed Portfolio of {profile?.full_name || 'Property Owner'}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Onboard Property Button */}
            <button
              onClick={() => setShowOnboardModal(true)}
              className="px-3 py-1.5 rounded-lg bg-gold-gradient text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center space-x-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
              <span className="hidden sm:inline">Onboard Property</span>
            </button>

            {/* Direct WhatsApp Concierge for Owner */}
            <a
              href={`https://wa.me/${companyData.whatsapp}?text=Hello%20Royal%20Haven,%20I%20am%20reviewing%20my%20Owner%20Portal%20portfolio%20and%20have%20an%20inquiry.`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-xs font-semibold hover:bg-emerald-900 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Owner Concierge</span>
            </a>

            {/* Back to Public Website */}
            <button
              onClick={onReturnHome}
              className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-obsidian-800 border border-slate-700 rounded-lg hover:border-gold-500/50 hover:text-white transition-all flex items-center space-x-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Website</span>
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className="px-3 py-1.5 text-xs font-semibold text-red-300 bg-red-950/60 border border-red-800/50 rounded-lg hover:bg-red-900 transition-colors flex items-center space-x-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Onboarding Success Banner */}
        {onboardSuccessMessage && (
          <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-700 text-emerald-200 text-xs flex items-center space-x-3 shadow-lg animate-fadeIn">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-medium">{onboardSuccessMessage}</span>
          </div>
        )}

        {properties.length === 0 ? (
          /* ========================================================= */
          /* FRESH SIGNUP ONBOARDING HERO (High Converting Empty State) */
          /* ========================================================= */
          <div className="glass-card p-8 sm:p-12 border-gold-glow text-center space-y-6 max-w-2xl mx-auto my-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-300 via-gold-500 to-amber-600 p-0.5 shadow-gold-md mx-auto">
              <div className="w-full h-full bg-obsidian-950 rounded-[14px] flex items-center justify-center">
                <Building2 className="w-8 h-8 text-amber-300" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-500/20 text-amber-300 border border-gold-500/40 inline-block">
                Step 1 of 2: Link Your Property
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Welcome, {profile?.full_name || 'Property Owner'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                Your landlord account is ready! To start tracking your rent collections, tenant details, and payouts, connect your building below.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setShowOnboardModal(true)}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-gold-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                <span>Register My Property</span>
              </button>

              <a
                href={`https://wa.me/${companyData.whatsapp}?text=Hello%20Royal%20Haven,%20I%20just%20logged%20into%20my%20Owner%20Portal%20and%20want%20to%20link%20my%20property.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-obsidian-900 border border-emerald-600/60 text-emerald-300 hover:bg-emerald-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Ask Management to Link It (WhatsApp)</span>
              </a>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-obsidian-900 border border-gold-500/20 text-left space-y-2.5 max-w-md mx-auto text-xs text-slate-300 mt-6">
              <p className="font-bold text-amber-300 uppercase tracking-wider text-[11px] flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1.5 text-gold-500" />
                How It Works:
              </p>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-start">
                  <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-300 font-bold flex items-center justify-center mr-2 shrink-0 text-[10px]">1</span>
                  <span>Enter your building name and address</span>
                </div>
                <div className="flex items-start">
                  <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-300 font-bold flex items-center justify-center mr-2 shrink-0 text-[10px]">2</span>
                  <span>Royal Haven links your tenants and tenancy dates</span>
                </div>
                <div className="flex items-start">
                  <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-300 font-bold flex items-center justify-center mr-2 shrink-0 text-[10px]">3</span>
                  <span>Your live dashboard lights up with rent payments &amp; bank remittance slips</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Banner with Remittance Account, Property Selector & Multi-Currency Switcher */}
            <div className="glass-card p-4 sm:p-6 border-gold-glow flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Asset Protection &amp; Remittance Active
                  </span>
                </div>
                <p className="text-sm text-slate-300">
                  Direct Remittance Bank: <strong className="text-white">{profile?.bank_name || 'Not Provided'}</strong> (Account: <strong className="text-amber-200">{profile?.account_number || '—'}</strong>)
                </p>
              </div>

              {/* Controls: Currency Switcher & Property Selector */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
                
                {/* Multi-Currency Diaspora Switcher */}
                <div className="flex items-center space-x-1 bg-obsidian-900/90 p-1 rounded-xl border border-gold-500/30">
                  <span className="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-wider flex items-center space-x-1">
                    <Globe className="w-3 h-3 text-gold-400 mr-1" />
                    <span className="hidden sm:inline">Currency:</span>
                  </span>
                  {['NGN', 'USD', 'CAD', 'GBP', 'EUR'].map(c => (
                    <button
                      key={c}
                      onClick={() => setSelectedCurrency(c)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                        selectedCurrency === c
                          ? 'bg-gold-gradient text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {c === 'NGN' ? '₦ NGN' : c === 'USD' ? '$ USD' : c === 'CAD' ? 'C$ CAD' : c === 'GBP' ? '£ GBP' : '€ EUR'}
                    </button>
                  ))}
                </div>

                {/* Property Selector Dropdown */}
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <Filter className="w-4 h-4 text-amber-400 shrink-0" />
                  <select
                    value={selectedPropertyId}
                    onChange={(e) => setSelectedPropertyId(e.target.value)}
                    className="w-full sm:w-56 bg-obsidian-900 border border-gold-500/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500 font-semibold cursor-pointer"
                  >
                    <option value="all">All Managed Properties ({properties.length})</option>
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* KPI Metrics Summary Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              
              {/* Card 1: Units & Occupancy */}
              <div className="glass-card p-5 border-gold-glow relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-200/80">Units &amp; Occupancy</span>
                  <Home className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    {occupancyPercentage}%
                  </span>
                  <span className="text-xs text-slate-400">
                    ({occupiedUnitsCount}/{totalUnitsCount} Occupied)
                  </span>
                </div>
                {/* Occupancy bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-amber-300 via-gold-500 to-emerald-400 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${occupancyPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Card 2: Annual Gross Rent Yield */}
              <div className="glass-card p-5 border-gold-glow relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-200/80">Gross Rent Value</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-lg sm:text-2xl font-extrabold text-white font-mono truncate">
                  {formatCurrency(totalGrossRent)}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Total annualized rental roll</p>
              </div>

              {/* Card 3: Total Remittances to Date */}
              <div className="glass-card p-5 border-gold-glow relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-200/80">Net Remittances</span>
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                </div>
                <div className="text-lg sm:text-2xl font-extrabold text-amber-300 font-mono truncate">
                  {formatCurrency(totalRemitted)}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Reconciled to your bank account</p>
              </div>

              {/* Card 4: Open Maintenance Work Orders */}
              <div className="glass-card p-5 border-gold-glow relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-200/80">Facility Repairs</span>
                  <Wrench className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    {openMaintenanceCount}
                  </span>
                  <span className="text-xs text-slate-400">
                    Active Tasks
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Supervised by Royal Haven engineers</p>
              </div>
            </div>

            {/* Navigation Tabs Bar */}
            <div className="border-b border-gold-500/30 overflow-x-auto pb-1">
              <div className="flex space-x-4 sm:space-x-8 min-w-max">
                {[
                  { id: 'overview', name: 'Overview', icon: Building2 },
                  { id: 'units', name: `Units & Tenants (${totalUnitsCount})`, icon: Users },
                  { id: 'financials', name: 'Remittances & Statements', icon: DollarSign },
                  { id: 'maintenance', name: `Maintenance (${openMaintenanceCount})`, icon: Wrench },
                  { id: 'inspections', name: 'Inspections', icon: ClipboardCheck },
                  { id: 'documents', name: 'Document Vault', icon: FileText }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-3 px-1 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
                        isActive
                          ? 'border-gold-500 text-amber-300'
                          : 'border-transparent text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-slate-500'}`} />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ========================================================= */}
            {/* TAB 1: OVERVIEW */}
            {/* ========================================================= */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fadeIn">
                
                {/* Visual Analytics & Data Representation Grid */}
                <div className="space-y-6">
                  {/* Chart 1: Monthly Cashflow & Remittance Trend */}
                  <div className="glass-card p-6 border-gold-glow space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <h4 className="font-serif text-base sm:text-lg font-bold text-white flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-amber-400" />
                          <span>Monthly Remittance &amp; Cashflow Trend</span>
                        </h4>
                        <p className="text-xs text-slate-400">
                          Rental yield &amp; net payouts converted in real-time to <strong className="text-amber-300">{selectedCurrency}</strong>
                        </p>
                      </div>
                      <div className="flex items-center space-x-3 text-[11px]">
                        <span className="flex items-center gap-1.5 text-slate-300">
                          <span className="w-2.5 h-2.5 rounded-full bg-gold-500"></span>
                          <span>Net Payout</span>
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
                          <span>Gross Rent</span>
                        </span>
                      </div>
                    </div>

                    {/* SVG Bar Chart with Hover Tooltips */}
                    <div className="pt-2">
                      <div className="h-56 w-full flex items-end justify-between gap-2 sm:gap-4 px-2 pt-6 pb-2 border-b border-slate-800 relative">
                        {chartData.map((d, i) => {
                          const heightPct = maxChartValue > 0 ? Math.round((d.net / maxChartValue) * 100) : 20;
                          const grossHeightPct = maxChartValue > 0 ? Math.round((d.gross / maxChartValue) * 100) : 25;
                          return (
                            <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer">
                              {/* Hover Tooltip */}
                              <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-20 bg-obsidian-950 border border-gold-500/50 text-white rounded-lg p-2 text-[10px] whitespace-nowrap shadow-gold-md">
                                <p className="font-bold text-amber-300">{d.month} Payout</p>
                                <p className="text-slate-300">Net: {formatCurrency(d.net)}</p>
                                <p className="text-slate-400">Gross: {formatCurrency(d.gross)}</p>
                              </div>

                              {/* Bars */}
                              <div className="w-full max-w-[42px] flex items-end justify-center gap-1 h-full">
                                {/* Gross Bar (subtle) */}
                                <div 
                                  className="w-2.5 bg-slate-700/60 rounded-t-sm transition-all duration-500 group-hover:bg-slate-600"
                                  style={{ height: `${Math.max(8, grossHeightPct)}%` }}
                                ></div>
                                {/* Net Bar (Gold gradient) */}
                                <div 
                                  className="w-4 sm:w-5 bg-gradient-to-t from-amber-600 via-gold-500 to-amber-300 rounded-t-md shadow-gold-sm transition-all duration-500 group-hover:brightness-125"
                                  style={{ height: `${Math.max(12, heightPct)}%` }}
                                ></div>
                              </div>

                              {/* Month Label */}
                              <span className="text-[11px] font-bold text-slate-400 mt-2 group-hover:text-amber-300 transition-colors">
                                {d.month}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Dual Gauge & Split Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Chart 2: Occupancy & Lease Health Donut Gauge */}
                    <div className="glass-card p-6 border-gold-glow space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h4 className="font-serif text-base font-bold text-white flex items-center gap-2">
                          <Activity className="w-4 h-4 text-emerald-400" />
                          <span>Portfolio Occupancy &amp; Health</span>
                        </h4>
                        <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
                          {occupiedUnitsCount}/{totalUnitsCount} Units Tenanted
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
                        {/* Circular SVG Donut */}
                        <div className="relative w-36 h-36 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="transparent"
                              stroke="#1e293b"
                              strokeWidth="12"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="transparent"
                              stroke="url(#goldGradient)"
                              strokeWidth="12"
                              strokeDasharray={`${(occupancyPercentage / 100) * 251.2} 251.2`}
                              strokeLinecap="round"
                              className="transition-all duration-1000 ease-out"
                            />
                            <defs>
                              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#f59e0b" />
                                <stop offset="50%" stopColor="#d97706" />
                                <stop offset="100%" stopColor="#10b981" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="absolute flex flex-col items-center justify-center text-center">
                            <span className="text-2xl font-black text-white font-mono">{occupancyPercentage}%</span>
                            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Occupied</span>
                          </div>
                        </div>

                        {/* Legend & Breakdown */}
                        <div className="space-y-2.5 text-xs w-full sm:w-auto">
                          <div className="flex items-center justify-between gap-4 p-2 rounded-lg bg-obsidian-900 border border-slate-800">
                            <span className="flex items-center gap-2 text-slate-300">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                              <span>Active Stable Leases:</span>
                            </span>
                            <strong className="text-white font-mono">{occupiedUnitsCount}</strong>
                          </div>
                          <div className="flex items-center justify-between gap-4 p-2 rounded-lg bg-obsidian-900 border border-slate-800">
                            <span className="flex items-center gap-2 text-slate-300">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                              <span>Renewals Due (≤60d):</span>
                            </span>
                            <strong className="text-amber-300 font-mono">{renewalDueCount}</strong>
                          </div>
                          <div className="flex items-center justify-between gap-4 p-2 rounded-lg bg-obsidian-900 border border-slate-800">
                            <span className="flex items-center gap-2 text-slate-300">
                              <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
                              <span>Vacant Units:</span>
                            </span>
                            <strong className="text-slate-400 font-mono">{totalUnitsCount - occupiedUnitsCount}</strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Chart 3: Income Distribution Split Bar */}
                    <div className="glass-card p-6 border-gold-glow space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h4 className="font-serif text-base font-bold text-white flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-amber-300" />
                          <span>Financial Yield Distribution</span>
                        </h4>
                        <span className="text-[11px] text-amber-300 font-bold font-mono">
                          100% Reconciled
                        </span>
                      </div>

                      <p className="text-xs text-slate-300">
                        Gross rental income collected is transparently distributed as follows:
                      </p>

                      <div className="space-y-2 pt-1">
                        <div className="w-full h-5 rounded-xl bg-slate-800 overflow-hidden flex shadow-inner">
                          <div 
                            className="bg-gradient-to-r from-amber-400 to-amber-500 h-full transition-all duration-500" 
                            style={{ width: '90%' }} 
                            title="Net Remitted to Landlord (90%)"
                          ></div>
                          <div 
                            className="bg-slate-600 h-full transition-all duration-500" 
                            style={{ width: '10%' }} 
                            title="Management & Vetting Fee (10%)"
                          ></div>
                        </div>

                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>90% Landlord Payout</span>
                          <span>10% Management Fee</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="p-3 rounded-xl bg-obsidian-900 border border-gold-500/30">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Net Landlord Yield</span>
                          <strong className="text-base text-amber-300 font-mono block truncate">
                            {formatCurrency(totalRemitted || Math.round(totalGrossRent * 0.9))}
                          </strong>
                        </div>
                        <div className="p-3 rounded-xl bg-obsidian-900 border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">10% Agency Mgmt Fee</span>
                          <strong className="text-base text-slate-300 font-mono block truncate">
                            {formatCurrency(Math.round(totalGrossRent * 0.1))}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Properties Showcase Cards */}
                <div className="space-y-4">
                  <h3 className="font-serif text-xl font-bold text-white flex items-center justify-between">
                    <span>Managed Properties Showcase</span>
                    <span className="text-xs text-slate-400 font-sans font-normal">
                      Showing {visibleProperties.length} property portfolio
                    </span>
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {visibleProperties.map(prop => (
                      <div key={prop.id} className="glass-card overflow-hidden border-gold-glow flex flex-col justify-between">
                        <div className="relative h-48 sm:h-56 bg-obsidian-900 overflow-hidden">
                          <img 
                            src={prop.coverImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'} 
                            alt={prop.name}
                            className="w-full h-full object-cover" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/20 to-transparent"></div>
                          <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            prop.status === 'under_onboarding_audit'
                              ? 'bg-amber-500 text-slate-950 shadow-md'
                              : 'bg-emerald-950/90 text-emerald-300 border border-emerald-500'
                          }`}>
                            {prop.status === 'under_onboarding_audit' ? 'Audit & Onboarding in Progress' : 'Active Management'}
                          </span>
                          <div className="absolute bottom-4 left-4 right-4">
                            <h4 className="font-serif text-xl font-bold text-white">{prop.name}</h4>
                            <p className="text-xs text-slate-300">{prop.address}, {prop.city}</p>
                          </div>
                        </div>

                        <div className="p-5 space-y-4">
                          <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 bg-obsidian-900/80 rounded-xl border border-slate-800">
                            <div>
                              <span className="text-slate-400 text-[10px] uppercase block">Total Flats</span>
                              <strong className="text-white text-sm">{(prop.units || []).length}</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[10px] uppercase block">Occupied</span>
                              <strong className="text-emerald-400 text-sm">
                                {(prop.units || []).filter(u => u.status === 'occupied').length}
                              </strong>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[10px] uppercase block">Gross Yield</span>
                              <strong className="text-amber-300 text-xs font-mono">
                                {formatCurrency((prop.units || []).reduce((acc, u) => acc + (Number(u.rentAmount) || 0), 0))}
                              </strong>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                            <span>Type: <strong className="text-white">{prop.propertyType}</strong></span>
                            <button
                              onClick={() => {
                                setSelectedPropertyId(prop.id);
                                setActiveTab('units');
                              }}
                              className="text-amber-300 hover:text-white font-bold flex items-center space-x-1"
                            >
                              <span>View Units &amp; Leases</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Remittances Snippet */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl font-bold text-white">Recent Remittances Dispatched</h3>
                    <button
                      onClick={() => setActiveTab('financials')}
                      className="text-xs text-amber-300 hover:text-white font-bold flex items-center space-x-1"
                    >
                      <span>View All Statements</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="glass-card overflow-hidden border-gold-glow">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-obsidian-900 border-b border-gold-500/20 text-slate-400 uppercase text-[10px] tracking-wider">
                          <th className="p-4 font-semibold">Date</th>
                          <th className="p-4 font-semibold">Property</th>
                          <th className="p-4 font-semibold">Reference</th>
                          <th className="p-4 font-semibold text-right">Net Remitted</th>
                          <th className="p-4 font-semibold text-center">Status</th>
                          <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {visibleTransactions.filter(t => t.type === 'owner_remittance').slice(0, 3).map(tx => (
                          <tr key={tx.id} className="hover:bg-slate-900/50">
                            <td className="p-4 text-slate-300 font-mono">{tx.date}</td>
                            <td className="p-4 font-bold text-white">{tx.propertyName}</td>
                            <td className="p-4 font-mono text-slate-400">{tx.referenceCode}</td>
                            <td className="p-4 text-right font-bold text-amber-300 font-mono text-sm">
                              {formatCurrency(tx.deductions?.netRemitted || tx.amount)}
                            </td>
                            <td className="p-4 text-center">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                                Paid &amp; Reconciled
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => handleShareRemittanceWhatsApp(tx)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-300 hover:bg-emerald-900 text-[11px] font-bold transition-all flex items-center space-x-1"
                                  title="Share breakdown on WhatsApp"
                                >
                                  <MessageCircle className="w-3 h-3 text-emerald-400" />
                                  <span>WhatsApp</span>
                                </button>
                                <button
                                  onClick={() => setActiveStatementForPrint(tx)}
                                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-gold-500 hover:text-obsidian-950 text-[11px] font-bold text-amber-200 transition-colors inline-flex items-center space-x-1"
                                >
                                  <Printer className="w-3 h-3" />
                                  <span>PDF</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 2: UNITS & TENANTS MATRIX */}
            {/* ========================================================= */}
            {activeTab === 'units' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white">Units &amp; Tenancy Roster</h3>
                    <p className="text-xs text-slate-400">Detailed overview of all units, tenant vetting status, and lease lifecycles.</p>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-300 font-bold">
                      {occupiedUnitsCount} Occupied
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-bold">
                      {vacantUnitsCount} Vacant
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visibleUnits.map(unit => (
                    <div key={unit.id} className="glass-card p-6 border-gold-glow flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider block">
                              {unit.propertyName}
                            </span>
                            <h4 className="font-serif text-lg font-bold text-white mt-0.5">{unit.unitNumber}</h4>
                          </div>
                          <div>
                            {getLeaseBadge(unit)}
                          </div>
                        </div>

                        <p className="text-xs text-slate-400 mt-2">{unit.floorPlanType} • {unit.bedrooms} Beds, {unit.bathrooms} Baths</p>

                        <div className="mt-4 p-3 bg-obsidian-900/90 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Annual Rent:</span>
                            <span className="font-bold text-white font-mono">{formatCurrency(unit.rentAmount)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Service Charge:</span>
                            <span className="font-bold text-slate-300 font-mono">{formatCurrency(unit.serviceCharge)}</span>
                          </div>
                        </div>

                        {unit.tenant ? (
                          <div className="mt-4 space-y-2 text-xs border-t border-slate-800/80 pt-3">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Current Tenant:</span>
                              <span className="font-bold text-amber-200">{unit.tenant.fullName}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-400">
                              <span>Lease Period:</span>
                              <span>{unit.tenant.leaseStart} to {unit.tenant.leaseEnd}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-400">Rent Payment:</span>
                              <span className="text-emerald-400 font-semibold">{unit.tenant.paymentStatus}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-4 p-3 rounded-lg bg-slate-900/60 border border-dashed border-slate-700 text-center text-xs text-slate-400">
                            Available for Marketing &amp; Tenant Placement
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedUnitDetail(unit)}
                        className="w-full py-2 rounded-xl bg-slate-800 hover:bg-gold-gradient hover:text-obsidian-950 text-xs font-bold text-amber-200 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Full Tenancy File</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 3: FINANCIALS & REMITTANCE LEDGER */}
            {/* ========================================================= */}
            {activeTab === 'financials' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white">Owner Remittance Ledger</h3>
                    <p className="text-xs text-slate-400">Transparent financial statements with itemized rent, management deductions, and bank confirmation.</p>
                  </div>
                </div>

                <div className="glass-card overflow-hidden border-gold-glow">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-obsidian-900 border-b border-gold-500/20 text-slate-400 uppercase text-[10px] tracking-wider">
                          <th className="p-4 font-semibold">Date</th>
                          <th className="p-4 font-semibold">Property</th>
                          <th className="p-4 font-semibold">Reference Code</th>
                          <th className="p-4 font-semibold text-right">Gross Rent</th>
                          <th className="p-4 font-semibold text-right">Fee (10%)</th>
                          <th className="p-4 font-semibold text-right">Maint. Deductions</th>
                          <th className="p-4 font-semibold text-right">Net Remitted</th>
                          <th className="p-4 font-semibold text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {visibleTransactions.filter(t => t.type === 'owner_remittance').map(tx => (
                          <tr key={tx.id} className="hover:bg-slate-900/60">
                            <td className="p-4 text-slate-300 font-mono">{tx.date}</td>
                            <td className="p-4 font-bold text-white">{tx.propertyName}</td>
                            <td className="p-4 font-mono text-slate-400">{tx.referenceCode}</td>
                            <td className="p-4 text-right font-mono text-slate-300">
                              {formatCurrency(tx.deductions?.grossRent || tx.amount)}
                            </td>
                            <td className="p-4 text-right font-mono text-red-400">
                              - {formatCurrency(tx.deductions?.managementFee || 0)}
                            </td>
                            <td className="p-4 text-right font-mono text-red-400">
                              - {formatCurrency(tx.deductions?.maintenanceCost || 0)}
                            </td>
                            <td className="p-4 text-right font-bold text-amber-300 font-mono text-sm">
                              {formatCurrency(tx.deductions?.netRemitted || tx.amount)}
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <button
                                  onClick={() => handleShareRemittanceWhatsApp(tx)}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-300 hover:bg-emerald-900 font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-1 cursor-pointer"
                                  title="Share on WhatsApp"
                                >
                                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>WhatsApp</span>
                                </button>
                                <button
                                  onClick={() => setActiveStatementForPrint(tx)}
                                  className="px-3 py-1.5 rounded-lg bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center space-x-1 cursor-pointer"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                  <span>PDF Statement</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 4: MAINTENANCE & REPAIRS */}
            {/* ========================================================= */}
            {activeTab === 'maintenance' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">Facility Maintenance Log</h3>
                  <p className="text-xs text-slate-400">All repair orders are vetted, supervised, and audited by Royal Haven facility engineers.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {visibleMaintenance.map(item => (
                    <div key={item.id} className="glass-card p-6 border-gold-glow space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider block">
                              {item.propertyName} • {item.unitNumber}
                            </span>
                            <h4 className="font-serif text-base font-bold text-white mt-1">{item.title}</h4>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                            item.status === 'completed' 
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-600' 
                              : 'bg-amber-950 text-amber-300 border border-amber-600'
                          }`}>
                            {item.status === 'completed' ? 'Resolved' : 'In Progress'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

                        {item.photos && item.photos.length > 0 && (
                          <div className="pt-2">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Site Documentation Photo</span>
                            <div className="h-40 rounded-xl overflow-hidden border border-slate-800">
                              <img src={item.photos[0]} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-800 text-xs space-y-2.5 text-slate-400">
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Vetted Contractor:</span>
                            <strong className="text-white">{item.contractor}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Audited Cost:</span>
                            <strong className="text-amber-300 font-mono">{formatCurrency(item.actualCost)}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Reported Date:</span>
                            <span>{item.reportedDate}</span>
                          </div>
                        </div>

                        {item.invoiceUrl && (
                          <div className="pt-1">
                            <a
                              href={item.invoiceUrl}
                              download={item.invoiceName || `${item.propertyName}-Contractor-Invoice.pdf`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-gold-gradient hover:text-slate-950 border border-gold-500/30 text-amber-300 font-bold text-xs transition-all flex items-center justify-center space-x-1.5 shadow-sm"
                            >
                              <FileText className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">View Contractor Invoice ({item.invoiceName || 'PDF'})</span>
                            </a>
                          </div>
                        )}

                        <a
                          href={`https://wa.me/${companyData.whatsapp}?text=Hello%20Royal%20Haven,%20I%20am%20reviewing%20maintenance%20ticket%20(${item.id})%20for%20${item.propertyName}%20regarding%20"${item.title}".`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 rounded-xl bg-obsidian-900 border border-gold-500/40 text-amber-300 hover:bg-gold-gradient hover:text-slate-950 font-bold text-xs transition-all flex items-center justify-center space-x-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Discuss / Approve on WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 5: INSPECTIONS */}
            {/* ========================================================= */}
            {activeTab === 'inspections' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">Routine Property Inspections</h3>
                  <p className="text-xs text-slate-400">Physical condition audits, structural checks, and preventive maintenance observations.</p>
                </div>

                <div className="space-y-6">
                  {visibleInspections.map(insp => (
                    <div key={insp.id} className="glass-card p-6 border-gold-glow space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
                        <div>
                          <h4 className="font-serif text-lg font-bold text-white">{insp.propertyName}</h4>
                          <p className="text-xs text-slate-400">Inspected by: <strong className="text-amber-200">{insp.inspectorName}</strong></p>
                        </div>
                        <div className="flex items-center space-x-3 text-xs">
                          <span className="text-slate-400">{insp.inspectionDate}</span>
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-600">
                            Condition: {insp.overallCondition}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed bg-obsidian-900/90 p-4 rounded-xl border border-slate-800/80">
                        "{insp.notes}"
                      </p>

                      {insp.photos && insp.photos.length > 0 && (
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Inspection Field Photos</span>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {insp.photos.map((ph, idx) => (
                              <div key={idx} className="h-28 rounded-xl overflow-hidden border border-slate-800">
                                <img src={ph} alt="Inspection" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 6: DOCUMENT VAULT */}
            {/* ========================================================= */}
            {activeTab === 'documents' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">Secure Asset Document Vault</h3>
                  <p className="text-xs text-slate-400">Encrypted repository of your official property deeds, executed tenancy agreements, and certificates.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visibleDocuments.map(doc => (
                    <div key={doc.id} className="glass-card p-6 border-gold-glow flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-gold-500/30 flex items-center justify-center text-amber-300">
                          <FileText className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider block">
                          {doc.propertyName}
                        </span>
                        <h4 className="font-serif text-base font-bold text-white">{doc.title}</h4>
                        <p className="text-xs text-slate-400">Added: {doc.date} • Size: {doc.fileSize}</p>
                      </div>

                      <a
                        href={doc.fileUrl}
                        onClick={(e) => {
                          e.preventDefault();
                          alert(`Accessing encrypted document: "${doc.title}". In cloud deployment, this generates an authorized signed URL.`);
                        }}
                        className="w-full py-2.5 rounded-xl bg-obsidian-900 border border-gold-500/40 text-amber-300 hover:bg-gold-gradient hover:text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Document</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* ========================================================= */}
      {/* ONBOARD NEW PROPERTY MODAL WIZARD                         */}
      {/* ========================================================= */}
      {showOnboardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/90 backdrop-blur-md animate-fadeIn">
          <div className="glass-card max-w-xl w-full p-6 sm:p-8 border-gold-glow shadow-gold-lg relative space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                  Property Management Onboarding
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  Register Property for Management
                </h3>
              </div>
              <button
                onClick={() => setShowOnboardModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleOnboardPropertySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-amber-200/90 uppercase tracking-wider mb-1">
                  Property Name / Estate Title *
                </label>
                <input
                  type="text"
                  required
                  value={onboardFormData.propertyName}
                  onChange={(e) => setOnboardFormData({ ...onboardFormData, propertyName: e.target.value })}
                  placeholder="e.g. Adeleke Palm Court, Horizon Apartments"
                  className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-amber-200/90 uppercase tracking-wider mb-1">
                    Street Address / Environs *
                  </label>
                  <input
                    type="text"
                    required
                    value={onboardFormData.address}
                    onChange={(e) => setOnboardFormData({ ...onboardFormData, address: e.target.value })}
                    placeholder="e.g. 14 Admiralty Way, Lekki Phase 1"
                    className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-amber-200/90 uppercase tracking-wider mb-1">
                    City / State
                  </label>
                  <input
                    type="text"
                    value={onboardFormData.city}
                    onChange={(e) => setOnboardFormData({ ...onboardFormData, city: e.target.value })}
                    placeholder="e.g. Lagos, Abeokuta, Sagamu"
                    className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-amber-200/90 uppercase tracking-wider mb-1">
                    Property Category
                  </label>
                  <select
                    value={onboardFormData.propertyType}
                    onChange={(e) => setOnboardFormData({ ...onboardFormData, propertyType: e.target.value })}
                    className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-gold-500"
                  >
                    <option value="Residential Block of Flats">Block of Flats</option>
                    <option value="Terrace Duplexes">Terrace Duplexes</option>
                    <option value="Detached Duplex / Mansion">Detached Mansion</option>
                    <option value="Commercial Complex / Plaza">Commercial Plaza</option>
                    <option value="Serviced Apartments">Serviced Apartments</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-amber-200/90 uppercase tracking-wider mb-1">
                    Number of Units / Flats *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={onboardFormData.unitsCount}
                    onChange={(e) => setOnboardFormData({ ...onboardFormData, unitsCount: e.target.value })}
                    placeholder="e.g. 6"
                    className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-amber-200/90 uppercase tracking-wider mb-1">
                    Target Rent / Unit (₦)
                  </label>
                  <input
                    type="number"
                    value={onboardFormData.targetRent}
                    onChange={(e) => setOnboardFormData({ ...onboardFormData, targetRent: e.target.value })}
                    placeholder="e.g. 2500000"
                    className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-amber-200/90 uppercase tracking-wider mb-1">
                  Preferred Date for Physical Inspection
                </label>
                <input
                  type="date"
                  value={onboardFormData.preferredInspectionDate}
                  onChange={(e) => setOnboardFormData({ ...onboardFormData, preferredInspectionDate: e.target.value })}
                  className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block font-bold text-amber-200/90 uppercase tracking-wider mb-1">
                  Special Notes / Current Tenancy Situation
                </label>
                <textarea
                  rows="3"
                  value={onboardFormData.notes}
                  onChange={(e) => setOnboardFormData({ ...onboardFormData, notes: e.target.value })}
                  placeholder="e.g. Some tenants are currently owing rent; building needs plumbing inspection."
                  className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 leading-relaxed"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowOnboardModal(false)}
                  className="px-4 py-2.5 text-slate-400 hover:text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gold-gradient text-slate-950 font-bold uppercase tracking-wider hover:brightness-110 shadow-gold-sm transition-all"
                >
                  Submit Property for Management
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tenancy Drill-down Drawer / Modal */}
      {selectedUnitDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/90 backdrop-blur-md animate-fadeIn">
          <div className="glass-card max-w-lg w-full p-6 sm:p-8 border-gold-glow shadow-gold-lg relative space-y-6">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider block">
                  {selectedUnitDetail.propertyName}
                </span>
                <h3 className="font-serif text-xl font-bold text-white">
                  {selectedUnitDetail.unitNumber} - Tenancy Record
                </h3>
              </div>
              <button
                onClick={() => setSelectedUnitDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {selectedUnitDetail.tenant ? (
              <div className="space-y-4 text-xs">
                <div className="bg-obsidian-900 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Vetted Tenant:</span>
                    <strong className="text-white">{selectedUnitDetail.tenant.fullName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Contact Phone:</span>
                    <strong className="text-amber-300">{selectedUnitDetail.tenant.phone}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Contact Email:</span>
                    <strong className="text-slate-300">{selectedUnitDetail.tenant.email}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Lease Commencement:</span>
                    <strong className="text-white">{selectedUnitDetail.tenant.leaseStart}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Lease Expiration:</span>
                    <strong className="text-white">{selectedUnitDetail.tenant.leaseEnd}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment Status:</span>
                    <strong className="text-emerald-400">{selectedUnitDetail.tenant.paymentStatus}</strong>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400">
                  Tenant was fully screened via Royal Haven 4-Point Vetting Protocol (Identity, employment audit, past landlord verification, and legal agreement execution).
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">
                This unit is currently vacant. Royal Haven is actively marketing and screening prospective tenants.
              </p>
            )}

            <div className="pt-2">
              <button
                onClick={() => setSelectedUnitDetail(null)}
                className="w-full py-2.5 rounded-xl bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-wider hover:brightness-110"
              >
                Close File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
