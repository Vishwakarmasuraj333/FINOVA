'use client';

import React, { useState, useEffect } from 'react';
import {
  Receipt,
  Plus,
  RefreshCw,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { formatPaise, formatDateTime } from '@/lib/utils/format';
import { Settlement, PaymentProvider, Account } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ProviderBadge } from '@/components/shared/ProviderBadge';
import { useAuth } from '@/lib/auth/AuthContext';

export default function SettlementsPage() {
  const { currentUser } = useAuth();
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [providers, setProviders] = useState<PaymentProvider[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  // New Settlement Modal
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [provId, setProvId] = useState('');
  const [destAccId, setDestAccId] = useState('');
  const [grossRupees, setGrossRupees] = useState('');
  const [feeRupees, setFeeRupees] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchSettlements = async () => {
    setLoading(true);
    try {
      const [setRes, provRes, accRes] = await Promise.all([
        fetch('/api/settlements'),
        fetch('/api/providers'),
        fetch('/api/accounts'),
      ]);
      const [setData, provData, accData] = await Promise.all([
        setRes.json(),
        provRes.json(),
        accRes.json(),
      ]);
      setSettlements(setData);
      setProviders(provData);
      setAccounts(accData);
      if (provData.length > 0) setProvId(provData[0].id);
      if (accData.length > 0) setDestAccId(accData[0].id);
    } catch (err) {
      console.error('Error fetching settlements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettlements();
  }, []);

  const handleCreateSettlement = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const grossPaise = Math.round(parseFloat(grossRupees || '0') * 100);
      const feePaise = Math.round(parseFloat(feeRupees || '0') * 100);
      const taxPaise = Math.round(feePaise * 0.18);

      const res = await fetch('/api/settlements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': currentUser.role,
          'x-user-name': currentUser.name,
        },
        body: JSON.stringify({
          provider_id: provId,
          destination_account_id: destAccId,
          gross_amount_paise: grossPaise,
          fee_deducted_paise: feePaise,
          tax_deducted_paise: taxPaise,
        }),
      });

      if (!res.ok) throw new Error('Failed to record settlement batch');
      setIsNewOpen(false);
      setGrossRupees('');
      setFeeRupees('');
      fetchSettlements();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const totalSettled = settlements
    .filter(s => s.status === 'SETTLED')
    .reduce((s, set) => s + set.net_amount_paise, 0);

  const totalInTransit = settlements
    .filter(s => s.status === 'IN_TRANSIT' || s.status === 'SCHEDULED')
    .reduce((s, set) => s + set.net_amount_paise, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#303A31] dark:border-[#303A31] light:border-[#E1E8DF]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
              Provider Settlements & Payouts
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {formatPaise(totalSettled)} Received
            </span>
          </div>
          <p className="text-xs text-[#A0ACA1] mt-1">
            Settlement batches credited from Razorpay, PhonePe, and Cashfree into HDFC and ICICI corporate accounts.
          </p>
        </div>

        <button
          onClick={() => setIsNewOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-primary text-black font-bold text-xs hover:bg-brand-accent transition-colors self-start sm:self-auto shadow-xs"
        >
          <Plus size={15} />
          <span>Record Settlement Batch</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF]">
          <span className="text-[11px] font-bold text-[#A0ACA1] uppercase tracking-wider">
            Total Settled Net Liquidity Received
          </span>
          <div className="text-2xl font-black text-emerald-400 tabular-nums mt-1">
            {formatPaise(totalSettled)}
          </div>
          <p className="text-[10px] text-[#A0ACA1] mt-1">
            Verified with bank credit confirmation UTRs
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF]">
          <span className="text-[11px] font-bold text-[#A0ACA1] uppercase tracking-wider">
            Outstanding / In-Transit Settlements
          </span>
          <div className="text-2xl font-black text-amber-400 tabular-nums mt-1">
            {formatPaise(totalInTransit)}
          </div>
          <p className="text-[10px] text-[#A0ACA1] mt-1">
            Expected on T+1 / T+2 settlement schedule
          </p>
        </div>
      </div>

      {/* Settlements Table */}
      <div className="rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <RefreshCw size={24} className="animate-spin text-brand-primary" />
            <span className="text-xs text-[#A0ACA1]">Loading settlement batches...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#131814] border-b border-[#303A31] text-[10px] font-bold text-[#A0ACA1] uppercase">
                <tr>
                  <th className="py-3 px-4">Settlement Ref</th>
                  <th className="py-3 px-4">Provider Rail</th>
                  <th className="py-3 px-4">Destination Bank A/C</th>
                  <th className="py-3 px-4">Bank UTR Number</th>
                  <th className="py-3 px-4 text-right">Gross Amount</th>
                  <th className="py-3 px-4 text-right">Deductions (MDR+GST)</th>
                  <th className="py-3 px-4 text-right">Net Credited</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#303A31]/50">
                {settlements.map(set => {
                  const prov = providers.find(p => p.id === set.provider_id);
                  const dest = accounts.find(a => a.id === set.destination_account_id);
                  return (
                    <tr
                      key={set.id}
                      className="hover:bg-[#222B23] dark:hover:bg-[#222B23] light:hover:bg-[#F0F4EE] transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                        {set.settlement_ref}
                      </td>

                      <td className="py-3.5 px-4">
                        <ProviderBadge code={prov ? prov.code : 'bank'} name={prov ? prov.name : 'Provider Rail'} size="sm" />
                      </td>

                      <td className="py-3.5 px-4 text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                        {dest ? dest.name : 'Bank Account'}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#A0ACA1]">
                        {set.utr_number || 'Pending'}
                      </td>

                      <td className="py-3.5 px-4 text-right tabular-nums text-[#A0ACA1]">
                        {formatPaise(set.gross_amount_paise)}
                      </td>

                      <td className="py-3.5 px-4 text-right tabular-nums text-rose-400">
                        -{formatPaise(set.fee_deducted_paise + set.tax_deducted_paise)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-black tabular-nums text-emerald-400">
                        {formatPaise(set.net_amount_paise)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <StatusBadge status={set.status} size="sm" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Settlement Modal */}
      {isNewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <form
            onSubmit={handleCreateSettlement}
            className="w-full max-w-md p-6 rounded-2xl bg-[#1A211B] border border-[#303A31] space-y-4 animate-slide-up"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#303A31]">
              <h3 className="text-base font-bold text-[#F4F7F1]">
                Record Settlement Batch
              </h3>
              <button
                type="button"
                onClick={() => setIsNewOpen(false)}
                className="p-1 rounded-md text-[#A0ACA1] hover:text-[#F4F7F1]"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">Provider Source</label>
              <select
                value={provId}
                onChange={e => setProvId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none"
              >
                {providers.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">Destination Bank Account</label>
              <select
                value={destAccId}
                onChange={e => setDestAccId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none"
              >
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.account_number_masked})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">Gross Inflow (INR)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={grossRupees}
                  onChange={e => setGrossRupees(e.target.value)}
                  placeholder="250000.00"
                  className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">Fee Deducted (INR)</label>
                <input
                  type="number"
                  step="0.01"
                  value={feeRupees}
                  onChange={e => setFeeRupees(e.target.value)}
                  placeholder="4500.00"
                  className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsNewOpen(false)}
                className="px-4 py-2 text-xs font-medium text-[#A0ACA1] hover:text-[#F4F7F1]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-primary text-black hover:bg-brand-accent transition-colors disabled:opacity-50"
              >
                {submitting ? 'Recording...' : 'Record Settlement'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

