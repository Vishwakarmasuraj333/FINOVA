'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  X,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  FileSpreadsheet,
  Zap,
  Plus,
} from 'lucide-react';
import { formatPaise, formatDateTime } from '@/lib/utils/format';
import { Transaction, Account, PaymentProvider } from '@/types';
import { ProviderBadge } from '@/components/shared/ProviderBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useAuth } from '@/lib/auth/AuthContext';
import { MakePaymentModal, PAYMENT_APPS_CATALOG } from '@/components/shared/MakePaymentModal';
import { AddPaymentAppModal } from '@/components/shared/AddPaymentAppModal';

export default function TransactionsPage() {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [providers, setProviders] = useState<PaymentProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDirection, setSelectedDirection] = useState('all');
  const [page, setPage] = useState(0);
  const pageSize = 20;

  // Selected Transaction for Side Drawer
  const [activeTxn, setActiveTxn] = useState<Transaction | null>(null);

  // Modals
  const [makePaymentOpen, setMakePaymentOpen] = useState(false);
  const [addAppOpen, setAddAppOpen] = useState(false);
  const [selectedAppCode, setSelectedAppCode] = useState('phonepe');

  // Modal actions
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [reversalModalOpen, setReversalModalOpen] = useState(false);
  const [reversalReason, setReversalReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: pageSize.toString(),
        offset: (page * pageSize).toString(),
      });
      if (search) params.append('search', search);
      if (selectedProvider !== 'all') params.append('provider_id', selectedProvider);
      if (selectedAccount !== 'all') params.append('account_id', selectedAccount);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      if (selectedDirection !== 'all') params.append('direction', selectedDirection);

      const [res, accRes, provRes] = await Promise.all([
        fetch(`/api/transactions?${params.toString()}`),
        fetch('/api/accounts'),
        fetch('/api/providers'),
      ]);

      const [data, accData, provData] = await Promise.all([
        res.json(),
        accRes.json(),
        provRes.json(),
      ]);

      setTransactions(data.data || []);
      setTotalCount(data.total || 0);
      setAccounts(accData || []);
      setProviders(provData || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, search, selectedProvider, selectedAccount, selectedStatus, selectedDirection]);

  // Execute Refund
  const handleExecuteRefund = async () => {
    if (!activeTxn) return;
    setActionLoading(true);
    setActionError('');
    try {
      const paise = Math.round(parseFloat(refundAmount) * 100);
      const res = await fetch(`/api/transactions/${activeTxn.id}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': currentUser.role,
          'x-user-name': currentUser.name,
        },
        body: JSON.stringify({
          amount_paise: paise,
          reason: refundReason,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Refund failed');

      setRefundModalOpen(false);
      setRefundAmount('');
      setRefundReason('');
      setActiveTxn(null);
      fetchTransactions();
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Execute Reversal
  const handleExecuteReversal = async () => {
    if (!activeTxn) return;
    setActionLoading(true);
    setActionError('');
    try {
      const res = await fetch(`/api/transactions/${activeTxn.id}/reverse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': currentUser.role,
          'x-user-name': currentUser.name,
        },
        body: JSON.stringify({
          reason: reversalReason,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reversal failed');

      setReversalModalOpen(false);
      setReversalReason('');
      setActiveTxn(null);
      fetchTransactions();
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#303A31] dark:border-[#303A31] light:border-[#E1E8DF]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
              Unified Transaction Center
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/30">
              {totalCount} Total
            </span>
          </div>
          <p className="text-xs text-[#A0ACA1] mt-1">
            Searchable, auditable financial ledger across all authorized provider rails. Minor unit integer precision.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => {
              setSelectedAppCode('phonepe');
              setMakePaymentOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-primary text-black font-extrabold text-xs hover:bg-brand-accent transition-all shadow-md shadow-brand-primary/20"
          >
            <Zap size={14} />
            <span>Make Real Payment</span>
          </button>

          <button
            onClick={() => setAddAppOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1A211B] border border-[#303A31] text-[#F4F7F1] font-bold text-xs hover:border-brand-primary/50 transition-colors shadow-xs"
          >
            <Plus size={14} />
            <span>Connect App</span>
          </button>

          <a
            href="/api/export/csv?type=transactions"
            download
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1A211B] border border-[#303A31] text-[#A0ACA1] hover:text-[#F4F7F1] font-semibold text-xs hover:border-brand-primary/40 transition-colors shadow-xs"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Select Payment Application Filter Bar (Official Indian & Global Rails) */}
      <div className="p-3.5 rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF]">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#A0ACA1] flex items-center gap-1.5">
            <Filter size={13} className="text-brand-primary" />
            Filter By Payment Application / Rail:
          </span>
          {selectedProvider !== 'all' && (
            <button
              onClick={() => setSelectedProvider('all')}
              className="text-[11px] text-brand-primary font-bold hover:underline"
            >
              Clear Filter (Show All)
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setSelectedProvider('all')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold shrink-0 transition-all ${
              selectedProvider === 'all'
                ? 'bg-brand-primary text-black border-brand-primary shadow-xs'
                : 'bg-[#141A15] border-[#2B362C] text-[#A0ACA1] hover:text-[#F4F7F1]'
            }`}
          >
            All Rails ({providers.length})
          </button>

          {[
            { code: 'phonepe', name: 'PhonePe' },
            { code: 'paytm', name: 'Paytm' },
            { code: 'gpay', name: 'Google Pay' },
            { code: 'bharatpe', name: 'BharatPe' },
            { code: 'bhim', name: 'BHIM UPI' },
            { code: 'amazonpay', name: 'Amazon Pay' },
            { code: 'razorpay', name: 'Razorpay' },
            { code: 'cashfree', name: 'Cashfree' },
            { code: 'payzapp', name: 'PayZapp' },
            { code: 'freecharge', name: 'FreeCharge' },
            { code: 'mobikwik', name: 'MobiKwik' },
            { code: 'airtel', name: 'Airtel Money' },
            { code: 'bhim_sbi', name: 'BHIM SBI Pay' },
            { code: 'bob', name: 'Baroda Pay' },
            { code: 'rbl', name: 'RBL BHIM' },
            { code: 'canara', name: 'Canara PayWiz' },
            { code: 'fino', name: 'Fino Bank' },
            { code: 'whatsapppay', name: 'WhatsApp Pay' },
            { code: 'cred', name: 'CRED Pay' },
            { code: 'jiomoney', name: 'JioMoney' },
            { code: 'pockets', name: 'Pockets' },
            { code: 'kotak', name: 'Kotak Bank' },
            { code: 'pnb', name: 'PNB CMS' },
            { code: 'indusind', name: 'IndusInd Bank' },
            { code: 'yesbank', name: 'YES Bank' },
            { code: 'idfc', name: 'IDFC FIRST' },
            { code: 'federal', name: 'Federal Bank' },
            { code: 'axis', name: 'Axis Bank' },
            { code: 'sbi', name: 'SBI Corporate' },
            { code: 'hdfc_bank', name: 'HDFC CMS' },
            { code: 'stripe', name: 'Stripe' },
            { code: 'paypal', name: 'PayPal' },
            { code: 'rupay', name: 'RuPay' },
            { code: 'visa', name: 'Visa' },
            { code: 'mastercard', name: 'Mastercard' },
            { code: 'amex', name: 'Amex' },
          ].map(app => {
            const isSelected = selectedProvider === `prov_${app.code}`;
            return (
              <button
                key={app.code}
                onClick={() => {
                  if (isSelected) setSelectedProvider('all');
                  else setSelectedProvider(`prov_${app.code}`);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border shrink-0 transition-all text-xs font-semibold ${
                  isSelected
                    ? 'bg-brand-primary text-black border-brand-primary font-bold shadow-xs'
                    : 'bg-[#141A15] border-[#2B362C] text-[#F4F7F1] hover:border-brand-primary/50 hover:bg-[#1A231C]'
                }`}
              >
                <ProviderBadge code={app.code} iconOnly size="sm" />
                <span className="truncate">{app.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search bar */}
          <div className="relative w-full md:flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0ACA1]" />
            <input
              type="text"
              placeholder="Search by reference, counterparty, external provider ID, or error code..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#131814] border border-[#303A31] dark:bg-[#131814] dark:border-[#303A31] light:bg-[#F8FAF7] light:border-[#E1E8DF] text-xs text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219] placeholder-[#A0ACA1] focus:outline-none focus:border-brand-primary"
            />
          </div>

          {/* Quick Direction Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#131814] border border-[#303A31] text-xs font-semibold w-full md:w-auto">
            <button
              onClick={() => setSelectedDirection('all')}
              className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg transition-all ${
                selectedDirection === 'all' ? 'bg-brand-primary text-black' : 'text-[#A0ACA1] hover:text-[#F4F7F1]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedDirection('credit')}
              className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg transition-all ${
                selectedDirection === 'credit' ? 'bg-brand-primary text-black' : 'text-[#A0ACA1] hover:text-[#F4F7F1]'
              }`}
            >
              Credits (+)
            </button>
            <button
              onClick={() => setSelectedDirection('debit')}
              className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg transition-all ${
                selectedDirection === 'debit' ? 'bg-brand-primary text-black' : 'text-[#A0ACA1] hover:text-[#F4F7F1]'
              }`}
            >
              Debits (-)
            </button>
          </div>
        </div>

        {/* Secondary Filters row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-[#303A31]/60">
          <select
            value={selectedProvider}
            onChange={e => setSelectedProvider(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none"
          >
            <option value="all">All Providers</option>
            {providers.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select
            value={selectedAccount}
            onChange={e => setSelectedAccount(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none"
          >
            <option value="all">All Accounts</option>
            {accounts.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="REVERSED">Reversed</option>
            <option value="REFUNDED">Refunded</option>
          </select>

          {(search || selectedProvider !== 'all' || selectedAccount !== 'all' || selectedStatus !== 'all' || selectedDirection !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedProvider('all');
                setSelectedAccount('all');
                setSelectedStatus('all');
                setSelectedDirection('all');
              }}
              className="text-xs text-brand-primary hover:underline ml-auto font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <RefreshCw size={24} className="animate-spin text-brand-primary" />
            <span className="text-xs text-[#A0ACA1]">Querying ledger records...</span>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#A0ACA1]">
            No transactions found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#131814] border-b border-[#303A31] text-[10px] font-bold text-[#A0ACA1] uppercase">
                <tr>
                  <th className="py-3 px-4">Transaction Ref</th>
                  <th className="py-3 px-4">Provider</th>
                  <th className="py-3 px-4">Rail & Method</th>
                  <th className="py-3 px-4">Counterparty</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Fee / Tax</th>
                  <th className="py-3 px-4 text-right">Net Amount</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#303A31]/50">
                {transactions.map(txn => {
                  const isCredit = txn.type.includes('CREDIT');
                  return (
                    <tr
                      key={txn.id}
                      onClick={() => setActiveTxn(txn)}
                      className="cursor-pointer hover:bg-[#222B23] dark:hover:bg-[#222B23] light:hover:bg-[#F0F4EE] transition-colors group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                          {txn.internal_ref}
                        </div>
                        <div className="text-[10px] text-[#A0ACA1] font-mono truncate max-w-[170px]">
                          {txn.external_ref}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <ProviderBadge code={txn.provider_id.replace('prov_', '')} size="sm" />
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-xs font-medium text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                          {txn.payment_method}
                        </span>
                        <div className="text-[10px] text-[#A0ACA1]">
                          {txn.type.replace('_', ' ')}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                          {txn.sender_name || txn.recipient_name || 'Direct Deposit'}
                        </div>
                        <div className="text-[10px] text-[#A0ACA1] truncate max-w-[150px]">
                          {txn.sender_reference || txn.recipient_reference || '—'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-[11px] text-[#A0ACA1] whitespace-nowrap">
                        {formatDateTime(txn.initiated_at)}
                      </td>

                      <td className="py-3.5 px-4 text-right tabular-nums text-[11px] text-[#A0ACA1]">
                        {txn.fee_paise > 0 ? (
                          <>
                            <span>{formatPaise(txn.fee_paise)}</span>
                            <div className="text-[9px] text-[#A0ACA1]/70">GST: {formatPaise(txn.tax_paise)}</div>
                          </>
                        ) : (
                          '₹0.00'
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right font-extrabold tabular-nums">
                        <span className={isCredit ? 'text-emerald-400' : 'text-rose-400'}>
                          {isCredit ? '+' : '-'}{formatPaise(txn.amount_paise)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <StatusBadge status={txn.status} size="sm" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#303A31] bg-[#131814] text-xs text-[#A0ACA1]">
          <span>
            Showing {transactions.length > 0 ? page * pageSize + 1 : 0} to {Math.min((page + 1) * pageSize, totalCount)} of {totalCount} records
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-lg border border-[#303A31] hover:bg-[#1A211B] disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-semibold text-brand-primary">Page {page + 1}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={(page + 1) * pageSize >= totalCount}
              className="p-1.5 rounded-lg border border-[#303A31] hover:bg-[#1A211B] disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Details Side Drawer */}
      {activeTxn && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#171B17] border-l border-[#303A31] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-up">
            <div className="space-y-6">
              {/* Drawer Top */}
              <div className="flex items-start justify-between pb-4 border-b border-[#303A31]">
                <div>
                  <div className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">
                    TRANSACTION LEDGER DETAILS
                  </div>
                  <h2 className="text-xl font-black text-[#F4F7F1] mt-0.5 font-mono">
                    {activeTxn.internal_ref}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTxn(null)}
                  className="p-1.5 rounded-lg text-[#A0ACA1] hover:text-[#F4F7F1] hover:bg-[#1A211B]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Status and Big Amount */}
              <div className="p-4 rounded-xl bg-[#131814] border border-[#303A31] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#A0ACA1] uppercase font-semibold">Amount (Paise Precision)</span>
                  <div className="text-2xl font-black text-[#F4F7F1] tabular-nums mt-0.5">
                    {formatPaise(activeTxn.amount_paise)}
                  </div>
                </div>
                <StatusBadge status={activeTxn.status} size="md" />
              </div>

              {/* Details Key-Value List */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-[#303A31]/50">
                  <span className="text-[#A0ACA1]">External Provider ID</span>
                  <span className="font-mono text-[#F4F7F1]">{activeTxn.external_ref}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#303A31]/50">
                  <span className="text-[#A0ACA1]">Provider / Rail</span>
                  <ProviderBadge code={activeTxn.provider_id.replace('prov_', '')} size="sm" />
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#303A31]/50">
                  <span className="text-[#A0ACA1]">Payment Method</span>
                  <span className="font-semibold text-[#F4F7F1]">{activeTxn.payment_method}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#303A31]/50">
                  <span className="text-[#A0ACA1]">Initiated Timestamp</span>
                  <span className="text-[#F4F7F1]">{formatDateTime(activeTxn.initiated_at)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#303A31]/50">
                  <span className="text-[#A0ACA1]">MDR Gateway Fee</span>
                  <span className="tabular-nums text-[#F4F7F1]">{formatPaise(activeTxn.fee_paise)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#303A31]/50">
                  <span className="text-[#A0ACA1]">GST Tax (18%)</span>
                  <span className="tabular-nums text-[#F4F7F1]">{formatPaise(activeTxn.tax_paise)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#303A31]/50">
                  <span className="text-[#A0ACA1]">Reconciliation Status</span>
                  <StatusBadge status={activeTxn.reconciliation_status} size="sm" />
                </div>
                {activeTxn.safe_error_message && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                    <span className="font-bold">Error Description: </span>
                    {activeTxn.safe_error_message}
                  </div>
                )}
              </div>

              {/* Immutable Accounting Policy Notice */}
              <div className="p-3 rounded-xl bg-[#101310] border border-[#303A31] text-[11px] text-[#A0ACA1]">
                <div className="font-bold text-[#F4F7F1] mb-1 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-brand-primary" />
                  Financial Immutability Rule
                </div>
                Completed transactions cannot be edited directly. To adjust this record, initiate an authorized refund or compensating reversal with mandatory audit justification.
              </div>
            </div>

            {/* Actions: Refund or Reverse */}
            <div className="pt-4 border-t border-[#303A31] flex items-center gap-3">
              {activeTxn.status === 'COMPLETED' && (
                <>
                  <button
                    onClick={() => {
                      setRefundAmount((activeTxn.amount_paise / 100).toString());
                      setRefundModalOpen(true);
                    }}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-[#222B23] border border-[#303A31] text-brand-primary hover:bg-[#2c372d] transition-colors"
                  >
                    Initiate Refund
                  </button>

                  <button
                    onClick={() => setReversalModalOpen(true)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition-colors"
                  >
                    Reverse Transaction
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {refundModalOpen && activeTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#1A211B] border border-[#303A31] space-y-4 animate-slide-up">
            <h3 className="text-base font-bold text-[#F4F7F1]">
              Initiate Controlled Refund
            </h3>
            <p className="text-xs text-[#A0ACA1]">
              Refunding {activeTxn.internal_ref}. This creates a linked refund record and compensating ledger debit.
            </p>

            {actionError && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {actionError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">
                Refund Amount (INR)
              </label>
              <input
                type="number"
                step="0.01"
                value={refundAmount}
                onChange={e => setRefundAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">
                Mandatory Reason / Justification
              </label>
              <textarea
                rows={3}
                value={refundReason}
                onChange={e => setRefundReason(e.target.value)}
                placeholder="Explain the authorized justification for this customer refund..."
                className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setRefundModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-[#A0ACA1] hover:text-[#F4F7F1]"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteRefund}
                disabled={actionLoading || !refundReason}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-primary text-black hover:bg-brand-accent disabled:opacity-50"
              >
                {actionLoading ? 'Processing...' : 'Confirm Refund'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reversal Modal */}
      {reversalModalOpen && activeTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#1A211B] border border-[#303A31] space-y-4 animate-slide-up">
            <h3 className="text-base font-bold text-[#F4F7F1]">
              Execute Compensating Reversal
            </h3>
            <p className="text-xs text-[#A0ACA1]">
              Reversing {activeTxn.internal_ref}. A compensating double-entry journal entry will be posted with an immutable audit event.
            </p>

            {actionError && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {actionError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">
                Audit Reason for Reversal
              </label>
              <textarea
                rows={3}
                value={reversalReason}
                onChange={e => setReversalReason(e.target.value)}
                placeholder="Provide compliance justification for transaction reversal..."
                className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setReversalModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-[#A0ACA1] hover:text-[#F4F7F1]"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteReversal}
                disabled={actionLoading || !reversalReason}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500 text-white hover:bg-rose-600 disabled:opacity-50"
              >
                {actionLoading ? 'Reversing...' : 'Confirm Reversal'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real Payment Execution Modal */}
      <MakePaymentModal
        isOpen={makePaymentOpen}
        onClose={() => setMakePaymentOpen(false)}
        onSuccess={() => {
          fetchTransactions();
        }}
        accounts={accounts}
        initialProviderCode={selectedAppCode}
      />

      {/* Connect New Payment Application Modal */}
      <AddPaymentAppModal
        isOpen={addAppOpen}
        onClose={() => setAddAppOpen(false)}
        onSuccess={() => {
          fetchTransactions();
        }}
      />
    </div>
  );
}

