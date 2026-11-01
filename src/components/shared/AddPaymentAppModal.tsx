'use client';

import React, { useState } from 'react';
import {
  X,
  Plus,
  CheckCircle2,
  ShieldCheck,
  Search,
  Zap,
  Globe,
  RefreshCw,
  Building,
  Lock,
  Check,
} from 'lucide-react';
import { ProviderBadge } from '@/components/shared/ProviderBadge';
import { PAYMENT_APPS_CATALOG } from '@/components/shared/MakePaymentModal';

export interface AddPaymentAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddPaymentAppModal({
  isOpen,
  onClose,
  onSuccess,
}: AddPaymentAppModalProps) {
  const [selectedApp, setSelectedApp] = useState(PAYMENT_APPS_CATALOG[0]);
  const [merchantId, setMerchantId] = useState(`MID_${Math.floor(100000 + Math.random() * 900000)}`);
  const [webhookUrl, setWebhookUrl] = useState(`https://api.finova.internal/webhooks/${PAYMENT_APPS_CATALOG[0].code}`);
  const [environment, setEnvironment] = useState<'PRODUCTION' | 'SANDBOX'>('PRODUCTION');
  const [category, setCategory] = useState<'UPI' | 'GATEWAY' | 'WALLET' | 'BANK'>('UPI');
  const [activeTab, setActiveTab] = useState<'ALL' | 'UPI' | 'BANK' | 'GATEWAY' | 'WALLET'>('ALL');
  const [search, setSearch] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successApp, setSuccessApp] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredApps = PAYMENT_APPS_CATALOG.filter(a => {
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.code.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeTab === 'ALL') return true;
    if (activeTab === 'UPI') return a.type.toLowerCase().includes('upi') || a.code === 'phonepe' || a.code === 'gpay' || a.code === 'paytm' || a.code === 'bharatpe' || a.code === 'bhim';
    if (activeTab === 'BANK') return a.type.toLowerCase().includes('bank') || a.type.toLowerCase().includes('cib') || a.type.toLowerCase().includes('host');
    if (activeTab === 'GATEWAY') return a.type.toLowerCase().includes('gateway') || a.code === 'razorpay' || a.code === 'cashfree' || a.code === 'stripe' || a.code === 'paypal';
    if (activeTab === 'WALLET') return a.type.toLowerCase().includes('wallet') || a.type.toLowerCase().includes('ppi') || a.type.toLowerCase().includes('card');
    return true;
  });

  const handleSelectApp = (app: typeof PAYMENT_APPS_CATALOG[0]) => {
    setSelectedApp(app);
    setWebhookUrl(`https://api.finova.internal/webhooks/${app.code}`);
    
    // Auto populate realistic Merchant ID
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    if (app.type.includes('UPI')) {
      setCategory('UPI');
      setMerchantId(`UPI_${app.code.toUpperCase()}_${randomSuffix}`);
    } else if (app.type.includes('Bank') || app.type.includes('Host') || app.type.includes('CIB')) {
      setCategory('BANK');
      setMerchantId(`H2H_${app.code.toUpperCase()}_${randomSuffix}`);
    } else if (app.type.includes('Wallet') || app.type.includes('PPI')) {
      setCategory('WALLET');
      setMerchantId(`WALLET_${app.code.toUpperCase()}_${randomSuffix}`);
    } else {
      setCategory('GATEWAY');
      setMerchantId(`MID_${app.code.toUpperCase()}_${randomSuffix}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/providers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'Super Admin',
          'x-user-name': 'Aditya Kashyap',
        },
        body: JSON.stringify({
          id: `prov_${selectedApp.code}`,
          name: `${selectedApp.name} Direct Switch`,
          code: selectedApp.code,
          category,
          environment,
          status: 'CONNECTED',
          webhook_url: webhookUrl,
          supported_operations: ['PAYMENTS', 'REFUNDS', 'SETTLEMENTS'],
          merchant_id_masked: `${merchantId.slice(0, 4)}••••${merchantId.slice(-4)}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to connect payment provider');

      setSuccessApp(selectedApp.name);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error adding payment application');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccessApp(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#131814] dark:bg-[#131814] light:bg-white border border-[#303A31] dark:border-[#303A31] light:border-[#E1E8DF] rounded-3xl shadow-2xl overflow-hidden text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#303A31] dark:border-[#303A31] light:border-[#E1E8DF] bg-[#1A211B]/80 dark:bg-[#1A211B]/80 light:bg-[#F8FAF7]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary">
              <Plus size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                {successApp ? 'Rail Connection Active' : 'Connect New Payment Application & Rail'}
              </h2>
              <p className="text-[11px] text-[#A0ACA1] dark:text-[#A0ACA1] light:text-[#687568]">
                Integrate official Indian UPI switches, corporate bank APIs, and gateways
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-[#A0ACA1] hover:text-[#F4F7F1] dark:hover:text-[#F4F7F1] light:hover:text-[#192219] hover:bg-[#253026] dark:hover:bg-[#253026] light:hover:bg-[#EAEFE8] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {successApp ? (
          /* SUCCESS VIEW */
          <div className="p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <h3 className="text-lg font-black text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                {successApp} Successfully Connected!
              </h3>
              <p className="text-xs text-[#A0ACA1] dark:text-[#A0ACA1] light:text-[#687568] mt-1.5 max-w-md mx-auto">
                Live handshake verified. The rail is now active in your routing tree, transaction ingestion engine, and dashboard.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#1A211B] dark:bg-[#1A211B] light:bg-[#F8FAF7] border border-[#303A31] dark:border-[#303A31] light:border-[#E1E8DF] flex items-center justify-between text-xs max-w-md mx-auto">
              <div className="flex items-center gap-2.5">
                <ProviderBadge code={selectedApp.code} size="sm" />
                <span className="font-semibold">{selectedApp.name}</span>
              </div>
              <span className="font-mono text-emerald-400 font-bold text-[11px]">
                SLA: 99.8% • LIVE
              </span>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl bg-brand-primary text-black font-extrabold text-xs hover:bg-brand-accent transition-colors shadow-sm"
              >
                Close & View Active Rails
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

            {/* Select Rail from Catalog */}
            <div className="space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-[11px] uppercase tracking-wider font-extrabold text-[#A0ACA1] dark:text-[#A0ACA1] light:text-[#687568]">
                  1. Choose Official Payment Application / Rail
                </label>
                <div className="relative">
                  <Search size={13} className="absolute left-2.5 top-2 text-[#A0ACA1]" />
                  <input
                    type="text"
                    placeholder="Search rails..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-7 pr-3 py-1 text-[11px] rounded-lg bg-[#1A211B] dark:bg-[#1A211B] light:bg-[#F8FAF7] border border-[#303A31] dark:border-[#303A31] light:border-[#D1DCD0] text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219] placeholder-[#6A786B] focus:outline-none focus:border-brand-primary w-40 sm:w-48"
                  />
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                {(['ALL', 'UPI', 'BANK', 'GATEWAY', 'WALLET'] as const).map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all ${
                      activeTab === tab
                        ? 'bg-brand-primary text-black shadow-xs'
                        : 'bg-[#1A211B] dark:bg-[#1A211B] light:bg-[#F0F4EE] text-[#A0ACA1] dark:text-[#A0ACA1] light:text-[#687568] hover:text-[#F4F7F1] dark:hover:text-[#F4F7F1] light:hover:text-[#192219]'
                    }`}
                  >
                    {tab === 'ALL' ? 'All Rails' : tab === 'UPI' ? 'UPI Apps' : tab === 'BANK' ? 'Corporate Banks' : tab === 'GATEWAY' ? 'Gateways' : 'Wallets & Cards'}
                  </button>
                ))}
              </div>

              {/* Apps Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto p-2.5 rounded-2xl bg-[#1A211B]/60 dark:bg-[#1A211B]/60 light:bg-[#F8FAF7] border border-[#303A31] dark:border-[#303A31] light:border-[#E1E8DF] scrollbar-thin">
                {filteredApps.map(app => {
                  const isSelected = selectedApp.code === app.code;
                  return (
                    <button
                      key={app.code}
                      type="button"
                      onClick={() => handleSelectApp(app)}
                      className={`relative flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-brand-primary/15 border-brand-primary text-brand-primary shadow-sm'
                          : 'bg-[#141A15] dark:bg-[#141A15] light:bg-white border-[#2A352B] dark:border-[#2A352B] light:border-[#E1E8DF] text-[#A0ACA1] dark:text-[#A0ACA1] light:text-[#687568] hover:text-[#F4F7F1] dark:hover:text-[#F4F7F1] light:hover:text-[#192219] hover:border-brand-primary/40'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-brand-primary text-black flex items-center justify-center">
                          <Check size={10} strokeWidth={3} />
                        </div>
                      )}
                      <ProviderBadge code={app.code} iconOnly size="sm" />
                      <span className="mt-2 text-[11px] font-bold truncate max-w-full text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
                        {app.name}
                      </span>
                      <span className="text-[9px] text-[#A0ACA1] dark:text-[#A0ACA1] light:text-[#687568] truncate max-w-full">
                        {app.type}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Merchant Identifier & Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase font-bold text-[#A0ACA1] dark:text-[#A0ACA1] light:text-[#687568] mb-1.5">
                  Merchant ID / VPA / Terminal Ref
                </label>
                <input
                  type="text"
                  value={merchantId}
                  onChange={e => setMerchantId(e.target.value)}
                  placeholder="e.g. MERCH_891024"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A211B] dark:bg-[#1A211B] light:bg-[#F8FAF7] border border-[#303A31] dark:border-[#303A31] light:border-[#D1DCD0] text-xs text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219] focus:outline-none focus:border-brand-primary font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-[#A0ACA1] dark:text-[#A0ACA1] light:text-[#687568] mb-1.5">
                  Operating Switch Mode
                </label>
                <select
                  value={environment}
                  onChange={e => setEnvironment(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A211B] dark:bg-[#1A211B] light:bg-[#F8FAF7] border border-[#303A31] dark:border-[#303A31] light:border-[#D1DCD0] text-xs text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219] focus:outline-none focus:border-brand-primary"
                >
                  <option value="PRODUCTION">PRODUCTION (Live ISO Switch)</option>
                  <option value="SANDBOX">STAGING / RECON TEST</option>
                </select>
              </div>
            </div>

            {/* Category & Webhook */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase font-bold text-[#A0ACA1] dark:text-[#A0ACA1] light:text-[#687568] mb-1.5">
                  Rail Classification
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A211B] dark:bg-[#1A211B] light:bg-[#F8FAF7] border border-[#303A31] dark:border-[#303A31] light:border-[#D1DCD0] text-xs text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219] focus:outline-none focus:border-brand-primary"
                >
                  <option value="UPI">UPI Direct National Switch</option>
                  <option value="GATEWAY">Card & Net-Banking Gateway</option>
                  <option value="WALLET">RBI Certified PPI Wallet</option>
                  <option value="BANK">Host-to-Host Corporate CMS Bank</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-[#A0ACA1] dark:text-[#A0ACA1] light:text-[#687568] mb-1.5">
                  Automated Webhook Endpoint
                </label>
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={e => setWebhookUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A211B] dark:bg-[#1A211B] light:bg-[#F8FAF7] border border-[#303A31] dark:border-[#303A31] light:border-[#D1DCD0] text-xs text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219] focus:outline-none focus:border-brand-primary font-mono truncate"
                  required
                />
              </div>
            </div>

            {/* Security Guarantee Notice */}
            <div className="p-3.5 rounded-xl bg-[#1A211B] dark:bg-[#1A211B] light:bg-[#F8FAF7] border border-[#303A31] dark:border-[#303A31] light:border-[#E1E8DF] flex items-center gap-2.5 text-xs text-[#A0ACA1] dark:text-[#A0ACA1] light:text-[#687568]">
              <Lock size={15} className="text-brand-primary shrink-0" />
              <span>
                Zero credential exposure: FINOVA Enterprise connects via official TLS 1.3 mTLS merchant tokens.
              </span>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-[#303A31] dark:border-[#303A31] light:border-[#E1E8DF] flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#A0ACA1] dark:text-[#A0ACA1] light:text-[#687568] hover:text-[#F4F7F1] dark:hover:text-[#F4F7F1] light:hover:text-[#192219]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-black font-extrabold text-xs hover:bg-brand-accent transition-all shadow-md disabled:opacity-50"
              >
                {loading && <RefreshCw size={14} className="animate-spin" />}
                <span>Connect & Verify {selectedApp.name} Rail</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
