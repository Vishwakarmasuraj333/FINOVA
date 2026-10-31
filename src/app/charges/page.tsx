'use client';

import React, { useState, useEffect } from 'react';
import {
  BadgePercent,
  Plus,
  RefreshCw,
  Receipt,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { formatPaise, formatDateTime } from '@/lib/utils/format';
import { ChargeFee, PaymentProvider, Account } from '@/types';
import { ProviderBadge } from '@/components/shared/ProviderBadge';
import { useAuth } from '@/lib/auth/AuthContext';

export default function ChargesPage() {
  const { currentUser } = useAuth();
  const [charges, setCharges] = useState<ChargeFee[]>([]);
  const [providers, setProviders] = useState<PaymentProvider[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  // New Fee Rule Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [feeType, setFeeType] = useState<'PAYMENT_PROCESSING' | 'TRANSFER_PAYOUT' | 'GATEWAY_SERVICE' | 'GST_TAX'>('PAYMENT_PROCESSING');
  const [amountRupees, setAmountRupees] = useState('');
  const [rateRule, setRateRule] = useState('');
  const [isEstimated, setIsEstimated] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchCharges = async () => {
    setLoading(true);
    try {
      const [chgRes, provRes, accRes] = await Promise.all([
        fetch('/api/charges'),
        fetch('/api/providers'),
        fetch('/api/accounts'),
      ]);
      const [chgData, provData, accData] = await Promise.all([
        chgRes.json(),
        provRes.json(),
        accRes.json(),
      ]);
      setCharges(chgData);
      setProviders(provData);
      setAccounts(accData);
      if (provData.length > 0) setSelectedProviderId(provData[0].id);
      if (accData.length > 0) setSelectedAccountId(accData[0].id);
    } catch (err) {
      console.error('Error fetching charges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharges();
  }, []);

  const handleCreateCharge = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const paise = Math.round(parseFloat(amountRupees || '0') * 100);
      const res = await fetch('/api/charges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': currentUser.role,
          'x-user-name': currentUser.name,
        },
        body: JSON.stringify({
          provider_id: selectedProviderId,
          account_id: selectedAccountId,
          fee_type: feeType,
          amount_paise: paise,
          rate_rule: rateRule,
          is_estimated: isEstimated,
        }),
      });

      if (!res.ok) throw new Error('Failed to create charge rule');

      setIsAddOpen(false);
      setAmountRupees('');
      setRateRule('');
      fetchCharges();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const totalFees = charges.reduce((s, c) => s + c.amount_paise, 0);
  const totalTax = charges.reduce((s, c) => s + c.tax_paise, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#303A31] dark:border-[#303A31] light:border-[#E1E8DF]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
              Transaction Fees, Rates & GST Taxes
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/30">
              {charges.length} Rules Documented
            </span>
          </div>
          <p className="text-xs text-[#A0ACA1] mt-1">
            Audited breakdown of payment gateway MDR, payout charges, and statutory 18% GST deductions.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-primary text-black font-bold text-xs hover:bg-brand-accent transition-colors self-start sm:self-auto shadow-xs"
        >
          <Plus size={15} />
          <span>Apply Fee Rule</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF]">
          <span className="text-[11px] font-bold text-[#A0ACA1] uppercase tracking-wider">
            Total Processing & Payout Fees
          </span>
          <div className="text-2xl font-black text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219] tabular-nums mt-1">
            {formatPaise(totalFees)}
          </div>
          <span className="text-[10px] text-[#A0ACA1] mt-1 block">
            Excludes GST taxes
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF]">
          <span className="text-[11px] font-bold text-[#A0ACA1] uppercase tracking-wider">
            Total Statutory 18% GST Tax
          </span>
          <div className="text-2xl font-black text-amber-400 tabular-nums mt-1">
            {formatPaise(totalTax)}
          </div>
          <span className="text-[10px] text-[#A0ACA1] mt-1 block">
            ITC input tax credit eligible
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF]">
          <span className="text-[11px] font-bold text-[#A0ACA1] uppercase tracking-wider">
            Combined Fee Deductions
          </span>
          <div className="text-2xl font-black text-rose-400 tabular-nums mt-1">
            {formatPaise(totalFees + totalTax)}
          </div>
          <span className="text-[10px] text-[#A0ACA1] mt-1 block">
            Net deductions from gross settlement
          </span>
        </div>
      </div>

      {/* Charges Table */}
      <div className="rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <RefreshCw size={24} className="animate-spin text-brand-primary" />
            <span className="text-xs text-[#A0ACA1]">Loading fee records...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#131814] border-b border-[#303A31] text-[10px] font-bold text-[#A0ACA1] uppercase">
                <tr>
                  <th className="py-3 px-4">Charge Ref</th>
                  <th className="py-3 px-4">Provider</th>
                  <th className="py-3 px-4">Fee Classification</th>
                  <th className="py-3 px-4">Rate Rule Applied</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Fee (INR)</th>
                  <th className="py-3 px-4 text-right">GST (18%)</th>
                  <th className="py-3 px-4 text-right">Total Deducted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#303A31]/50">
                {charges.map(chg => {
                  const prov = providers.find(p => p.id === chg.provider_id);
                  return (
                    <tr
                      key={chg.id}
                      className="hover:bg-[#222B23] dark:hover:bg-[#222B23] light:hover:bg-[#F0F4EE] transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                        {chg.charge_ref}
                      </td>

                      <td className="py-3.5 px-4">
                        <ProviderBadge code={prov ? prov.code : 'bank'} name={prov ? prov.name : 'Direct Rail'} size="sm" />
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-xs text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                          {chg.fee_type.replace('_', ' ')}
                        </span>
                        <div className="text-[10px] text-[#A0ACA1]">
                          {chg.is_estimated ? 'Estimated rate' : 'Authoritative provider invoice'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-[#A0ACA1] max-w-[200px] truncate">
                        {chg.rate_rule}
                      </td>

                      <td className="py-3.5 px-4 text-[11px] text-[#A0ACA1] whitespace-nowrap">
                        {formatDateTime(chg.created_at)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-medium tabular-nums text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                        {formatPaise(chg.amount_paise)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-medium tabular-nums text-amber-400">
                        {formatPaise(chg.tax_paise)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-bold tabular-nums text-rose-400">
                        {formatPaise(chg.amount_paise + chg.tax_paise)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Fee Rule Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <form
            onSubmit={handleCreateCharge}
            className="w-full max-w-md p-6 rounded-2xl bg-[#1A211B] border border-[#303A31] space-y-4 animate-slide-up"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#303A31]">
              <h3 className="text-base font-bold text-[#F4F7F1]">
                Apply Documented Fee Rule
              </h3>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-md text-[#A0ACA1] hover:text-[#F4F7F1]"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">Provider Rail</label>
              <select
                value={selectedProviderId}
                onChange={e => setSelectedProviderId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none"
              >
                {providers.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">Fee Classification</label>
              <select
                value={feeType}
                onChange={e => setFeeType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none"
              >
                <option value="PAYMENT_PROCESSING">Payment Gateway MDR Processing</option>
                <option value="TRANSFER_PAYOUT">Payout Rail Flat Charge</option>
                <option value="GATEWAY_SERVICE">Annual / Monthly Service Charge</option>
                <option value="GST_TAX">Direct GST Surcharge</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">Fee Amount (INR)</label>
              <input
                type="number"
                step="0.01"
                required
                value={amountRupees}
                onChange={e => setAmountRupees(e.target.value)}
                placeholder="e.g. 250.00"
                className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">Calculation Rule Description</label>
              <input
                type="text"
                required
                value={rateRule}
                onChange={e => setRateRule(e.target.value)}
                placeholder="e.g. Standard 1.8% Credit Card MDR + 18% GST"
                className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 text-xs font-medium text-[#A0ACA1] hover:text-[#F4F7F1]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-primary text-black hover:bg-brand-accent transition-colors disabled:opacity-50"
              >
                {submitting ? 'Applying...' : 'Apply Fee Rule'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

