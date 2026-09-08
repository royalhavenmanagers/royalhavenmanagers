import React, { useState, useEffect } from 'react';
import { 
  Building2, Home, Users, DollarSign, Wrench, ClipboardCheck, 
  FileText, ShieldCheck, LogOut, ArrowLeft, Printer, Download, 
  AlertTriangle, CheckCircle, Clock, ChevronRight, Eye, Phone, 
  Mail, Calendar, Sparkles, MessageCircle, ExternalLink, Filter
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

  useEffect(() => {
    // Load data from store
    setProperties(portalStore.getProperties());
    setTransactions(portalStore.getTransactions());
    setMaintenance(portalStore.getMaintenance());
    setInspections(portalStore.getInspections());
    setDocuments(portalStore.getDocuments());
  }, []);

  // Format currency helper
  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(amount || 0);
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
                Managed Portfolio of {profile?.full_name || 'Chief Adeleke Balogun'}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            
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
        
        {/* Banner with Remittance Account & Quick Property Selector */}
        <div className="glass-card p-4 sm:p-6 border-gold-glow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Asset Protection &amp; Remittance Active
              </span>
            </div>
            <p className="text-sm text-slate-300">
              Direct Remittance Bank: <strong className="text-white">{profile?.bank_name || 'Zenith Bank PLC'}</strong> (Account: <strong className="text-amber-200">{profile?.account_number || '•••••••• 4812'}</strong>)
            </p>
          </div>

          {/* Property Selector Dropdown */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-amber-400 shrink-0" />
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="w-full md:w-64 bg-obsidian-900 border border-gold-500/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500 font-semibold"
            >
              <option value="all">All Managed Properties ({properties.length})</option>
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
              ))}
            </select>
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
              {formatNaira(totalGrossRent)}
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
              {formatNaira(totalRemitted)}
            </div>
            <p className="text-[11px] text-emerald-400 mt-1 font-semibold flex items-center">
              <CheckCircle className="w-3 h-3 mr-1" /> Reconciled &amp; Paid
            </p>
          </div>

          {/* Card 4: Maintenance Status */}
          <div className="glass-card p-5 border-gold-glow relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-200/80">Maintenance</span>
              <Wrench className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                {openMaintenanceCount}
              </span>
              <span className="text-xs text-slate-400">Open Tickets</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Vetted artisan supervision</p>
          </div>
        </div>

        {/* Tab Navigation Navigation */}
        <div className="border-b border-gold-500/20 flex overflow-x-auto no-scrollbar space-x-2 sm:space-x-4">
          {[
            { id: 'overview', label: 'Overview', icon: Building2 },
            { id: 'units', label: `Units & Tenants (${visibleUnits.length})`, icon: Home },
            { id: 'financials', label: `Remittance Ledger (${visibleTransactions.length})`, icon: DollarSign },
            { id: 'maintenance', label: `Maintenance (${visibleMaintenance.length})`, icon: Wrench },
            { id: 'inspections', label: `Inspections (${visibleInspections.length})`, icon: ClipboardCheck },
            { id: 'documents', label: `Document Vault (${visibleDocuments.length})`, icon: FileText },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-3.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
                  isActive
                    ? 'border-gold-500 text-amber-300 bg-gold-500/10 rounded-t-xl'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Attention Banner for Expiring Leases */}
            {visibleUnits.some(u => u.tenant?.status === 'expiring_soon') && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/40 border border-amber-500/50 flex items-start space-x-3.5">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-amber-200 uppercase tracking-wider">
                    Upcoming Tenancy Renewal Alert
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    <strong>Flat 1B (Engr. Folake Balogun)</strong> lease expires on <strong>October 31, 2026</strong>. 
                    Royal Haven management has already initiated pre-renewal assessment and notice dispatch.
                  </p>
                </div>
              </div>
            )}

            {/* Properties Overview Cards */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-white flex items-center space-x-2">
                <span>Managed Properties</span>
                <span className="text-xs text-amber-400 font-sans font-normal">({visibleProperties.length} Assets)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {visibleProperties.map(property => (
                  <div key={property.id} className="glass-card overflow-hidden border-gold-glow flex flex-col group">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={property.coverImage} 
                        alt={property.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-transparent"></div>
                      <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-obsidian-900/90 text-amber-300 border border-gold-500/40 backdrop-blur-sm">
                        {property.propertyType}
                      </span>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h4 className="font-serif text-xl font-bold text-white">{property.name}</h4>
                        <p className="text-xs text-slate-400 mt-1">{property.address}, {property.city}, {property.state}</p>
                        <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">{property.notes}</p>
                      </div>

                      <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Units Breakdown</span>
                          <span className="font-bold text-white">
                            {property.units?.filter(u => u.status === 'occupied').length || 0} Occupied / {property.units?.length || 0} Total
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedPropertyId(property.id);
                            setActiveTab('units');
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center space-x-1"
                        >
                          <span>Manage Units</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Remittances Teaser Table */}
            <div className="glass-card p-6 border-gold-glow space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-white">Recent Remittances Dispatched</h3>
                <button
                  onClick={() => setActiveTab('financials')}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-1"
                >
                  <span>View Full Ledger</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 font-semibold">Property</th>
                      <th className="pb-3 font-semibold">Reference</th>
                      <th className="pb-3 font-semibold text-right">Net Remitted</th>
                      <th className="pb-3 font-semibold text-center">Status</th>
                      <th className="pb-3 font-semibold text-right">Statement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {visibleTransactions.filter(t => t.type === 'owner_remittance').slice(0, 3).map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-900/50">
                        <td className="py-3.5 text-slate-300">{tx.date}</td>
                        <td className="py-3.5 font-bold text-white">{tx.propertyName}</td>
                        <td className="py-3.5 font-mono text-slate-400">{tx.referenceCode}</td>
                        <td className="py-3.5 text-right font-bold text-amber-300 font-mono">
                          {formatNaira(tx.deductions?.netRemitted || tx.amount)}
                        </td>
                        <td className="py-3.5 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                            Completed
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => setActiveStatementForPrint(tx)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-gold-500 hover:text-obsidian-950 text-[11px] font-bold text-amber-200 transition-colors inline-flex items-center space-x-1"
                          >
                            <Printer className="w-3 h-3" />
                            <span>PDF</span>
                          </button>
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
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        unit.status === 'occupied' 
                          ? (unit.tenant?.status === 'expiring_soon' ? 'bg-amber-950 text-amber-300 border border-amber-600' : 'bg-emerald-950 text-emerald-300 border border-emerald-600')
                          : 'bg-slate-800 text-slate-300 border border-slate-600'
                      }`}>
                        {unit.status === 'occupied' ? (unit.tenant?.status === 'expiring_soon' ? 'Expiring Soon' : 'Occupied') : 'Vacant'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-2">{unit.floorPlanType} • {unit.bedrooms} Beds, {unit.bathrooms} Baths</p>

                    <div className="mt-4 p-3 bg-obsidian-900/90 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Annual Rent:</span>
                        <span className="font-bold text-white font-mono">{formatNaira(unit.rentAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Service Charge:</span>
                        <span className="font-bold text-slate-300 font-mono">{formatNaira(unit.serviceCharge)}</span>
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
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-gold-gradient hover:text-obsidian-950 text-xs font-bold text-amber-200 transition-all flex items-center justify-center space-x-1.5"
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
                      <th className="p-4 font-semibold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {visibleTransactions.filter(t => t.type === 'owner_remittance').map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-900/60">
                        <td className="p-4 text-slate-300 font-mono">{tx.date}</td>
                        <td className="p-4 font-bold text-white">{tx.propertyName}</td>
                        <td className="p-4 font-mono text-slate-400">{tx.referenceCode}</td>
                        <td className="p-4 text-right font-mono text-slate-300">
                          {formatNaira(tx.deductions?.grossRent || tx.amount)}
                        </td>
                        <td className="p-4 text-right font-mono text-red-400">
                          - {formatNaira(tx.deductions?.managementFee || 0)}
                        </td>
                        <td className="p-4 text-right font-mono text-red-400">
                          - {formatNaira(tx.deductions?.maintenanceCost || 0)}
                        </td>
                        <td className="p-4 text-right font-bold text-amber-300 font-mono text-sm">
                          {formatNaira(tx.deductions?.netRemitted || tx.amount)}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => setActiveStatementForPrint(tx)}
                            className="px-3 py-1.5 rounded-lg bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center space-x-1 mx-auto"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>PDF Statement</span>
                          </button>
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

                  <div className="pt-4 border-t border-slate-800 text-xs space-y-1 text-slate-400">
                    <div className="flex justify-between">
                      <span>Vetted Contractor:</span>
                      <strong className="text-white">{item.contractor}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Audited Cost:</span>
                      <strong className="text-amber-300 font-mono">{formatNaira(item.actualCost)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Reported Date:</span>
                      <span>{item.reportedDate}</span>
                    </div>
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
      </main>

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
