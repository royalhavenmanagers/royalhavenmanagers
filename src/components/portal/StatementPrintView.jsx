import React from 'react';
import { Printer, ArrowLeft, Download, ShieldCheck, CheckCircle } from 'lucide-react';
import { companyData } from '../../data/companyData';

export default function StatementPrintView({ statement, ownerProfile, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 font-sans text-slate-900">
      {/* Action Header - Hidden during print */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <button
          onClick={onClose}
          className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-all flex items-center space-x-1.5 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portal</span>
        </button>

        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-700 font-medium hidden sm:inline">
            Use standard "Save as PDF" destination in print dialog
          </span>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-300 via-gold-500 to-amber-500 rounded-xl hover:shadow-gold-sm transition-all flex items-center space-x-2 font-bold shadow"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Statement Document */}
      <div className="max-w-4xl mx-auto bg-white border border-slate-300 shadow-xl rounded-2xl p-8 sm:p-14 print:p-0 print:border-none print:shadow-none">
        
        {/* Header with Royal Haven Identity */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-gold-500 pb-6 mb-8 gap-4">
          <div className="space-y-1">
            <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
              ROYAL HAVEN REALTY &amp; PROPERTY MANAGERS LTD.
            </h1>
            <p className="text-xs font-semibold text-gold-600 tracking-wider uppercase">
              RC: Official Property Management &amp; Asset Protection
            </p>
            <p className="text-xs text-slate-700">
              Lagos State &amp; Ogun State Environs, Nigeria | Phone: +234 815 378 5297
            </p>
            <p className="text-xs text-slate-700">
              Email: royalhavenrealtyproperty@gmail.com | Web: www.royalhaven.com.ng
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="inline-block px-3 py-1 bg-amber-50 border border-amber-300 text-amber-900 rounded-lg text-xs font-bold uppercase tracking-wider mb-1">
              Official Remittance Statement
            </span>
            <p className="text-xs text-slate-700 font-mono">Ref: {statement.referenceCode}</p>
            <p className="text-xs text-slate-700">Date: {statement.date}</p>
          </div>
        </div>

        {/* Owner & Property Metadata Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8 text-xs">
          <div className="space-y-1.5">
            <span className="font-bold text-slate-700 uppercase tracking-wider block">Property Owner Details</span>
            <p className="text-sm font-bold text-slate-900">{ownerProfile.full_name}</p>
            <p className="text-slate-700">Email: {ownerProfile.email}</p>
            <p className="text-slate-700">Phone: {ownerProfile.phone}</p>
            <p className="text-slate-700">
              Remittance Account: {statement.beneficiaryBank || ownerProfile.bank_name} ({statement.beneficiaryAccount || ownerProfile.account_number})
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="font-bold text-slate-700 uppercase tracking-wider block">Managed Property</span>
            <p className="text-sm font-bold text-slate-900">{statement.propertyName}</p>
            <p className="text-slate-700">Scope: Comprehensive Property &amp; Tenant Management</p>
            <p className="text-slate-700">Remittance Status: <strong className="text-emerald-700 font-bold uppercase">Dispatched &amp; Reconciled</strong></p>
            <p className="text-slate-700">Managing Director: Ibrahim Ridwan Olasunkanmi</p>
          </div>
        </div>

        {/* Remittance Itemized Financial Table */}
        <div className="mb-8">
          <h3 className="font-serif text-sm sm:text-base font-bold text-slate-900 mb-3 uppercase tracking-wider">
            Statement Breakdown &amp; Reconciled Deductions
          </h3>
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-gold-400">
                <th className="p-3 text-left font-bold uppercase">Item Description</th>
                <th className="p-3 text-center font-bold uppercase">Category</th>
                <th className="p-3 text-right font-bold uppercase">Amount (NGN)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 border-b border-slate-300">
              <tr>
                <td className="p-3 font-semibold text-slate-900">
                  Gross Rental Revenue Collected
                  <span className="block text-[11px] text-slate-700 font-normal">
                    Aggregated rent receipts for managed units during reporting cycle
                  </span>
                </td>
                <td className="p-3 text-center text-slate-700">Gross Income</td>
                <td className="p-3 text-right font-bold text-slate-900 font-mono">
                  {formatNaira(statement.deductions?.grossRent || statement.amount)}
                </td>
              </tr>

              {statement.deductions?.managementFee > 0 && (
                <tr className="bg-slate-50/50">
                  <td className="p-3 text-slate-800">
                    Royal Haven Professional Management Fee (10%)
                    <span className="block text-[11px] text-slate-700 font-normal">
                      Tenancy oversight, rent collection, tenant screening &amp; routine coordination
                    </span>
                  </td>
                  <td className="p-3 text-center text-slate-700">Management Fee</td>
                  <td className="p-3 text-right font-bold text-red-600 font-mono">
                    - {formatNaira(statement.deductions.managementFee)}
                  </td>
                </tr>
              )}

              {statement.deductions?.maintenanceCost > 0 && (
                <tr className="bg-slate-50/50">
                  <td className="p-3 text-slate-800">
                    Approved Facility Maintenance Deductions
                    <span className="block text-[11px] text-slate-700 font-normal">
                      Vetted contractor repairs (invoices audited &amp; verified by Royal Haven desk)
                    </span>
                  </td>
                  <td className="p-3 text-center text-slate-700">Maintenance</td>
                  <td className="p-3 text-right font-bold text-red-600 font-mono">
                    - {formatNaira(statement.deductions.maintenanceCost)}
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-amber-50 border-t-2 border-gold-500">
                <td colSpan="2" className="p-4 font-serif text-sm font-bold text-slate-950 uppercase">
                  Net Amount Remitted to Owner
                </td>
                <td className="p-4 text-right font-serif text-base font-extrabold text-slate-950 font-mono">
                  {formatNaira(statement.deductions?.netRemitted || statement.amount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Narrative & Verification Note */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-10 text-xs text-slate-700 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-800 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Remittance Verified &amp; Audit Completed</span>
          </div>
          <p className="leading-relaxed">
            {statement.description}
          </p>
          <p className="text-[11px] text-slate-700">
            Funds were wired directly to the designated beneficiary account via automated NIP interbank clearing. Please retain this official statement for corporate accounting and tax filings.
          </p>
        </div>

        {/* Signatures & Execution Section */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs">
          <div className="space-y-1">
            <p className="font-bold text-slate-900">Ibrahim Ridwan Olasunkanmi</p>
            <p className="text-slate-700">Managing Director / CEO</p>
            <p className="text-slate-700 font-serif italic text-gold-600">Royal Haven Realty &amp; Property Managers Ltd.</p>
          </div>

          <div className="text-right space-y-1">
            <p className="font-bold text-slate-900">Audit &amp; Accounts Division</p>
            <p className="text-slate-700">Remittance Officer Sign-off</p>
            <p className="text-slate-700 font-mono text-[10px]">VERIFIED-HASH: {statement.referenceCode}</p>
          </div>
        </div>

        <div className="mt-8 text-center text-[10px] text-slate-700 print:mt-12">
          Royal Haven Realty &amp; Property Managers Ltd. — Building Trust. Managing Excellence. Creating Value.
        </div>
      </div>
    </div>
  );
}
