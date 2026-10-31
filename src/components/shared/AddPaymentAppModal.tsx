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
  const [search, setSearch] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successApp, setSuccessApp] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredApps = PAYMENT_APPS_CATALOG.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectApp = (app: typeof PAYMENT_APPS_CATALOG[0]) => {
    setSelectedApp(app);
    setWebhookUrl(`https://api.finova.internal/webhooks/${app.code}`);
    if (app.type.includes('UPI')) setCategory('UPI');
    else if (app.type.includes('Wallet') || app.type.includes('Purse')) setCategory('WALLET');
    else if (app.type.includes('Bank') || app.type.includes('Host')) setCategory('BANK');
    else setCategory('GATEWAY');
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
      <div className="relative w-full max-w-xl bg-[#131814] border border-[#303A31] rounded-3xl shadow-2xl overflow-hidden text-[#F4F7F1]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#303A31] bg-[#1A211B]/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary">
              <Plus size={18} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#F4F7F1]">
                {successApp ? 'Rail Connection Active' : 'Connect New Payment Application'}
              </h2>
              <p className="text-[11px] text-[#A0ACA1]">
                Integrate official Indian UPI switches, wallets, and banking APIs
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-[#A0ACA1] hover:text-[#F4F7F1] hover:bg-[#253026] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {successApp ? (
          /* SUCCESS VIEW */
          <div className="p-6 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <h3 className="text-lg font-black text-[#F4F7F1]">
                {successApp} Successfully Connected!
              </h3>
              <p className="text-xs text-[#A0ACA1] mt-1 max-w-md mx-auto">
                Live handshake verified. The rail is now active in your routing tree, transaction ingestion engine, and dashboard.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#1A211B] border border-[#303A31] flex items-center justify-between text-xs max-w-md mx-auto">
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
                className="px-6 py-2.5 rounded-xl bg-brand-primary text-black font-extrabold text-xs hover:bg-brand-accent transition-colors shadow-xs"
              >
                Go to Providers Console
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
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] uppercase font-bold text-[#A0ACA1]">
                  1. Choose Payment Application / Rail
                </label>
                <input
                  type="text"
                  placeholder="Filter apps..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="px-2 py-0.5 text-[11px] rounded-lg bg-[#1A211B] border border-[#303A31] text-[#F4F7F1] placeholder-[#6A786B] focus:outline-none w-36"
                />
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-44 overflow-y-auto p-1.5 rounded-2xl bg-[#1A211B]/60 border border-[#303A31]">
                {filteredApps.map(app => {
                  const isSelected = selectedApp.code === app.code;
                  return (
                    <button
                      key={app.code}
                      type="button"
                      onClick={() => handleSelectApp(app)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-brand-primary/20 border-brand-primary text-[#F4F7F1] shadow-xs'
                          : 'bg-[#141A15] border-[#2A352B] text-[#A0ACA1] hover:text-[#F4F7F1] hover:border-brand-primary/40'
                      }`}
                    >
                      <ProviderBadge code={app.code} iconOnly size="sm" />
                      <span className="mt-1 text-[11px] font-bold truncate max-w-full">
                        {app.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Merchant Identifier & Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase font-bold text-[#A0ACA1] mb-1.5">
                  Merchant ID / VPA / Terminal Ref
                </label>
                <input
                  type="text"
                  value={merchantId}
                  onChange={e => setMerchantId(e.target.value)}
                  placeholder="e.g. MERCH_891024"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A211B] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-[#A0ACA1] mb-1.5">
                  Operating Switch Mode
                </label>
                <select
                  value={environment}
                  onChange={e => setEnvironment(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A211B] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary"
                >
                  <option value="PRODUCTION">PRODUCTION (Live ISO Switch)</option>
                  <option value="SANDBOX">STAGING / RECON TEST</option>
                </select>
              </div>
            </div>

            {/* Category & Webhook */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase font-bold text-[#A0ACA1] mb-1.5">
                  Rail Classification
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A211B] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary"
                >
                  <option value="UPI">UPI Direct National Switch</option>
                  <option value="GATEWAY">Card & Net-Banking Gateway</option>
                  <option value="WALLET">RBI Certified PPI Wallet</option>
                  <option value="BANK">Host-to-Host Corporate CMS Bank</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-[#A0ACA1] mb-1.5">
                  Automated Webhook Endpoint
                </label>
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={e => setWebhookUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A211B] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary font-mono truncate"
                  required
                />
              </div>
            </div>

            {/* Security Guarantee Notice */}
            <div className="p-3.5 rounded-xl bg-[#1A211B] border border-[#303A31] flex items-center gap-2.5 text-xs text-[#A0ACA1]">
              <Lock size={15} className="text-brand-primary shrink-0" />
              <span>
                Zero credential exposure: Antigravity connects via official TLS 1.3 mTLS merchant tokens.
              </span>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-[#303A31] flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#A0ACA1] hover:text-[#F4F7F1]"
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
