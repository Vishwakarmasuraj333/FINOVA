'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Building2,
  ChevronDown,
  UserCheck,
} from 'lucide-react';
import { BrandLogo } from '@/components/layout/BrandLogo';
import { useAuth } from '@/lib/auth/AuthContext';
import { UserRole } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { login, allUsers } = useAuth();

  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
  const [email, setEmail] = useState('aditya.kashyap@finova.internal');
  const [password, setPassword] = useState('Finova@Enterprise#2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUserSelect = (idx: number) => {
    setSelectedUserIndex(idx);
    const u = allUsers[idx];
    if (u) {
      setEmail(u.email);
      setPassword('Finova@Enterprise#2026');
      setError(null);
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'Invalid corporate credentials.');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please check network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D100E] text-[#F4F7F1] flex flex-col justify-between selection:bg-brand-primary selection:text-black">
      {/* Top Bar */}
      <header className="border-b border-[#303A31]/70 px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <BrandLogo size="md" showTagline />
        </Link>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-[#A0ACA1] hidden sm:inline">New enterprise account?</span>
          <Link
            href="/signup"
            className="px-3.5 py-1.5 rounded-lg border border-[#303A31] text-[#F4F7F1] hover:border-brand-primary/50 hover:text-brand-primary transition-all font-semibold"
          >
            Register Entity
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Authoritative Financial Security Info */}
          <div className="lg:col-span-6 space-y-6 hidden lg:block pr-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
              <ShieldCheck size={14} />
              <span>Multi-Rail Security Switch v3.0</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-[#F4F7F1] leading-tight">
              Enterprise Access to Unified Financial Operations
            </h1>

            <p className="text-sm text-[#A0ACA1] leading-relaxed">
              Consolidated transaction auditing, real-time UPI switch telemetry, multi-bank host-to-host CMS clearing, and automated double-entry ledger reconciliation.
            </p>

            {/* Platform Status Pillar */}
            <div className="p-4 rounded-2xl bg-[#131814] border border-[#303A31] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#F4F7F1] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  National Payment Rails Telemetry
                </span>
                <span className="text-emerald-400 font-mono text-[11px] font-bold">99.98% Operational</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-[#1A211B] border border-[#303A31]">
                  <span className="text-[10px] text-[#A0ACA1] block">UPI Switch</span>
                  <span className="font-bold text-brand-primary font-mono text-xs">Active</span>
                </div>
                <div className="p-2 rounded-xl bg-[#1A211B] border border-[#303A31]">
                  <span className="text-[10px] text-[#A0ACA1] block">Bank H2H</span>
                  <span className="font-bold text-sky-400 font-mono text-xs">Connected</span>
                </div>
                <div className="p-2 rounded-xl bg-[#1A211B] border border-[#303A31]">
                  <span className="text-[10px] text-[#A0ACA1] block">Escrow Nodal</span>
                  <span className="font-bold text-emerald-400 font-mono text-xs">Balanced</span>
                </div>
              </div>
            </div>

            {/* Security Badges */}
            <div className="flex items-center gap-5 text-xs text-[#A0ACA1] pt-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-brand-primary" />
                <span>RBI Master Directions Compliant</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-brand-primary" />
                <span>256-Bit TLS 1.3 Encryption</span>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Professional Sign-In Card */}
          <div className="lg:col-span-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#131814] border border-[#303A31] shadow-2xl relative">
              <div className="mb-6 space-y-1">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-3 border border-brand-primary/20">
                  <UserCheck size={20} />
                </div>
                <h2 className="text-xl font-bold text-[#F4F7F1]">Sign In to Financial Console</h2>
                <p className="text-xs text-[#A0ACA1]">
                  Authenticate with your authorized corporate signatory credentials.
                </p>
              </div>

              {error && (
                <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2 text-xs text-rose-300">
                  <AlertCircle size={16} className="shrink-0 text-rose-400 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                {/* Authorized Account Profile Dropdown (Discreet & Professional) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#A0ACA1]">Select Authorized Signatory Account</label>
                  <div className="relative">
                    <select
                      value={selectedUserIndex}
                      onChange={e => handleUserSelect(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A211B] border border-[#303A31] text-xs text-[#F4F7F1] focus:border-brand-primary focus:outline-hidden appearance-none cursor-pointer"
                    >
                      {allUsers.map((u, i) => (
                        <option key={u.id} value={i}>
                          {u.name} — {u.role} ({u.email})
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3.5 top-3.5 text-[#A0ACA1] pointer-events-none" />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#A0ACA1]">Corporate Work Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-3 text-[#A0ACA1]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="name@company.internal"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1A211B] border border-[#303A31] text-xs text-[#F4F7F1] placeholder-[#606D62] focus:outline-hidden focus:border-brand-primary transition-colors font-mono"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#A0ACA1]">Security Password</label>
                    <a
                      href="#reset"
                      onClick={(e) => { e.preventDefault(); alert('Password reset verification link sent to enterprise administrator.'); }}
                      className="text-[11px] text-brand-primary hover:underline"
                    >
                      Forgot Password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-3 text-[#A0ACA1]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter security token"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#1A211B] border border-[#303A31] text-xs text-[#F4F7F1] placeholder-[#606D62] focus:outline-hidden focus:border-brand-primary transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-[#A0ACA1] hover:text-[#F4F7F1]"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-[#A0ACA1] hover:text-[#F4F7F1]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded-sm bg-[#1A211B] border-[#303A31] text-brand-primary focus:ring-0"
                    />
                    <span>Remember this workstation for 30 days</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-primary text-black font-extrabold text-xs hover:bg-brand-accent transition-all shadow-md shadow-brand-primary/10 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Authenticating Session...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Financial Console</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>

              {/* SSO Option */}
              <div className="mt-6 pt-5 border-t border-[#303A31] space-y-3">
                <p className="text-[11px] text-center text-[#A0ACA1]">Or authenticate with Corporate Federation</p>
                <button
                  type="button"
                  onClick={() => handleUserSelect(0)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1A211B] border border-[#303A31] hover:bg-[#222B23] text-xs font-semibold text-[#F4F7F1] transition-colors"
                >
                  <Building2 size={14} className="text-brand-primary" />
                  <span>Corporate Okta / Azure AD Single Sign-On</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#303A31]/70 px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A0ACA1] gap-2">
        <p>© 2026 FINOVA Enterprise Technologies Ltd. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="#compliance" className="hover:text-brand-primary">SOC 2 Type II</a>
          <span>•</span>
          <a href="#security" className="hover:text-brand-primary">NPCI Unified Switch Protocol</a>
          <span>•</span>
          <a href="#terms" className="hover:text-brand-primary">Master Service Agreement</a>
        </div>
      </footer>
    </div>
  );
}
