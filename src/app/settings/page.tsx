'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  RefreshCw,
  Shield,
  Key,
  CheckCircle2,
  Building,
  Mail,
  Sliders,
} from 'lucide-react';
import { SystemSettings } from '@/types';
import { useAuth } from '@/lib/auth/AuthContext';
import { useTheme } from '@/components/layout/ThemeProvider';

export default function SettingsPage() {
  const { currentUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form fields
  const [orgName, setOrgName] = useState('');
  const [legalEntity, setLegalEntity] = useState('');
  const [pan, setPan] = useState('');
  const [gstin, setGstin] = useState('');
  const [thresholdRupees, setThresholdRupees] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [notificationEmail, setNotificationEmail] = useState('');

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
      setOrgName(data.organization_name);
      setLegalEntity(data.legal_entity);
      setPan(data.pan);
      setGstin(data.gstin);
      setThresholdRupees((data.dual_approval_threshold_paise / 100).toString());
      setWebhookSecret(data.webhook_secret);
      setNotificationEmail(data.notification_email);
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      const thresholdPaise = Math.round(parseFloat(thresholdRupees || '0') * 100);
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': currentUser.role,
          'x-user-name': currentUser.name,
        },
        body: JSON.stringify({
          organization_name: orgName,
          legal_entity: legalEntity,
          pan,
          gstin,
          dual_approval_threshold_paise: thresholdPaise,
          webhook_secret: webhookSecret,
          notification_email: notificationEmail,
          theme_preference: theme,
        }),
      });

      if (!res.ok) throw new Error('Failed to update settings');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <RefreshCw size={24} className="animate-spin text-brand-primary" />
        <span className="text-xs text-[#A0ACA1]">Loading system configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#303A31] dark:border-[#303A31] light:border-[#E1E8DF]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
              Application & Treasury Settings
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/30">
              Corporate Config
            </span>
          </div>
          <p className="text-xs text-[#A0ACA1] mt-1">
            Organization compliance IDs, statutory GSTIN, payout authorization limits, and webhook security parameters.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Organization Identity */}
        <div className="p-6 rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#303A31]/60">
            <Building size={18} className="text-brand-primary" />
            <h2 className="text-sm font-bold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
              Corporate Legal Identity & Tax Profiles
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">Brand Name</label>
              <input
                type="text"
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">Registered Legal Entity</label>
              <input
                type="text"
                value={legalEntity}
                onChange={e => setLegalEntity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">Corporate PAN</label>
              <input
                type="text"
                value={pan}
                onChange={e => setPan(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">Statutory GSTIN</label>
              <input
                type="text"
                value={gstin}
                onChange={e => setGstin(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary font-mono"
              />
            </div>
          </div>
        </div>

        {/* Treasury Controls & Dual Approval */}
        <div className="p-6 rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#303A31]/60">
            <Shield size={18} className="text-brand-primary" />
            <h2 className="text-sm font-bold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
              Treasury Controls & Dual-Approval Limits
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">
                Dual Signatory Threshold (INR)
              </label>
              <input
                type="number"
                step="0.01"
                value={thresholdRupees}
                onChange={e => setThresholdRupees(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary tabular-nums"
              />
              <span className="text-[10px] text-[#A0ACA1] mt-1 block">
                Transfers at or above this value mandate dual approval by a distinct authorized approver.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">
                Compliance Alert Email
              </label>
              <input
                type="email"
                value={notificationEmail}
                onChange={e => setNotificationEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#F4F7F1] focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>
        </div>

        {/* Security & Webhook Signatures */}
        <div className="p-6 rounded-2xl bg-[#1A211B] border border-[#303A31] dark:bg-[#1A211B] dark:border-[#303A31] light:bg-white light:border-[#E1E8DF] space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#303A31]/60">
            <Key size={18} className="text-brand-primary" />
            <h2 className="text-sm font-bold text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219]">
              Webhook Signature Verification
            </h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A0ACA1] mb-1">
              Global Webhook Signing Secret
            </label>
            <input
              type="text"
              readOnly
              value={webhookSecret}
              className="w-full px-3 py-2 rounded-xl bg-[#131814] border border-[#303A31] text-xs text-[#A0ACA1] font-mono focus:outline-none"
            />
            <span className="text-[10px] text-[#A0ACA1] mt-1 block">
              Used to HMAC-SHA256 verify incoming webhooks from Razorpay, Cashfree, and PhonePe switches.
            </span>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {success ? (
            <span className="text-xs text-brand-primary font-semibold flex items-center gap-1.5">
              <CheckCircle2 size={16} />
              Settings saved and logged to audit trail!
            </span>
          ) : (
            <span />
          )}

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-primary text-black hover:bg-brand-accent transition-colors disabled:opacity-50 shadow-xs"
          >
            <Save size={15} />
            <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

