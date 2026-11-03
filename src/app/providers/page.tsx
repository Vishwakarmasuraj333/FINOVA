'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Plus,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  Settings2,
  Play,
  ArrowRight,
  Lock,
  Zap,
  Trash2,
} from 'lucide-react';
import { PaymentProvider } from '@/types';
import { ProviderBadge } from '@/components/shared/ProviderBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDateTime } from '@/lib/utils/format';
import { useAuth } from '@/lib/auth/AuthContext';
import { AddPaymentAppModal } from '@/components/shared/AddPaymentAppModal';
import { MakePaymentModal } from '@/components/shared/MakePaymentModal';

export default function ProvidersPage() {
  const { currentUser } = useAuth();
  const [providers, setProviders] = useState<PaymentProvider[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Provider Configuration Modal
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [makePaymentOpen, setMakePaymentOpen] = useState(false);
  const [selectedAppCode, setSelectedAppCode] = useState('phonepe');

  // Action states
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ id: string; text: string; isError?: boolean } | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formCategory, setFormCategory] = useState<'UPI' | 'GATEWAY' | 'BANK' | 'WALLET'>('GATEWAY');
  const [formEnv, setFormEnv] = useState<'SANDBOX' | 'PRODUCTION'>('SANDBOX');
  const [formWebhook, setFormWebhook] = useState('');

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/providers');
      const data = await res.json();
      setProviders(data);
    } catch (err) {
      console.error('Error fetching providers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  // Test Connection
  const handleTestConnection = async (provider: PaymentProvider) => {
    setActionLoadingId(provider.id);
    setFeedbackMessage(null);
    try {
      const res = await fetch(`/api/providers/${provider.id}/test`, {
        method: 'POST',
        headers: {
          'x-user-role': currentUser.role,
          'x-user-name': currentUser.name,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setFeedbackMessage({
        id: provider.id,
        text: data.status === 'NOT_CONNECTED'
          ? `Handshake Failed: ${data.last_error}`
          : `Handshake Verified! Health Score: ${data.health_score}%`,
        isError: data.status === 'NOT_CONNECTED',
      });
      fetchProviders();
    } catch (err: any) {
      setFeedbackMessage({ id: provider.id, text: err.message, isError: true });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Sync Provider
  const handleSyncProvider = async (provider: PaymentProvider) => {
    setActionLoadingId(provider.id);
    setFeedbackMessage(null);
    try {
      const res = await fetch(`/api/providers/${provider.id}/sync`, {
        method: 'POST',
        headers: {
          'x-user-role': currentUser.role,
          'x-user-name': currentUser.name,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setFeedbackMessage({
        id: provider.id,
        text: `Successfully synced ledger & settlements with ${provider.name}`,
      });
      fetchProviders();
    } catch (err: any) {
      setFeedbackMessage({ id: provider.id, text: err.message, isError: true });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Save / Update Configuration
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/providers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': currentUser.role,
          'x-user-name': currentUser.name,
        },
        body: JSON.stringify({
          id: selectedProvider?.id,
          name: formName || selectedProvider?.name,
          code: formCode || selectedProvider?.code,
          category: formCategory,
          environment: formEnv,
          webhook_url: formWebhook,
        }),
      });

      if (!res.ok) throw new Error('Failed to save provider configuration');
      setIsConfigOpen(false);
      setIsAddOpen(false);
      fetchProviders();
    } catch (err: any) {
      setFeedbackMessage({ id: 'config_err', text: err.message, isError: true });
    }
  };

  // Disconnect / Delete Provider
  const handleDeleteProvider = async (provider: PaymentProvider) => {
    setActionLoadingId(provider.id);
    setFeedbackMessage(null);
    try {
      const res = await fetch(`/api/providers?id=${provider.id}`, {
        method: 'DELETE',
        headers: {
          'x-user-role': currentUser.role,
          'x-user-name': currentUser.name,
        },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to remove provider');
      }
      setFeedbackMessage({ id: provider.id, text: `Successfully disconnected rail ${provider.name}.` });
      fetchProviders();
    } catch (err: any) {
      setFeedbackMessage({ id: provider.id, text: err.message, isError: true });
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#303A31] dark:border-[#303A31] light:border-[#E1E8DF]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
              Payment Providers & Rails
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/30">
              {providers.length} Registered
            </span>
          </div>
          <p className="text-xs text-[#A0ACA1] mt-1">
            Configure official API credentials, test handshake health, and trigger ledger synchronization.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => {
              setSelectedAppCode('phonepe');
              setMakePaymentOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-primary text-black font-extrabold text-xs hover:bg-brand-accent transition-all shadow-md shadow-brand-primary/20"
          >
            <Zap size={14} />
            <span>Make / Collect Payment</span>
          </button>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1A211B] border border-[#303A31] text-[#F4F7F1] font-bold text-xs hover:border-brand-primary/50 transition-colors shadow-xs"
          >
            <Plus size={15} />
            <span>Connect Payment App</span>
          </button>
        </div>
      </div>

      {/* Honest Integration Notice */}
      <div className="p-4 rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] flex items-start gap-3">
        <ShieldAlert size={18} className="text-brand-primary shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
            Enterprise Integration Standards & Zero-Credential Exposure Policy
          </div>
          <p className="text-[#A0ACA1] leading-relaxed">
            FINOVA connects exclusively via approved merchant APIs, direct NPCI UPI switches, and corporate Host-to-Host bank channels. We never scrape private accounts or ask for consumer wallet PINs, OTPs, or passwords. Disconnected rails require authorized credentials before synchronization.
          </p>
        </div>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {providers.map(provider => {
          const isProcessing = actionLoadingId === provider.id;
          const msg = feedbackMessage && feedbackMessage.id === provider.id ? feedbackMessage : null;

          return (
            <div
              key={provider.id}
              className="p-5 rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] hover:border-brand-primary/40 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <ProviderBadge code={provider.code} name={provider.name} size="lg" />
                  <StatusBadge status={provider.status} size="sm" />
                </div>

                {/* Sub details */}
                <div className="space-y-2 text-xs mb-4">
                  <div className="flex justify-between py-1 border-b border-[#303A31]/40">
                    <span className="text-[#A0ACA1]">Environment</span>
                    <span className="font-mono text-[11px] font-bold text-brand-primary">
                      {provider.environment}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#303A31]/40">
                    <span className="text-[#A0ACA1]">Merchant Ref</span>
                    <span className="font-mono text-[11px] text-[#F4F7F1]">
                      {provider.merchant_id_masked}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#303A31]/40">
                    <span className="text-[#A0ACA1]">Health Score</span>
                    <span className="font-mono text-[11px] font-bold text-emerald-400">
                      {provider.health_score}%
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#303A31]/40">
                    <span className="text-[#A0ACA1]">Last Synced</span>
                    <span className="text-[11px] text-[#A0ACA1]">
                      {formatDateTime(provider.last_synced_at)}
                    </span>
                  </div>

                  {provider.last_error && (
                    <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] leading-snug">
                      <strong>Reason: </strong> {provider.last_error}
                    </div>
                  )}

                  {msg && (
                    <div
                      className={`p-2 rounded-lg text-[11px] ${
                        msg.isError
                          ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                          : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      }`}
                    >
                      {msg.text}
                    </div>
                  )}
                </div>

                {/* Supported capabilities pills */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {provider.supported_operations.map(op => (
                    <span
                      key={op}
                      className="px-2 py-0.5 rounded-md text-[9px] font-semibold bg-[#131814] text-[#A0ACA1] border border-[#303A31]"
                    >
                      {op}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#303A31] flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleTestConnection(provider)}
                  disabled={isProcessing}
                  className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-[#131814] border border-[#303A31] hover:bg-[#222B23] text-[#F4F7F1] flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw size={13} className={isProcessing ? 'animate-spin text-brand-primary' : ''} />
                  <span>Test API</span>
                </button>

                {provider.status !== 'NOT_CONNECTED' ? (
                  <button
                    onClick={() => handleSyncProvider(provider)}
                    disabled={isProcessing}
                    className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold bg-brand-primary/15 border border-brand-primary/30 hover:bg-brand-primary/25 text-brand-primary flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <span>Sync</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedProvider(provider);
                      setFormName(provider.name);
                      setFormCode(provider.code);
                      setFormEnv(provider.environment);
                      setFormWebhook(provider.webhook_url);
                      setIsConfigOpen(true);
                    }}
                    className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center gap-1.5"
                  >
                    <span>Connect</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setSelectedAppCode(provider.code);
                    setMakePaymentOpen(true);
                  }}
                  className="py-1.5 px-2.5 rounded-lg text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 flex items-center justify-center gap-1"
                  title="Make a transaction using this rail"
                >
                  <Zap size={13} />
                  <span>Pay</span>
                </button>

                <Link
                  href={`/transactions?provider_id=${provider.id}`}
                  className="p-1.5 rounded-lg text-[#A0ACA1] hover:text-[#F4F7F1] hover:bg-[#131814]"
                  title="View Transactions for this provider"
                >
                  <ExternalLink size={15} />
                </Link>

                <button
                  type="button"
                  onClick={() => handleDeleteProvider(provider)}
                  disabled={isProcessing}
                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                  title={`Disconnect & remove ${provider.name}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Configuration / Connect Modal */}
      {isConfigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <form
            onSubmit={handleSaveConfig}
            className="w-full max-w-lg p-6 rounded-2xl bg-[#1A211B] border border-[#303A31] space-y-4 animate-slide-up"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#303A31]">
              <h3 className="text-base font-bold text-[#F4F7F1]">
                {isAddOpen ? 'Register New Payment Provider' : `Configure ${selectedProvider?.name}`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsConfigOpen(false);
                  setIsAddOpen(false);
                }}
                className="p-1 rounded-md text-[#A0ACA1] hover:text-[#F4F7F1]"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">Provider Name</label>
              <input
                type="text"
                required
                value={formName}
                onChange={e => setFormName(e.target.value)}
                placeholder="e.g. PayU Enterprise Gateway"
                className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">Environment</label>
                <select
                  value={formEnv}
                  onChange={e => setFormEnv(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none"
                >
                  <option value="SANDBOX">Sandbox Mode</option>
                  <option value="PRODUCTION">Production Mode</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">Category</label>
                <select
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none"
                >
                  <option value="GATEWAY">Payment Gateway</option>
                  <option value="UPI">UPI Direct Switch</option>
                  <option value="BANK">Host-to-Host Bank</option>
                  <option value="WALLET">Escrow / Wallet Pool</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">Webhook Ingestion Endpoint</label>
              <input
                type="url"
                required
                value={formWebhook}
                onChange={e => setFormWebhook(e.target.value)}
                placeholder="https://api.finova.internal/webhooks/..."
                className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary font-mono"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#101310] border border-[#303A31] text-[11px] text-[#A0ACA1]">
              <span className="font-bold text-[#F4F7F1]">Security Guarantee: </span>
              Production API secret keys are stored securely in environment variables and never logged or serialized to the browser.
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  setIsConfigOpen(false);
                  setIsAddOpen(false);
                }}
                className="px-4 py-2 text-xs font-medium text-[#A0ACA1] hover:text-[#F4F7F1]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-primary text-black hover:bg-brand-accent transition-colors"
              >
                Save Configuration
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Real Payment Execution Modal */}
      <MakePaymentModal
        isOpen={makePaymentOpen}
        onClose={() => setMakePaymentOpen(false)}
        onSuccess={() => {
          fetchProviders();
        }}
        initialProviderCode={selectedAppCode}
      />

      {/* Connect New Payment Application Modal */}
      <AddPaymentAppModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => {
          fetchProviders();
        }}
      />
    </div>
  );
}

