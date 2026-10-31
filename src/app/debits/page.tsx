'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  Plus,
  RefreshCw,
  Search,
} from 'lucide-react';
import { formatPaise, formatDateTime } from '@/lib/utils/format';
import { Transaction, Account } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ProviderBadge } from '@/components/shared/ProviderBadge';
import { useAuth } from '@/lib/auth/AuthContext';

export default function DebitsPage() {
  const { currentUser } = useAuth();
  const [debits, setDebits] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Manual Adjustment Modal
  const [isAdjOpen, setIsAdjOpen] = useState(false);
  const [adjAccId, setAdjAccId] = useState('');
  const [adjAmountRupees, setAdjAmountRupees] = useState('');
  const [adjReason, setAdjReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchDebits = async () => {
    setLoading(true);
    try {
      const [txnRes, accRes] = await Promise.all([
        fetch('/api/transactions?direction=debit&limit=50'),
        fetch('/api/accounts'),
      ]);
      const [txnData, accData] = await Promise.all([
        txnRes.json(),
        accRes.json(),
      ]);
      setDebits(txnData.data || []);
      setAccounts(accData || []);
      if (accData.length > 0) setAdjAccId(accData[0].id);
    } catch (err) {
      console.error('Error fetching debits:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebits();
  }, []);

  const handleManualAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      const paise = Math.round(parseFloat(adjAmountRupees || '0') * 100);
      const res = await fetch('/api/adjustments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': currentUser.role,
          'x-user-name': currentUser.name,
        },
        body: JSON.stringify({
          account_id: adjAccId,
          adjustment_type: 'DEBIT',
          amount_paise: paise,
          reason: adjReason,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Adjustment failed');

      setIsAdjOpen(false);
      setAdjAmountRupees('');
      setAdjReason('');
      fetchDebits();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const totalPostedDebits = debits
    .filter(d => d.status === 'COMPLETED')
    .reduce((s, d) => s + d.amount_paise, 0);

  const filtered = debits.filter(d => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      d.internal_ref.toLowerCase().includes(q) ||
      (d.recipient_name && d.recipient_name.toLowerCase().includes(q)) ||
      d.payment_method.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#303A31] dark:border-[#303A31] light:border-[#E1E8DF]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
              Outgoing Debits & Disbursements
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
              -{formatPaise(totalPostedDebits)} Posted
            </span>
          </div>
          <p className="text-xs text-[#A0ACA1] mt-1">
            Vendor payouts, bank transfers, refunds, fee charges, and authorized operational debits.
          </p>
        </div>

        <button
          onClick={() => setIsAdjOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-primary text-black font-bold text-xs hover:bg-brand-accent transition-colors self-start sm:self-auto shadow-xs"
        >
          <Plus size={15} />
          <span>Manual Debit Adjustment</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-3.5 rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] flex items-center gap-3">
        <Search size={16} className="text-[#A0ACA1]" />
        <input
          type="text"
          placeholder="Filter debits by reference, payee name, payment method..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-transparent text-xs text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219] placeholder-[#A0ACA1] focus:outline-none"
        />
      </div>

      {/* Debits Table */}
      <div className="rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <RefreshCw size={24} className="animate-spin text-brand-primary" />
            <span className="text-xs text-[#A0ACA1]">Loading debit ledger...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#A0ACA1]">
            No outgoing debits found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#131814] border-b border-[#303A31] text-[10px] font-bold text-[#A0ACA1] uppercase">
                <tr>
                  <th className="py-3 px-4">Transaction Ref</th>
                  <th className="py-3 px-4">Disbursal Rail</th>
                  <th className="py-3 px-4">Account Debited</th>
                  <th className="py-3 px-4">Payee / Beneficiary</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Fee / Tax</th>
                  <th className="py-3 px-4 text-right">Debit Amount</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#303A31]/50">
                {filtered.map(t => {
                  const acc = accounts.find(a => a.id === t.account_id);
                  return (
                    <tr
                      key={t.id}
                      className="hover:bg-[#222B23] dark:hover:bg-[#222B23] light:hover:bg-[#F0F4EE] transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                          {t.internal_ref}
                        </span>
                        <div className="text-[10px] text-[#A0ACA1] font-mono truncate max-w-[150px]">
                          {t.external_ref}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <ProviderBadge code={t.provider_id.replace('prov_', '')} size="sm" />
                      </td>

                      <td className="py-3.5 px-4 text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                        {acc ? acc.name : 'Disbursal Pool'}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                          {t.recipient_name || 'Vendor Payee'}
                        </div>
                        <div className="text-[10px] text-[#A0ACA1]">{t.payment_method}</div>
                      </td>

                      <td className="py-3.5 px-4 text-[11px] text-[#A0ACA1] whitespace-nowrap">
                        {formatDateTime(t.initiated_at)}
                      </td>

                      <td className="py-3.5 px-4 text-right tabular-nums text-[11px] text-[#A0ACA1]">
                        {formatPaise(t.fee_paise)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-extrabold text-rose-400 tabular-nums">
                        -{formatPaise(t.amount_paise)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <StatusBadge status={t.status} size="sm" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Debit Adjustment Modal */}
      {isAdjOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <form
            onSubmit={handleManualAdjustment}
            className="w-full max-w-md p-6 rounded-2xl bg-[#1A211B] border border-[#303A31] space-y-4 animate-slide-up"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#303A31]">
              <h3 className="text-base font-bold text-[#F4F7F1]">
                Authorized Debit Adjustment
              </h3>
              <button
                type="button"
                onClick={() => setIsAdjOpen(false)}
                className="p-1 rounded-md text-[#A0ACA1] hover:text-[#F4F7F1]"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">
                Target Account To Debit
              </label>
              <select
                value={adjAccId}
                onChange={e => setAdjAccId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none"
              >
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.account_number_masked})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">
                Adjustment Debit Amount (INR)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={adjAmountRupees}
                onChange={e => setAdjAmountRupees(e.target.value)}
                placeholder="e.g. 25000.00"
                className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">
                Mandatory Reason / Audit Justification (Min 10 characters)
              </label>
              <textarea
                rows={3}
                required
                value={adjReason}
                onChange={e => setAdjReason(e.target.value)}
                placeholder="Explain the operational reason for this ledger debit..."
                className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsAdjOpen(false)}
                className="px-4 py-2 text-xs font-medium text-[#A0ACA1] hover:text-[#F4F7F1]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || adjReason.length < 10}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500 text-white hover:bg-rose-600 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Posting...' : 'Post Debit Adjustment'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

