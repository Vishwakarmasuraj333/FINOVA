'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Landmark,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Scale,
  ShieldCheck,
  ChevronRight,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import { formatPaise, formatDateTime, maskAccountNumber } from '@/lib/utils/format';
import { Account, PaymentProvider } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ProviderBadge } from '@/components/shared/ProviderBadge';
import { useAuth } from '@/lib/auth/AuthContext';

export default function AccountsPage() {
  const { currentUser } = useAuth();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [providers, setProviders] = useState<PaymentProvider[]>([]);
  const [loading, setLoading] = useState(true);

  // Create Account Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [accName, setAccName] = useState('');
  const [accNumber, setAccNumber] = useState('');
  const [accIfsc, setAccIfsc] = useState('');
  const [accType, setAccType] = useState('BANK_ACCOUNT');
  const [accProviderId, setAccProviderId] = useState('');
  const [accOpeningRupees, setAccOpeningRupees] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const [accRes, provRes] = await Promise.all([
        fetch('/api/accounts'),
        fetch('/api/providers'),
      ]);
      const [accData, provData] = await Promise.all([
        accRes.json(),
        provRes.json(),
      ]);
      setAccounts(accData);
      setProviders(provData);
      if (provData.length > 0) setAccProviderId(provData[0].id);
    } catch (err) {
      console.error('Error fetching accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const openingPaise = Math.round(parseFloat(accOpeningRupees || '0') * 100);
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': currentUser.role,
          'x-user-name': currentUser.name,
        },
        body: JSON.stringify({
          name: accName,
          account_number_masked: maskAccountNumber(accNumber),
          ifsc_or_routing: accIfsc,
          type: accType,
          provider_id: accProviderId,
          currency: 'INR',
          opening_balance_paise: openingPaise,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create account');
      }

      setIsAddOpen(false);
      setAccName('');
      setAccNumber('');
      setAccIfsc('');
      setAccOpeningRupees('');
      fetchAccounts();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const totalLedger = accounts.reduce((s, a) => s + (a.closing_ledger_balance_paise || 0), 0);
  const totalAvailable = accounts.reduce((s, a) => s + (a.available_balance_paise || 0), 0);
  const totalOpening = accounts.reduce((s, a) => s + (a.opening_balance_paise || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#303A31] dark:border-[#303A31] light:border-[#E1E8DF]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
              Bank & Settlement Accounts
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/30">
              {accounts.length} Active Accounts
            </span>
          </div>
          <p className="text-xs text-[#A0ACA1] mt-1">
            Authoritative double-entry ledger balances vs provider reported statements. Masked credential integrity.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-primary text-black font-bold text-xs hover:bg-brand-accent transition-colors self-start sm:self-auto shadow-xs"
        >
          <Plus size={15} />
          <span>Add Account</span>
        </button>
      </div>

      {/* Aggregate Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF]">
          <span className="text-[11px] font-bold text-[#A0ACA1] uppercase tracking-wider">
            Total Closing Ledger Balance
          </span>
          <div className="text-2xl font-black text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219] tabular-nums mt-1">
            {formatPaise(totalLedger)}
          </div>
          <p className="text-[10px] text-[#A0ACA1] mt-1">
            Opening + Posted Credits - Posted Debits
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF]">
          <span className="text-[11px] font-bold text-[#A0ACA1] uppercase tracking-wider">
            Total Available Liquidity
          </span>
          <div className="text-2xl font-black text-brand-primary dark:text-brand-primary light:text-brand-primary-light tabular-nums mt-1">
            {formatPaise(totalAvailable)}
          </div>
          <p className="text-[10px] text-[#A0ACA1] mt-1">
            Unencumbered after pending authorizations
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF]">
          <span className="text-[11px] font-bold text-[#A0ACA1] uppercase tracking-wider">
            Total Equity Opening Balances
          </span>
          <div className="text-2xl font-black text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219] tabular-nums mt-1">
            {formatPaise(totalOpening)}
          </div>
          <p className="text-[10px] text-[#A0ACA1] mt-1">
            Verified initial equity journals
          </p>
        </div>
      </div>

      {/* Account Details Table */}
      <div className="rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <RefreshCw size={24} className="animate-spin text-brand-primary" />
            <span className="text-xs text-[#A0ACA1]">Computing account balances...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#131814] border-b border-[#303A31] text-[10px] font-bold text-[#A0ACA1] uppercase">
                <tr>
                  <th className="py-3 px-4">Account Name</th>
                  <th className="py-3 px-4">Provider / Rail</th>
                  <th className="py-3 px-4 text-right">Opening</th>
                  <th className="py-3 px-4 text-right">Credits (+)</th>
                  <th className="py-3 px-4 text-right">Debits (-)</th>
                  <th className="py-3 px-4 text-right">Closing Ledger</th>
                  <th className="py-3 px-4 text-right">Provider Statement</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#303A31]/50">
                {accounts.map(acc => {
                  const prov = providers.find(p => p.id === acc.provider_id);
                  const provBal = acc.provider_reported_balance_paise;
                  const variance = provBal !== null && provBal !== undefined ? Math.abs(provBal - acc.closing_ledger_balance_paise) : null;

                  return (
                    <tr
                      key={acc.id}
                      className="hover:bg-[#222B23] dark:hover:bg-[#222B23] light:hover:bg-[#F0F4EE] transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                          {acc.name}
                        </div>
                        <div className="text-[10px] text-[#A0ACA1] font-mono">
                          {acc.account_number_masked} {acc.ifsc_or_routing ? `• ${acc.ifsc_or_routing}` : ''}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <ProviderBadge code={prov ? prov.code : 'bank'} name={prov ? prov.name : 'Direct Bank'} size="sm" />
                      </td>

                      <td className="py-3.5 px-4 text-right tabular-nums text-[#A0ACA1]">
                        {formatPaise(acc.opening_balance_paise)}
                      </td>

                      <td className="py-3.5 px-4 text-right tabular-nums font-bold text-emerald-400">
                        +{formatPaise(acc.posted_credits_paise)}
                      </td>

                      <td className="py-3.5 px-4 text-right tabular-nums font-bold text-rose-400">
                        -{formatPaise(acc.posted_debits_paise)}
                      </td>

                      <td className="py-3.5 px-4 text-right tabular-nums font-extrabold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                        {formatPaise(acc.closing_ledger_balance_paise)}
                      </td>

                      <td className="py-3.5 px-4 text-right tabular-nums font-mono">
                        {provBal !== null && provBal !== undefined ? (
                          <div>
                            <span className="text-[#F4F7F1]">{formatPaise(provBal)}</span>
                            {variance && variance > 0 ? (
                              <div className="text-[9px] text-amber-400 font-semibold">
                                Diff: {formatPaise(variance)}
                              </div>
                            ) : null}
                          </div>
                        ) : (
                          <span className="text-[10px] text-[#A0ACA1] italic">Unavailable</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <StatusBadge status={acc.status} size="sm" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Account Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <form
            onSubmit={handleCreateAccount}
            className="w-full max-w-lg p-6 rounded-2xl bg-[#1A211B] border border-[#303A31] space-y-4 animate-slide-up"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#303A31]">
              <h3 className="text-base font-bold text-[#F4F7F1]">
                Add Treasury / Bank Account
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
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">
                Account Label / Name
              </label>
              <input
                type="text"
                required
                value={accName}
                onChange={e => setAccName(e.target.value)}
                placeholder="e.g. ICICI Escrow Inward Clearing Pool"
                className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">
                  Account Number (Masked automatically)
                </label>
                <input
                  type="text"
                  required
                  value={accNumber}
                  onChange={e => setAccNumber(e.target.value)}
                  placeholder="50200098192019"
                  className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">
                  IFSC / Routing Code
                </label>
                <input
                  type="text"
                  value={accIfsc}
                  onChange={e => setAccIfsc(e.target.value.toUpperCase())}
                  placeholder="HDFC0000060"
                  className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">Account Type</label>
                <select
                  value={accType}
                  onChange={e => setAccType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none"
                >
                  <option value="BANK_ACCOUNT">Bank Current Account</option>
                  <option value="GATEWAY_CLEARING">Gateway Clearing Escrow</option>
                  <option value="WALLET_CLEARING">Wallet / Payout Pool</option>
                  <option value="UPI_CLEARING">UPI Clearing Pool</option>
                  <option value="EXPENSE_RESERVE">Expense / Tax Reserve</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">Associated Rail</label>
                <select
                  value={accProviderId}
                  onChange={e => setAccProviderId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none"
                >
                  {providers.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">
                Opening Balance (INR)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={accOpeningRupees}
                onChange={e => setAccOpeningRupees(e.target.value)}
                placeholder="e.g. 1000000.00"
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
                {submitting ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

