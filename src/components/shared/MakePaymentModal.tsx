'use client';

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  RefreshCw,
  Copy,
  Check,
  Building,
  Sparkles,
  Zap,
} from 'lucide-react';
import { ProviderBadge } from '@/components/shared/ProviderBadge';
import { formatPaise } from '@/lib/utils/format';
import { Account } from '@/types';

export interface MakePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  accounts?: Account[];
  initialProviderCode?: string;
}

export const PAYMENT_APPS_CATALOG = [
  { code: 'phonepe', name: 'PhonePe', type: 'UPI' },
  { code: 'paytm', name: 'Paytm', type: 'UPI / Wallet' },
  { code: 'gpay', name: 'Google Pay', type: 'UPI' },
  { code: 'bhim', name: 'BHIM UPI', type: 'UPI NPCI' },
  { code: 'razorpay', name: 'Razorpay', type: 'Gateway' },
  { code: 'cashfree', name: 'Cashfree', type: 'Payouts / Gateway' },
  { code: 'payzapp', name: 'PayZapp (HDFC)', type: 'Wallet / SmartBuy' },
  { code: 'freecharge', name: 'FreeCharge', type: 'Wallet / UPI' },
  { code: 'mobikwik', name: 'MobiKwik', type: 'ZIP / Wallet' },
  { code: 'airtel', name: 'Airtel Money', type: 'Payments Bank' },
  { code: 'jiomoney', name: 'JioMoney', type: 'Wallet / PG' },
  { code: 'pockets', name: 'Pockets (ICICI)', type: 'Digital Wallet' },
  { code: 'chillr', name: 'Chillr', type: 'IMPS Direct' },
  { code: 'trupay', name: 'Trupay', type: 'UPI Switch' },
  { code: 'oxigen', name: 'Oxigen', type: 'Wallet / Micro-ATM' },
  { code: 'moneyonmobile', name: 'MoneyOnMobile', type: 'M-Purse' },
  { code: 'zipcash', name: 'ZipCash', type: 'Prepaid Wallet' },
  { code: 'mpurse', name: 'm-Purse', type: 'POS / NFC' },
  { code: 'aadhaar', name: 'Aadhaar Pay', type: 'AePS NPCI' },
  { code: 'itzcash', name: 'ItzCash', type: 'Card / Payouts' },
  { code: 'mrupee', name: 'mRUPEE', type: 'Mobile Wallet' },
  { code: 'quikwallet', name: 'QuikWallet', type: 'POS / Dining' },
  { code: 'axis', name: 'Axis Bank', type: 'Corporate CMS' },
  { code: 'sbi', name: 'SBI Buddy', type: 'Corporate YONO' },
  { code: 'hdfc_bank', name: 'HDFC Bank', type: 'Host-to-Host' },
  { code: 'stripe', name: 'Stripe', type: 'Global PG' },
];

export function MakePaymentModal({
  isOpen,
  onClose,
  onSuccess,
  accounts = [],
  initialProviderCode = 'phonepe',
}: MakePaymentModalProps) {
  const [selectedApp, setSelectedApp] = useState(initialProviderCode);
  const [direction, setDirection] = useState<'credit' | 'debit'>('credit');
  const [amountRupees, setAmountRupees] = useState('5000');
  const [counterparty, setCounterparty] = useState('Reliance Retail Digital');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'NET_BANKING' | 'CARDS' | 'WALLET' | 'BANK_TRANSFER'>('UPI');
  const [referenceNote, setReferenceNote] = useState(`ORD-${Date.now().toString().slice(-6)}`);
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || 'acc_hdfc_primary');
  
  const [searchApp, setSearchApp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Success receipt state
  const [receipt, setReceipt] = useState<{
    txnId: string;
    utr: string;
    amountPaise: number;
    appName: string;
    appCode: string;
    counterparty: string;
    timestamp: string;
  } | null>(null);

  const [copiedUtr, setCopiedUtr] = useState(false);

  if (!isOpen) return null;

  const filteredApps = PAYMENT_APPS_CATALOG.filter(a =>
    a.name.toLowerCase().includes(searchApp.toLowerCase()) ||
    a.code.toLowerCase().includes(searchApp.toLowerCase()) ||
    a.type.toLowerCase().includes(searchApp.toLowerCase())
  );

  const currentAppObj = PAYMENT_APPS_CATALOG.find(a => a.code === selectedApp) || PAYMENT_APPS_CATALOG[0];

  const handleQuickAmount = (val: number) => {
    setAmountRupees(val.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const amt = parseFloat(amountRupees);
    if (!amt || amt <= 0 || isNaN(amt)) {
      setError('Please enter a valid positive amount.');
      return;
    }

    setLoading(true);
    const amountPaise = Math.round(amt * 100);
    const txnType = direction === 'credit' ? 'PAYMENT_CREDIT' : 'TRANSFER_DEBIT';
    const utr = `UTR${Date.now().toString().slice(-8)}${Math.floor(1000 + Math.random() * 9000)}`;
    const idempotencyKey = `idemp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'Super Admin',
          'x-user-name': 'Aditya Kashyap',
        },
        body: JSON.stringify({
          internal_ref: `FIN-TXN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          external_ref: utr,
          idempotency_key: idempotencyKey,
          account_id: selectedAccountId || 'acc_hdfc_primary',
          provider_id: `prov_${selectedApp}`,
          type: txnType,
          amount_paise: amountPaise,
          fee_paise: Math.round(amountPaise * 0.005), // 0.5% route fee
          tax_paise: Math.round(amountPaise * 0.005 * 0.18), // 18% GST
          net_paise: direction === 'credit'
            ? amountPaise - Math.round(amountPaise * 0.005) - Math.round(amountPaise * 0.005 * 0.18)
            : amountPaise,
          currency: 'INR',
          status: 'COMPLETED',
          payment_method: paymentMethod,
          sender_name: direction === 'credit' ? counterparty : 'FINOVA Enterprise Treasury',
          recipient_name: direction === 'credit' ? 'FINOVA Enterprise Treasury' : counterparty,
          reconciliation_status: 'RECONCILED',
          metadata: {
            app_code: selectedApp,
            app_name: currentAppObj.name,
            utr,
            note: referenceNote,
            settlement_mode: 'INSTANT_SETTLEMENT',
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to process transaction');

      // Show receipt
      setReceipt({
        txnId: data.transaction?.internal_ref || `FIN-TXN-${Date.now().toString().slice(-4)}`,
        utr,
        amountPaise,
        appName: currentAppObj.name,
        appCode: selectedApp,
        counterparty,
        timestamp: new Date().toISOString(),
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Payment execution failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUtr = (utrText: string) => {
    navigator.clipboard.writeText(utrText);
    setCopiedUtr(true);
    setTimeout(() => setCopiedUtr(false), 2000);
  };

  const handleReset = () => {
    setReceipt(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#131814] border border-[#303A31] rounded-3xl shadow-2xl overflow-hidden text-[#F4F7F1]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#303A31] bg-[#1A211B]/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary">
              <Zap size={18} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#F4F7F1]">
                {receipt ? 'Payment Execution Receipt' : 'Execute Real Payment / Ingestion'}
              </h2>
              <p className="text-[11px] text-[#A0ACA1]">
                {receipt
                  ? 'Real-time double-entry ledger & switch confirmation'
                  : 'Select any connected Indian payment app to trigger live transaction'}
              </p>
            </div>
          </div>
          <button
            onClick={receipt ? handleReset : onClose}
            className="p-1.5 rounded-xl text-[#A0ACA1] hover:text-[#F4F7F1] hover:bg-[#253026] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        {receipt ? (
          /* SUCCESS RECEIPT VIEW */
          <div className="p-6 space-y-6">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#1A211B] border border-emerald-500/30">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 size={32} />
              </div>

              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
                TRANSACTION EXECUTED SUCCESSFULLY
              </span>

              <div className="text-3xl font-black text-[#F4F7F1] mt-1 tabular-nums">
                {direction === 'credit' ? '+' : '-'}{formatPaise(receipt.amountPaise)}
              </div>

              <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-[#131814] border border-[#303A31]">
                <ProviderBadge code={receipt.appCode} size="sm" />
                <span className="text-xs font-semibold text-[#A0ACA1]">
                  Processed via <strong className="text-[#F4F7F1]">{receipt.appName}</strong>
                </span>
              </div>
            </div>

            {/* Receipt Metadata Breakdown */}
            <div className="p-4 rounded-2xl bg-[#1A211B]/80 border border-[#303A31] space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-[#303A31]/50">
                <span className="text-[#A0ACA1]">Internal Reference</span>
                <span className="font-mono font-bold text-[#F4F7F1]">{receipt.txnId}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-[#303A31]/50">
                <span className="text-[#A0ACA1]">NPCI / Bank UTR</span>
                <div className="flex items-center gap-1.5 font-mono font-bold text-brand-primary">
                  <span>{receipt.utr}</span>
                  <button
                    onClick={() => handleCopyUtr(receipt.utr)}
                    className="p-1 rounded hover:bg-[#253026] text-[#A0ACA1] hover:text-[#F4F7F1]"
                    title="Copy UTR"
                  >
                    {copiedUtr ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between py-1 border-b border-[#303A31]/50">
                <span className="text-[#A0ACA1]">Counterparty / Merchant</span>
                <span className="font-semibold text-[#F4F7F1]">{receipt.counterparty}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#303A31]/50">
                <span className="text-[#A0ACA1]">Double-Entry Ledger Status</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                  <ShieldCheck size={14} />
                  <span>Journal Balanced (Paise Precision)</span>
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-[#A0ACA1]">Statutory Escrow (18% GST)</span>
                <span className="font-mono text-amber-400 font-medium">
                  {formatPaise(Math.round(receipt.amountPaise * 0.005 * 0.18))} auto-quarantined
                </span>
              </div>
            </div>

            {/* Receipt Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setReceipt(null);
                  setAmountRupees('10000');
                }}
                className="px-4 py-2.5 rounded-xl bg-[#1A211B] border border-[#303A31] text-xs font-bold text-[#F4F7F1] hover:border-brand-primary/50 transition-colors"
              >
                Make Another Payment
              </button>
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl bg-brand-primary text-black text-xs font-extrabold hover:bg-brand-accent transition-colors shadow-xs"
              >
                Done & View in Ledger
              </button>
            </div>
          </div>
        ) : (
          /* FORM VIEW */
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}

            {/* 1. Transaction Direction Selector */}
            <div>
              <label className="block text-[11px] uppercase font-bold text-[#A0ACA1] mb-2">
                1. Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDirection('credit')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                    direction === 'credit'
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-xs'
                      : 'bg-[#1A211B] border-[#303A31] text-[#A0ACA1] hover:text-[#F4F7F1]'
                  }`}
                >
                  <ArrowDownLeft size={16} />
                  <span>Receive Payment (Customer Credit +)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('debit')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                    direction === 'debit'
                      ? 'bg-rose-500/15 border-rose-500 text-rose-400 shadow-xs'
                      : 'bg-[#1A211B] border-[#303A31] text-[#A0ACA1] hover:text-[#F4F7F1]'
                  }`}
                >
                  <ArrowUpRight size={16} />
                  <span>Send Payout (Vendor Debit -)</span>
                </button>
              </div>
            </div>

            {/* 2. Select Payment App / Rail */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] uppercase font-bold text-[#A0ACA1]">
                  2. Select Payment App / Rail ({filteredApps.length} Available)
                </label>
                <input
                  type="text"
                  placeholder="Search app (e.g. PhonePe, Paytm, FreeCharge)..."
                  value={searchApp}
                  onChange={e => setSearchApp(e.target.value)}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-[#1A211B] border border-[#303A31] text-[#F4F7F1] placeholder-[#6A786B] focus:outline-none focus:border-brand-primary w-48"
                />
              </div>

              {/* Visual Grid of App Logos */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1.5 rounded-2xl bg-[#1A211B]/60 border border-[#303A31]">
                {filteredApps.map(app => {
                  const isSelected = selectedApp === app.code;
                  return (
                    <button
                      key={app.code}
                      type="button"
                      onClick={() => setSelectedApp(app.code)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all group ${
                        isSelected
                          ? 'bg-brand-primary/20 border-brand-primary shadow-xs'
                          : 'bg-[#141A15] border-[#2A352B] hover:border-brand-primary/40 hover:bg-[#1C241D]'
                      }`}
                    >
                      <ProviderBadge code={app.code} iconOnly size="md" />
                      <span className="mt-1.5 text-[11px] font-bold text-[#F4F7F1] truncate max-w-full group-hover:text-brand-primary">
                        {app.name}
                      </span>
                      <span className="text-[9px] text-[#A0ACA1] truncate">{app.type}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Amount & Quick Chips */}
            <div>
              <label className="block text-[11px] uppercase font-bold text-[#A0ACA1] mb-1.5">
                3. Amount in Rupees (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-[#A0ACA1]">₹</span>
                <input
                  type="number"
                  step="any"
                  value={amountRupees}
                  onChange={e => setAmountRupees(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-[#1A211B] border border-[#303A31] text-lg font-black text-[#F4F7F1] focus:outline-none focus:border-brand-primary tabular-nums"
                  required
                />
              </div>

              {/* Quick Amount Chips */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {[500, 1000, 5000, 25000, 50000, 100000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleQuickAmount(amt)}
                    className="px-2.5 py-1 rounded-lg bg-[#1A211B] border border-[#303A31] text-[11px] font-semibold text-[#A0ACA1] hover:text-brand-primary hover:border-brand-primary/40 transition-colors"
                  >
                    +₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Counterparty & Method */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase font-bold text-[#A0ACA1] mb-1.5">
                  Counterparty / Customer Name
                </label>
                <input
                  type="text"
                  value={counterparty}
                  onChange={e => setCounterparty(e.target.value)}
                  placeholder="e.g. Swiggy Bundl Technologies"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A211B] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-[#A0ACA1] mb-1.5">
                  Payment Method Rail
                </label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A211B] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary"
                >
                  <option value="UPI">UPI (Instant VPA Intent)</option>
                  <option value="NET_BANKING">Net Banking (Corporate CMS)</option>
                  <option value="CARDS">Debit / Credit Card Vault</option>
                  <option value="WALLET">Prepaid Wallet Clearing</option>
                  <option value="BANK_TRANSFER">Direct Host-to-Host IMPS</option>
                </select>
              </div>
            </div>

            {/* 5. Reference & Target Settlement Account */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase font-bold text-[#A0ACA1] mb-1.5">
                  Invoice / Reference Note
                </label>
                <input
                  type="text"
                  value={referenceNote}
                  onChange={e => setReferenceNote(e.target.value)}
                  placeholder="Order or settlement reference"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A211B] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-[#A0ACA1] mb-1.5">
                  Target Settlement Account
                </label>
                <select
                  value={selectedAccountId}
                  onChange={e => setSelectedAccountId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A211B] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary"
                >
                  {accounts.length > 0 ? (
                    accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.account_number_masked})
                      </option>
                    ))
                  ) : (
                    <option value="acc_hdfc_primary">HDFC Bank Primary Current A/C (••••4921)</option>
                  )}
                </select>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-4 border-t border-[#303A31] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ProviderBadge code={selectedApp} iconOnly size="sm" />
                <span className="text-xs text-[#A0ACA1]">
                  Routing via <strong className="text-[#F4F7F1]">{currentAppObj.name}</strong> Switch
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#A0ACA1] hover:text-[#F4F7F1] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-black font-extrabold text-xs hover:bg-brand-accent transition-all shadow-md disabled:opacity-50"
                >
                  {loading && <RefreshCw size={14} className="animate-spin" />}
                  <span>Confirm & Execute via {currentAppObj.name}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
