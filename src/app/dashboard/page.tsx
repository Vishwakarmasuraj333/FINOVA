'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Landmark,
  Scale,
  RefreshCw,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  BadgePercent,
  Receipt,
  AlertTriangle,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { formatPaise, formatDateTime } from '@/lib/utils/format';
import { ConsolidatedFinancialSummary, Transaction, Account, PaymentProvider } from '@/types';
import { ProviderBadge } from '@/components/shared/ProviderBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';

export default function DashboardPage() {
  const [summary, setSummary] = useState<ConsolidatedFinancialSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [providers, setProviders] = useState<PaymentProvider[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [period, setPeriod] = useState('30d');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [selectedAccount, setSelectedAccount] = useState('all');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sumRes, txnRes, accRes, provRes] = await Promise.all([
        fetch('/api/financial-summary?currency=INR'),
        fetch('/api/transactions?limit=8'),
        fetch('/api/accounts'),
        fetch('/api/providers'),
      ]);

      const [sumData, txnData, accData, provData] = await Promise.all([
        sumRes.json(),
        txnRes.json(),
        accRes.json(),
        provRes.json(),
      ]);

      setSummary(sumData);
      setTransactions(txnData.data || []);
      setAccounts(accData || []);
      setProviders(provData || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading && !summary) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <RefreshCw size={28} className="animate-spin text-brand-primary" />
        <p className="text-xs font-semibold text-[#A0ACA1]">Computing double-entry financial metrics...</p>
      </div>
    );
  }

  // Filtered transactions for recent activity
  const filteredTxns = transactions.filter(t => {
    if (selectedProvider !== 'all' && t.provider_id !== selectedProvider) return false;
    if (selectedAccount !== 'all' && t.account_id !== selectedAccount) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Bar: Title, Filters & Export */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-2 border-b border-[#303A31] dark:border-[#303A31] light:border-[#E1E8DF]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black tracking-tight text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
              Financial Operations Workspace
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/30">
              LIVE CONSOLE
            </span>
          </div>
          <p className="text-xs text-[#A0ACA1] mt-1">
            Consolidated overview across all connected payment rails, clearing escrows, and bank statement ledgers.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Period selector */}
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] text-xs font-medium text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219] focus:outline-none focus:border-brand-primary"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="this_month">This Month</option>
            <option value="prev_month">Previous Month</option>
            <option value="custom">Custom Range</option>
          </select>

          {/* Provider Filter */}
          <select
            value={selectedProvider}
            onChange={e => setSelectedProvider(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] text-xs font-medium text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219] focus:outline-none focus:border-brand-primary"
          >
            <option value="all">All Providers</option>
            {providers.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Account Filter */}
          <select
            value={selectedAccount}
            onChange={e => setSelectedAccount(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] text-xs font-medium text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219] focus:outline-none focus:border-brand-primary"
          >
            <option value="all">All Accounts</option>
            {accounts.map(a => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>

          {/* Export Report Action */}
          <a
            href="/api/export/csv?type=summary"
            download
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-primary text-black font-bold text-xs hover:bg-brand-accent transition-colors shadow-xs"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Primary KPI Grid (Directly Calculated From Immutable DB Records) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Ledger Balance */}
        <div className="p-4 rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] shadow-xs">
          <div className="flex items-center justify-between text-[#A0ACA1] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Ledger Balance</span>
            <div className="p-1.5 rounded-lg bg-brand-primary/10 text-brand-primary">
              <Landmark size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219] tabular-nums">
            {formatPaise(summary?.total_closing_ledger_balance_paise)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[#A0ACA1]">
            <span>Opening: {formatPaise(summary?.total_opening_balance_paise, 'INR', { compact: true })}</span>
            <span>•</span>
            <span className="text-brand-primary">Balanced</span>
          </div>
        </div>

        {/* Total Incoming Credits */}
        <div className="p-4 rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] shadow-xs">
          <div className="flex items-center justify-between text-[#A0ACA1] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Posted Inflows / Credits</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ArrowDownLeft size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 tabular-nums">
            {formatPaise(summary?.total_posted_credits_paise, 'INR', { showSign: true })}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[#A0ACA1]">
            <span>Pending Inflow: {formatPaise(summary?.total_pending_credits_paise, 'INR', { compact: true })}</span>
          </div>
        </div>

        {/* Total Outgoing Debits */}
        <div className="p-4 rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] shadow-xs">
          <div className="flex items-center justify-between text-[#A0ACA1] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Posted Outflows / Debits</span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <ArrowUpRight size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-400 tabular-nums">
            {formatPaise(summary?.total_posted_debits_paise, 'INR', { showSign: true })}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[#A0ACA1]">
            <span>Pending Payouts: {formatPaise(summary?.total_pending_debits_paise, 'INR', { compact: true })}</span>
          </div>
        </div>

        {/* Available Balance */}
        <div className="p-4 rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] shadow-xs">
          <div className="flex items-center justify-between text-[#A0ACA1] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Net Available Liquidity</span>
            <div className="p-1.5 rounded-lg bg-brand-primary/10 text-brand-primary">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219] tabular-nums">
            {formatPaise(summary?.total_available_balance_paise)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[#A0ACA1]">
            <span>After pending authorizations</span>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Row: Fees, Refunds, Settlements, Discrepancies */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-[#131814] border border-[#303A31] dark:bg-[#131814] dark:border-[#303A31] light:bg-[#F8FAF7] light:border-[#E1E8DF]">
          <div className="flex items-center justify-between text-[11px] text-[#A0ACA1]">
            <span>Total Fees & GST</span>
            <BadgePercent size={14} className="text-brand-primary" />
          </div>
          <div className="text-base font-bold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219] tabular-nums mt-1">
            {formatPaise((summary?.total_processing_charges_paise || 0) + (summary?.total_taxes_paise || 0))}
          </div>
          <span className="text-[10px] text-[#A0ACA1]">Taxes: {formatPaise(summary?.total_taxes_paise)}</span>
        </div>

        <div className="p-3 rounded-xl bg-[#131814] border border-[#303A31] dark:bg-[#131814] dark:border-[#303A31] light:bg-[#F8FAF7] light:border-[#E1E8DF]">
          <div className="flex items-center justify-between text-[11px] text-[#A0ACA1]">
            <span>Refunds Disbursed</span>
            <RotateCcw size={14} className="text-blue-400" />
          </div>
          <div className="text-base font-bold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219] tabular-nums mt-1">
            {formatPaise(summary?.total_refunds_paise)}
          </div>
          <span className="text-[10px] text-[#A0ACA1]">100% auditable linkage</span>
        </div>

        <div className="p-3 rounded-xl bg-[#131814] border border-[#303A31] dark:bg-[#131814] dark:border-[#303A31] light:bg-[#F8FAF7] light:border-[#E1E8DF]">
          <div className="flex items-center justify-between text-[11px] text-[#A0ACA1]">
            <span>Settled Payouts</span>
            <Receipt size={14} className="text-emerald-400" />
          </div>
          <div className="text-base font-bold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219] tabular-nums mt-1">
            {formatPaise(summary?.total_completed_settlements_paise)}
          </div>
          <span className="text-[10px] text-[#A0ACA1]">In Transit: {formatPaise(summary?.total_outstanding_settlements_paise)}</span>
        </div>

        <div className="p-3 rounded-xl bg-[#131814] border border-[#303A31] dark:bg-[#131814] dark:border-[#303A31] light:bg-[#F8FAF7] light:border-[#E1E8DF]">
          <div className="flex items-center justify-between text-[11px] text-[#A0ACA1]">
            <span>Reconciliation Variance</span>
            <Scale size={14} className="text-purple-400" />
          </div>
          <div className="text-base font-bold text-purple-400 tabular-nums mt-1">
            {formatPaise(summary?.provider_vs_ledger_difference_paise)}
          </div>
          <span className="text-[10px] text-[#A0ACA1]">{summary?.unreconciled_transactions_count} Unreconciled Txns</span>
        </div>
      </div>

      {/* Visualizations & Account Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Account Balances Breakdown */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                Account & Escrow Liquidity Distribution
              </h2>
              <p className="text-[11px] text-[#A0ACA1]">
                Authoritative double-entry closing balances by institution.
              </p>
            </div>
            <Link
              href="/accounts"
              className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1"
            >
              <span>Manage Accounts</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-3">
            {summary?.account_breakdown.map(acc => {
              const maxVal = summary.total_closing_ledger_balance_paise || 1;
              const pct = Math.max(5, Math.min(100, Math.round((acc.closing_ledger_balance_paise / maxVal) * 100)));

              return (
                <div
                  key={acc.account_id}
                  className="p-3 rounded-xl bg-[#131814] border border-[#303A31] dark:bg-[#131814] dark:border-[#303A31] light:bg-[#F8FAF7] light:border-[#E1E8DF]"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <span className="font-semibold text-xs text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                        {acc.account_name}
                      </span>
                      <span className="ml-2 text-[10px] text-[#A0ACA1] font-mono">
                        {acc.account_number_masked}
                      </span>
                    </div>
                    <span className="font-bold text-xs tabular-nums text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                      {formatPaise(acc.closing_ledger_balance_paise)}
                    </span>
                  </div>

                  {/* Visual fill meter */}
                  <div className="w-full h-1.5 rounded-full bg-[#1A211B] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#A0ACA1] mt-1.5">
                    <span>Provider: {acc.provider_name}</span>
                    <span className="flex items-center gap-1">
                      Status: <StatusBadge status={acc.reconciliation_status} size="sm" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transaction Volume & Status Summary */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                Transaction Health & Status
              </h2>
              <span className="text-[10px] font-mono text-brand-primary">100% TRACEABLE</span>
            </div>
            <p className="text-[11px] text-[#A0ACA1] mb-4">
              Real-time audit breakdown of executed, pending, and flagged operations.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-[#131814] border border-[#303A31]">
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                  <CheckCircle2 size={14} />
                  <span>Successful Txns</span>
                </div>
                <div className="text-xl font-black text-[#F4F7F1] mt-1 tabular-nums">
                  {transactions.filter(t => t.status === 'COMPLETED').length}
                </div>
                <span className="text-[10px] text-[#A0ACA1]">Posted to ledger</span>
              </div>

              <div className="p-3 rounded-xl bg-[#131814] border border-[#303A31]">
                <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-semibold">
                  <Clock size={14} />
                  <span>Pending Txns</span>
                </div>
                <div className="text-xl font-black text-[#F4F7F1] mt-1 tabular-nums">
                  {transactions.filter(t => t.status === 'PENDING').length}
                </div>
                <span className="text-[10px] text-[#A0ACA1]">Awaiting rail confirm</span>
              </div>

              <div className="p-3 rounded-xl bg-[#131814] border border-[#303A31]">
                <div className="flex items-center gap-1.5 text-[11px] text-rose-400 font-semibold">
                  <XCircle size={14} />
                  <span>Failed Txns</span>
                </div>
                <div className="text-xl font-black text-[#F4F7F1] mt-1 tabular-nums">
                  {summary?.total_failed_transactions_count || 0}
                </div>
                <span className="text-[10px] text-[#A0ACA1]">Zero balance deducted</span>
              </div>

              <div className="p-3 rounded-xl bg-[#131814] border border-[#303A31]">
                <div className="flex items-center gap-1.5 text-[11px] text-blue-400 font-semibold">
                  <RotateCcw size={14} />
                  <span>Reversals</span>
                </div>
                <div className="text-xl font-black text-[#F4F7F1] mt-1 tabular-nums">
                  {summary?.total_reversed_transactions_count || 0}
                </div>
                <span className="text-[10px] text-[#A0ACA1]">Audited adjustments</span>
              </div>
            </div>
          </div>

          {/* Quick link banner to Master Financial Summary */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 border border-brand-primary/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles size={18} className="text-brand-primary shrink-0" />
              <div>
                <div className="text-xs font-bold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                  Consolidated Financial Control Center
                </div>
                <div className="text-[10px] text-[#A0ACA1]">
                  Executive multi-column balance sheet & audit trail
                </div>
              </div>
            </div>
            <Link
              href="/admin/financial-summary"
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-primary text-black hover:bg-brand-accent transition-colors"
            >
              Open
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="p-5 rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
              Recent Financial Transactions
            </h2>
            <p className="text-[11px] text-[#A0ACA1]">
              Live authorized movements from connected provider rails.
            </p>
          </div>
          <Link
            href="/transactions"
            className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1"
          >
            <span>View All Transactions</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {filteredTxns.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#A0ACA1]">
            No transactions found matching current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#303A31] text-[10px] font-bold text-[#A0ACA1] uppercase">
                  <th className="py-2.5 px-3">Reference</th>
                  <th className="py-2.5 px-3">Provider</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Counterparty</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#303A31]/50">
                {filteredTxns.map(t => {
                  const isCredit = t.type.includes('CREDIT');
                  return (
                    <tr
                      key={t.id}
                      className="hover:bg-[#222B23] dark:hover:bg-[#222B23] light:hover:bg-[#F0F4EE] transition-colors"
                    >
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                          {t.internal_ref}
                        </span>
                        <div className="text-[10px] text-[#A0ACA1] font-mono truncate max-w-[150px]">
                          {t.external_ref}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <ProviderBadge code={t.provider_id.replace('prov_', '')} size="sm" />
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[11px] font-medium text-[#A0ACA1]">
                          {t.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                        {t.sender_name || t.recipient_name || 'Internal Clearing'}
                      </td>
                      <td className="py-3 px-3 text-[11px] text-[#A0ACA1] whitespace-nowrap">
                        {formatDateTime(t.initiated_at)}
                      </td>
                      <td className="py-3 px-3 text-right font-bold tabular-nums">
                        <span className={isCredit ? 'text-emerald-400' : 'text-rose-400'}>
                          {isCredit ? '+' : '-'}{formatPaise(t.amount_paise)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
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
    </div>
  );
}

